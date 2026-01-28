import { useEffect, useRef, useState } from "react";
import {
  Clock,
  Star,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getShopInfo } from "../../Api/Shop";

type Shop = {
  _id: string;
  ShopName: string;
  ProfileImage?: string;
  Timing: string;
  City: string;
  ExactLocation: string;
  distance: number;
  IsPremium: boolean;
};

export default function Card() {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ================= GET USER LOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setLoading(false);
      return;
    }

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
          Near You
        </h2>

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden px-16 sm:px-20"
        >
          {shops.map((shop) => (
            <div
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

                  <button
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

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6 text-[#D4AF37]" />
        </button>
      </div>
    </div>
  );
}