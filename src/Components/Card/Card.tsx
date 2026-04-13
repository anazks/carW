import { useEffect, useRef, useState } from "react"
import { Clock, Star, Navigation, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getShopInfo } from "../../Api/Shop"

export default function Card() {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [shops, setShops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ---------------- GEOLOCATION ----------------
  useEffect(() => {
    // Stop fetching shops using location (geolocation), just fetch all/default
    fetchNearbyShops(0, 0)
  }, [])

  // ---------------- FETCH SHOPS ----------------
  const fetchNearbyShops = async (lng: number, lat: number) => {
    try {
      const response = await getShopInfo(lng, lat)
      if (response?.shops && response.shops.length > 0) {
        setShops(response.shops)
      } else {
        throw new Error("No shops returned")
      }
    } catch (error) {
      console.error("Fetch shops error (using default shops):", error)
      setShops([
        {
          _id: "shop-1",
          ShopName: "Sparkle Shine Auto",
          ProfileImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=400&h=300",
          distance: 2500,
          ExactLocation: "Downtown",
          City: "Mumbai",
          Timing: "09:00 AM - 08:00 PM"
        },
        {
          _id: "shop-2",
          ShopName: "Premium Wash Care",
          ProfileImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=400&h=300",
          distance: 4200,
          ExactLocation: "Andheri West",
          City: "Mumbai",
          Timing: "08:00 AM - 09:00 PM"
        },
        {
          _id: "shop-3",
          ShopName: "Eco Steam Wash",
          ProfileImage: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=400&h=300",
          distance: 6800,
          ExactLocation: "Bandra",
          City: "Mumbai",
          Timing: "10:00 AM - 07:00 PM"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // ---------------- SCROLL ----------------
  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    })
  }

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
        <p className="mt-2 text-gray-600">Finding nearby shops...</p>
      </div>
    )
  }

  if (!shops.length) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-600">No nearby shops found</p>
      </div>
    )
  }

  // ---------------- UI ----------------
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-[#D4AF37]">
          Near You
        </h2>

        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3"
        >
          <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />
        </button>

        {/* CARDS */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-16 scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="min-w-[300px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <div className="relative h-48">
                <img
                  src={
                    shop.ProfileImage ||
                    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=400&h=300"
                  }
                  alt={shop.ShopName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Navigation className="w-4 h-4" />
                  {shop.distance ? (shop.distance / 1000).toFixed(1) : "0.0"} km
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1">{shop.ShopName}</h3>

                <p className="text-sm text-gray-600 mb-3">
                  {shop.ExactLocation}, {shop.City}
                </p>

                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{shop.Timing}</span>
                </div>

                <div className="mt-auto flex justify-between items-center border-t pt-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">4.8</span>
                  </div>

                  <button
                    onClick={() => navigate(`/details/${shop._id}`)}
                    className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3"
        >
          <ChevronRight className="w-6 h-6 text-[#D4AF37]" />
        </button>
      </div>
    </div>
  )
}
