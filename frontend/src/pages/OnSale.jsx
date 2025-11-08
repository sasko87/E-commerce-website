import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const sorts = [
  { label: "Price: low → high", value: "price_asc" },
  { label: "Price: high → low", value: "price_desc" },
  { label: "Biggest discount", value: "discount_desc" },
];

const OnSale = () => {
  const {
    fetchProductsOnSale,
    products,
    category,
    gender,
    sort,
    payload,
    setGender,
    setCategory,
    setSort,
  } = useProductStore();

  useEffect(() => {
    fetchProductsOnSale(payload);
  }, [category, gender, sort]);

  const clearFilters = () => {
    setCategory("");
    setGender("");
    setSort("");
  };

  return (
    <div className="flex items-start">
      <aside className="w-1/5 h-[88.5vh] bg-gray-900">
        <h2 className="text-2xl text-center mt-3 font-bold">Filters</h2>
        <div className="m-3 ">
          <p>Category</p>
          <select
            className="mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={""}>Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="m-3 mt-5">
          <p className="text-gray-300">Gender</p>
          <div className="mt-2 flex flex-col gap-2 text-white">
            {["Male", "Female", "Unisex"].map((g) => (
              <label key={g} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                />
                {g}
              </label>
            ))}
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value=""
                checked={gender === ""}
                onChange={() => setGender("")}
              />
              All
            </label>
          </div>
        </div>
        <div className="m-3 mt-5">
          <p className="text-gray-300">Sort By</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md
             py-2 px-3 text-white focus:outline-none
             focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Default</option>
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="m-3 mt-6">
          <button
            onClick={clearFilters}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-md py-2"
          >
            Clear filters
          </button>
        </div>
      </aside>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mx-5 w-4/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </motion.div>
    </div>
  );
};

export default OnSale;
