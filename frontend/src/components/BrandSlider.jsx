import { useRef, useEffect } from "react";

const brands = [
  "/logos/adida.svg",
  "/logos/emporio-armani.svg",
  "/logos/hugo-boss.svg",
  "/logos/nike.svg",
  "/logos/prada.png",
  "/logos/versace.png",
];

const BrandSlider = () => {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-[rgba(16,185,129,0.3)]">
      {/* Gradient fade left */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-gray-900 to-transparent"></div>

      {/* Scrolling logos */}
      <div className="flex w-max animate-slide gap-20 ">
        {brands.concat(brands).map((src, i) => (
          <img
            key={i}
            src={src}
            alt="brand logo"
            className="h-24 sm:h-28 object-contain opacity-90 hover:opacity-100 transition filter invert brightness-200"
          />
        ))}
      </div>

      {/* Gradient fade right */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-gray-900 to-transparent"></div>
    </div>
  );
};

export default BrandSlider;


