import { useState, useEffect } from "react";

import carImg from "../../assets/images/car.jpg";
import bikeImg from "../../assets/images/bike.jpg";
import heavyImg from "../../assets/images/heavy.jpg";

// Fonts (already added in index.html)
// Bodoni Moda → headings
// Montserrat → subheadings

function Banner() {
  const [selectedVehicle, setSelectedVehicle] = useState<
    "car" | "bike" | "heavy"
  >("car");
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: "Summer Shine Special",
      subtitle: "20% Off All Services",
      bg: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(255,248,220,0.15) 100%)",
    },
    {
      title: "Eco-Friendly Wash",
      subtitle: "Water-Saving Technology",
      bg: "linear-gradient(135deg, rgba(218,165,32,0.15) 0%, rgba(255,223,0,0.15) 100%)",
    },
    {
      title: "Premium Detailing",
      subtitle: "Interior & Exterior Care",
      bg: "linear-gradient(135deg, rgba(184,134,11,0.15) 0%, rgba(218,165,32,0.15) 100%)",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const vehicleTypes = [
    { type: "car" as const, label: "Car", image: carImg },
    { type: "bike" as const, label: "Bike", image: bikeImg },
    { type: "heavy" as const, label: "Heavy", image: heavyImg },
  ];

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-white/90"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-32">
        <div className="flex flex-col items-center space-y-12">

          {/* Carousel */}
          <div className="w-full max-w-2xl relative overflow-hidden rounded-3xl shadow-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className="min-w-full h-44 sm:h-52 md:h-60 flex flex-col items-center justify-center text-center p-8 rounded-3xl"
                  style={{
                    background: banner.bg,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h2
                    style={{ fontFamily: "'Bodoni Moda', serif" }}
                    className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2"
                  >
                    {banner.title}
                  </h2>
                  <p
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-gray-700 text-lg sm:text-xl font-medium"
                  >
                    {banner.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-[#D4AF37] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Vehicle Selector with Images */}
          <div className="text-center space-y-6 w-full max-w-md">
            <p
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="text-sm font-semibold text-gray-500 tracking-wide"
            >
              Select Vehicle Type
            </p>

            <div className="flex justify-center gap-5 flex-wrap">
              {vehicleTypes.map(({ type, label, image }) => (
                <button
                  key={type}
                  onClick={() => setSelectedVehicle(type)}
                  className={`w-32 h-32 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center ${
                    selectedVehicle === type
                      ? "bg-[#FFF8DC] border-2 border-[#D4AF37] shadow-lg scale-105"
                      : "bg-white border border-gray-200 hover:shadow-md"
                  }`}
                >
                  <img
                    src={image}
                    alt={label}
                    className="w-16 h-16 object-contain mb-2"
                  />

                  <span
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-sm font-medium text-gray-700"
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Banner;
