import React from "react";
import { useCartStore } from "../store/useCartStore";

const AvailableSizes = ({ sizes, productId }) => {
  const { getSelectedSize, setSelectedSize } = useCartStore();
  const selectedSize = getSelectedSize(productId);

  return (
    <div className="flex flex-col items-left gap-2 my-2">
      <p className="text-black">Available Sizes:</p>
      <div className="flex gap-2 text-xs">
        {sizes?.map((size, i) => (
          <p
            key={i}
            onClick={() => setSelectedSize(productId, size)}
            className={`text-black cursor-pointer border border-emerald-800 px-2 py-1 rounded transition 
              ${
                selectedSize === size
                  ? "bg-emerald-500 text-white"
                  : "hover:bg-emerald-400"
              }`}
          >
            {size}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AvailableSizes;
