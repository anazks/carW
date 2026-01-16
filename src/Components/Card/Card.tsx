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
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <div className="py-10 text-center">Finding nearby shops...</div>;
  }

  if (!shops.length) {
    return <div className="py-10 text-center">No nearby shops found</div>;
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 relative">

        <h2
          style={{ fontFamily: "'Bodoni Moda', serif" }}
          className="text-2xl font-bold text-center mb-6"
        >
          Near You
        </h2>

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2"
        >
          <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-10 scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="min-w-[280px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative h-40 bg-gray-200">
                <img
                  src={
                    shop.ProfileImage ||
                    "https://via.placeholder.com/400x300?text=Car+Wash"
                  }
                  alt={shop.ShopName}
                  className="w-full h-full object-cover"
                />

                {/* PREMIUM BADGE */}
                {shop.IsPremium && (
                  <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    Premium
                  </div>
                )}

                {/* DISTANCE */}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs flex gap-1">
                  <Navigation className="w-3 h-3" />
                  {(shop.distance / 1000).toFixed(1)} km
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 mb-1">
                  {shop.ShopName}
                </h3>

                <p className="text-xs text-gray-500 mb-2">
                  {shop.ExactLocation}, {shop.City}
                </p>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{shop.Timing}</span>
                </div>

                <div className="mt-auto flex justify-between items-center border-t pt-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>

                  <button
                    onClick={() => navigate(`/details/${shop._id}`)}
                    className="px-3 py-1.5 text-xs font-semibold bg-black text-white rounded-md hover:bg-gray-800"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2"
        >
          <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
        </button>
      </div>
    </div>
  );
}
