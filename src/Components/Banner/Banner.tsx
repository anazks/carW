import { useState, useEffect } from "react";

import carImg from "../../assets/images/car.jpg";
import bikeImg from "../../assets/images/bike.jpg";
import heavyImg from "../../assets/images/heavy.jpg";

function Banner() {
  const [selectedVehicle, setSelectedVehicle] =
    useState<"car" | "bike" | "heavy">("car");
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: "Summer Shine Special",
      subtitle: "20% Off All Services",
      bg: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(255,248,220,0.15))",
    },
    {
      title: "Eco-Friendly Wash",
      subtitle: "Water-Saving Technology",
      bg: "linear-gradient(135deg, rgba(218,165,32,0.15), rgba(255,223,0,0.15))",
    },
    {
      title: "Premium Detailing",
      subtitle: "Interior & Exterior Care",
      bg: "linear-gradient(135deg, rgba(184,134,11,0.15), rgba(218,165,32,0.15))",
    },
  ];

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % banners.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  const vehicles = [
    { type: "car", label: "Car", image: carImg },
    { type: "bike", label: "Bike", image: bikeImg },
    { type: "heavy", label: "Heavy", image: heavyImg },
  ];

  return (
    <section className="bg-white -mt-4">
      {/* ⬆️ THIS removes the gap */}

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">
        <div className="flex flex-col items-center gap-12">

          {/* Carousel */}
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-xl">
            <div
              className="flex transition-transform duration-700"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((b, i) => (
                <div
                  key={i}
                  className="min-w-full h-52 flex flex-col justify-center items-center text-center"
                  style={{ background: b.bg }}
                >
                  <h2
                    style={{ fontFamily: "'Bodoni Moda', serif" }}
                    className="text-4xl font-bold"
                  >
                    {b.title}
                  </h2>
                  <p className="text-lg text-gray-700 mt-2">
                    {b.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles */}
          <div className="text-center">
            <p className="text-sm text-gray-500 font-semibold mb-4">
              Select Vehicle Type
            </p>

            <div className="flex gap-5 justify-center flex-wrap">
              {vehicles.map((v) => (
                <button
                  key={v.type}
                  onClick={() => setSelectedVehicle(v.type as any)}
                  className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center transition ${
                    selectedVehicle === v.type
                      ? "border-2 border-[#D4AF37] bg-[#FFF8DC] scale-105"
                      : "border border-gray-200"
                  }`}
                >
                  <img src={v.image} className="w-16 h-16 mb-2" />
                  <span className="text-sm">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Banner;
