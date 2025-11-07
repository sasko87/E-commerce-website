import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";


const images = [{
    src: "/discount-code.png",
    link: "/login"
},{
    src: "/discount-jeans.png",
    link: "/category/jeans"
},{
    src: "/midseason-sale.png",
    link: "/sale"
}

  
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
  const interval = setInterval(nextSlide, 8000);
  return () => clearInterval(interval);
}, [nextSlide]);

  return (
    <div className="relative w-screen  h-4/5 max-h-[800px] mx-auto overflow-hidden rounded-lg">
<Link to={images[currentIndex].link}>
      <div className="relative w-screen aspect-[21/9] overflow-hidden">
  {images.map((image, index) => (
    <img
      key={index}
      src={image.src}
      alt=""
      className={`
        absolute top-0 left-0 w-full  md:h-full object-center transition-opacity duration-999 ease-in-out
        ${index === currentIndex ? "opacity-100" : "opacity-0"}
      `}
    />
  ))}
</div>
</Link>
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-20 top-1/2 -translate-y-1/2 cursor-pointer bg-white/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-20 top-1/2 -translate-y-1/2 cursor-pointer bg-white/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5 absolute bottom-5 left-1/2 -translate-x-1/2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              currentIndex === index ? "bg-emerald-400" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
