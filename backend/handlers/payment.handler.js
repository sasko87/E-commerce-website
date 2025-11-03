import { stripe } from "../lib/stripe.js";
import {
  Coupon,
  createCoupon,
  filterCoupon,
  getOneCoupon,
  updateCoupon,
} from "../pkg/coupon.model.js";
import { createOrder, findOrderByStripeSession } from "../pkg/order.model.js";

const createChechoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    //check if products is an array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }
    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // price in cents
      totalAmount += amount * (product.quantity || 1);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    let coupon = null;

    if (couponCode) {
      coupon = await filterCoupon({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }
    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      totalAmount: totalAmount / 100, // convert cents to dollars
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId: userId });
  const newCoupon = await createCoupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  return newCoupon;
}

const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing session ID." });
    }

    // ✅ Check if order already exists
    const existingOrder = await findOrderByStripeSession(sessionId);
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists for this session.",
        orderId: existingOrder._id,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed yet." });
    }

    // 🎟️ Handle coupon deactivation
    if (session.metadata?.couponCode) {
      const coupon = await getOneCoupon({
        code: session.metadata.couponCode,
        userId: session.metadata.userId,
      });

      if (coupon) {
        await updateCoupon({ id: coupon._id, isActive: false });
      }
    }

    // 🛍️ Create new order
    const products = JSON.parse(session.metadata.products || "[]");

    const newOrder = await createOrder({
      user: session.metadata.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: sessionId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment successful, order created.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Checkout success error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export { createChechoutSession, checkoutSuccess };
