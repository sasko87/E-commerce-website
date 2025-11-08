import { filterCoupon, getOneCoupon } from "../pkg/coupon.model.js";

const getCoupon = async (req, res) => {
  try {
    const coupon = await getOneCoupon(req.user._id);
    return res.status(200).send(coupon);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await filterCoupon({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).send({ error: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).send({ error: "Coupon expired" });
    }
    return res.status(200).send({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export { getCoupon, validateCoupon };
