import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requred: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema, "coupons");

const getOneCoupon = async (filter) => {
  // If filter contains userId, cast it to ObjectId safely
  if (filter.userId && mongoose.Types.ObjectId.isValid(filter.userId)) {
    filter.userId = new mongoose.Types.ObjectId(filter.userId);
  }

  return await Coupon.findOne({ ...filter, isActive: true });
};

const filterCoupon = async (filter) => {
  return await Coupon.findOne(filter);
};

const createCoupon = async (couponData) => {
  const coupon = new Coupon(couponData);
  return await coupon.save();
};

const updateCoupon = async (couponId, isActive) => {
  return await Coupon.updateOne(
    { _id: couponId }, // which coupon
    { $set: { isActive } } // what to change
  );
};

export { getOneCoupon, filterCoupon, createCoupon, updateCoupon, Coupon };
