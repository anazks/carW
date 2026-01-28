import { useRef } from "react";
import { Clock, Star, Navigation, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import car1 from "../../assets/images/car1.jpg";
import car2 from "../../assets/images/car2.jpg";
import car3 from "../../assets/images/car3.jpg";

export default function Card() {
  const navigate = useNavigate();

  // Move the scrollRef out of renderSection (hook must be at top level)
  const scrollRef = useRef<HTMLDivElement>(null);

  const carWashCenters = [
    {
      id: 1,
      name: "Mycarwash Downtown",
      rating: 4.8,
      reviews: 245,
      hours: "8:00 AM - 8:00 PM",
      distance: "2.3 km",
      price: "₹150 - ₹500",
      image: car1,
    },
    {
      id: 2,
      name: "Mycarwash Uptown",
      rating: 4.9,
      reviews: 312,
      hours: "7:00 AM - 9:00 PM",
      distance: "3.7 km",
      price: "₹200 - ₹750",
      image: car2,
    },
    {
      id: 3,
      name: "Mycarwash Westside",
      rating: 4.7,
      reviews: 189,
      hours: "8:00 AM - 7:00 PM",
      distance: "5.1 km",
      price: "₹120 - ₹400",
      image: car3,
    },
    {
      id: 4,
      name: "Mycarwash NorthWest",
      rating: 4.8,
      reviews: 245,
      hours: "8:00 AM - 6:00 PM",
      distance: "5.3 km",
      price: "₹350 - ₹800",
      image: car1,
    },
  ];

  const renderSection = (title: string) => {
    // Scroll function can stay here
    const scroll = (direction: "left" | "right") => {
      scrollRef.current?.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    };

    return (
      <div className="mb-8 relative">
        <h2
          style={{ fontFamily: "'Bodoni Moda', serif" }}
          className="text-2xl font-bold text-gray-900 mb-5 text-center"

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchNearbyShops(longitude, latitude);
      },
      (error) => {
        console.error("Location error:", error);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  /* ================= FETCH SHOPS ================= */
  const fetchNearbyShops = async (lng: number, lat: number) => {
    try {
      const response = await getShopInfo(lng, lat);
      setShops(response.shops || []);
    } catch (error) {
      console.error("Fetch shops error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SCROLL ================= */
  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
        <p className="mt-2 text-gray-600">Finding nearby shops...</p>
      </div>
    );
  }

  if (!shops.length) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-600">No nearby shops found</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2
          style={{ fontFamily: "'Bodoni Moda', serif" }}
          className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#D4AF37] to-[#b69530] bg-clip-text text-transparent"
        >
          {title}
        </h2>

        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hover:bg-[#FFF8DC]"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-10 [&::-webkit-scrollbar]:hidden scroll-smooth"
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden px-16 sm:px-20"
        >
          {carWashCenters.map((center) => (
            <div
              key={center.id}
              className="min-w-[280px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative h-40">
                <img
                  src={center.image}
                  alt={center.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                  <Navigation className="w-3 h-3" />
                  {center.distance}
                </div>
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{center.rating}</span>
                  <span className="text-gray-500">({center.reviews})</span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                  className="text-base font-bold text-gray-900 mb-2"
                >
                  {center.name}
                </h3>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{center.hours}</span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-xs text-gray-500">Price Range</p>
                    <p className="text-sm font-semibold text-gray-900">{center.price}</p>
                  </div>
              key={shop._id}
              className="min-w-[300px] sm:min-w-[320px] flex-shrink-0 snap-center bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* IMAGE */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={
                    shop.ProfileImage ||
                    "https://via.placeholder.com/400x300?text=Car+Wash"
                  }
                  alt={shop.ShopName}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* PREMIUM BADGE */}
                {shop.IsPremium && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-semibold shadow-md">
                    <Crown className="w-4 h-4 text-white" />
                    Premium
                  </div>
                )}

                {/* DISTANCE */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                  <Navigation className="w-4 h-4 text-gray-600" />
                  {(shop.distance / 1000).toFixed(1)} km
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">
                  {shop.ShopName}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {shop.ExactLocation}, {shop.City}
                </p>

                <div className="flex items-center gap-2 text-gray-700 mb-5">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{shop.Timing}</span>
                </div>

                <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-4">
                  {/* <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-base font-bold">4.8</span>
                  </div> */}

                  {/* 🔥 Redirect to detailed page */}
                  <button
                    onClick={() => navigate(`/Details/${center.id}`)} // lowercase path
                    className="px-3 py-1.5 text-xs font-semibold bg-black text-white rounded-md hover:bg-gray-800"
                    onClick={() => navigate(`/details/${shop._id}`)}
                    className="px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white rounded-lg hover:from-[#b69530] hover:to-[#D4AF37] transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hover:bg-[#FFF8DC]"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6 text-[#D4AF37]" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {renderSection("Near You")}
        {renderSection("Most Popular")}
        {renderSection("Suggested")}
      </div>
    </div>
  );
}