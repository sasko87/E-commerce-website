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
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

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
  return await Product.aggregate([
    { $sample: { size: 3 } }, // pick 3 random products
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        price: 1,
      },
    },
  ]);
};

export {
  findAllProducts,
  filterProducts,
  createNewProduct,
  deleteOneProduct,
  recommendedProducts,
  Product,
};
