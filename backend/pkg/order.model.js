import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Done", "Canceled"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "orders");

const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

const findOrderByStripeSession = async (sessionId) => {
  return await Order.findOne({ stripeSessionId: sessionId });
};

const findOrders = async () => {
  return await Order.find({}).populate({
    path: "products.product",
  });
};

const updateOrder = async (id, data) => {
  return await Order.findByIdAndUpdate(id, data, { new: true });
};
export {
  createOrder,
  Order,
  findOrderByStripeSession,
  findOrders,
  updateOrder,
};
