import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];
const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isFeatured: false,
    onSale: false,
    saleDiscount: 0,
    gender: "Unisex",
  });
  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct(newProduct);

    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-300">
            Gender
          </p>
          <div className=" flex gap-4 my-3">
            <label className="text-sm font-medium text-gray-300">
              <input
                className="mr-1"
                type="radio"
                name="gender"
                value="Male"
                checked={newProduct.gender === 'Male'}
                onChange={() =>
                  setNewProduct({ ...newProduct, gender: 'Male' })
                }
              />
              Male
            </label>
            <label className="text-sm font-medium text-gray-300">
              <input
                className="mr-1"
                type="radio"
                name="gender"
                value="Female"
                checked={newProduct.gender === 'Female'}
                onChange={() =>
                  setNewProduct({ ...newProduct, gender: 'Female' })
                }
              />
              Female
            </label>
            <label className="text-sm font-medium text-gray-300">
              <input
                className="mr-1"
                type="radio"
                name="gender"
                value="Unisex"
                checked={newProduct.gender === 'Unisex'}
                onChange={() =>
                  setNewProduct({ ...newProduct, gender: 'unisex' })
                }
              />
              Unisex
            </label>
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-300">
            Is the product featured?
          </p>
          <div className=" flex gap-4 my-3">
            <label className="text-sm font-medium text-gray-300">
              <input
                className="mr-1"
                type="radio"
                name="featuredOption"
                value="true"
                checked={newProduct.isFeatured === true}
                onChange={() =>
                  setNewProduct({ ...newProduct, isFeatured: true })
                }
              />
              Yes
            </label>
            <label className="text-sm font-medium text-gray-300">
              <input
                className="mr-1"
                type="radio"
                name="featuredOption"
                value="false"
                checked={newProduct.isFeatured === false}
                onChange={() =>
                  setNewProduct({ ...newProduct, isFeatured: false })
                }
              />
              No
            </label>
          </div>
        </div>
        <div>
          <p className="block text-sm font-medium text-gray-300">
            Is the product on sale?
          </p>
          <div className=" flex items-center gap-4 my-3">
            <label className="text-sm font-medium text-gray-300">
              <input
                className="mr-1"
                type="radio"
                name="saleOption"
                value="true"
                checked={newProduct.onSale === true}
                onChange={() => setNewProduct({ ...newProduct, onSale: true })}
              />
              Yes
            </label>
            {newProduct.onSale && (
              <input
                type="number"
                placeholder="Sale Discount %"
                className="border border-white/40 rounded"
                value={newProduct.saleDiscount}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    saleDiscount: Number(e.target.value),
                  })
                }
              />
            )}

            <label className="text-sm font-medium text-gray-300">
              <input
                className="mr-1"
                type="radio"
                name="saleOption"
                value="false"
                checked={newProduct.onSale === false}
                onChange={() => setNewProduct({ ...newProduct, onSale: false })}
              />
              No
            </label>
          </div>
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
