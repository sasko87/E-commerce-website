import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Unisex"],
      default: "Unisex",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    saleDiscount: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (v) {
          return v <= this.price;
        },
        message: "Sale price cannot be higher than original price",
      },
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.onSale && this.saleDiscount > 0) {
    this.salePrice = this.price - (this.price * this.saleDiscount) / 100;
  } else {
    this.salePrice = this.price;
  }
  next();
});

productSchema.virtual("finalPrice").get(function () {
  if (this.onSale && this.saleDiscount > 0) {
    return this.price - (this.price * this.saleDiscount) / 100;
  }
  return this.price;
});

// Ensure virtuals are included in JSON responses
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema, "products");

const findAllProducts = async () => {
  return await Product.find({});
};

const filterProducts = async (filter) => {
  return await Product.find(filter);
};

const createNewProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

const deleteOneProduct = async (id) => {
  return await Product.deleteOne({ _id: id });
};

const recommendedProducts = async () => {
  const products = await Product.aggregate([
    { $sample: { size: 3 } }, // pick 3 random products
  ]);
  return products.map((p) => ({
    ...p,
    finalPrice:
      p.onSale && p.saleDiscount > 0
        ? p.price - (p.price * p.saleDiscount) / 100
        : p.price,
  }));
};

const updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export {
  findAllProducts,
  filterProducts,
  createNewProduct,
  deleteOneProduct,
  recommendedProducts,
  Product,
  updateProduct,
};
