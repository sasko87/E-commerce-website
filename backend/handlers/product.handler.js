import {
  findAllProducts,
  filterProducts,
  createNewProduct,
  deleteOneProduct,
  recommendedProducts,
  Product,
  updateProduct,
} from "../pkg/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await findAllProducts();
    return res.status(200).send({ products });
  } catch (error) {
    console.log(error);
    return res.status().send({ error: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.status(200).send(JSON.parse(featuredProducts));
    }
    featuredProducts = await filterProducts({ isFeatured: true });
    if (!featuredProducts) {
      return res.status(404).send({ error: "No featured products found" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));
    return res.status(200).send(featuredProducts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      onSale,
      saleDiscount,
      isFeatured,
      gender,
    } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await createNewProduct({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      onSale,
      saleDiscount,
      isFeatured,
      gender,
    });

    if (isFeatured) {
      const featuredProducts = await filterProducts({ isFeatured: true });
      await redis.set("featured_products", JSON.stringify(featuredProducts));
    }

    return res.status(201).send(product);
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await filterProducts({ _id: req.params.id });
    if (!product) {
      return res.status(404).send({ error: "Not Found!" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted Image from cloudinary");
      } catch (error) {
        console.log(error.message);
      }
    }
    await deleteOneProduct(req.params.id);
    return res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getRecommendedProducts = async (req, res) => {
  try {
    const products = await recommendedProducts();
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getProductsByCategoory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await filterProducts({ category: category });

    return res.status(200).send({ products });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    await updateFeaturedProductsCache();
    return res.status(200).send(updatedProduct);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await filterProducts({ isFeatured: true });
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

const updateOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await updateProduct(id, updateData);

    const featuredProducts = await filterProducts({ isFeatured: true });
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    return res.status(200).send(updatedProduct);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getProductsOnSale = async (req, res) => {
  try {
    const { category, gender, sort } = req.query;
    let filter = { onSale: true };

    if (category) filter.category = category;
    if (gender) filter.gender = gender;

    let products = await Product.find(filter);

    // ✅ Sort logic
    if (sort === "price_asc") products.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") products.sort((a, b) => b.price - a.price);
    if (sort === "discount_desc")
      products.sort((a, b) => (b.saleDiscount || 0) - (a.saleDiscount || 0));

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products on sale" });
  }
};

export {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategoory,
  toggleFeaturedProduct,
  updateOneProduct,
  getProductsOnSale,
};
