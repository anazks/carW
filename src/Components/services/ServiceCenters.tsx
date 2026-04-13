import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, Star, Navigation, Search, Loader2, ChevronLeft } from "lucide-react";
import { getShopInfo } from "../../Api/Shop";

export default function ServiceCenters() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const formattedServiceName = serviceName
    ? serviceName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Service Centers";

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      // Fetching all (using 0,0 to trigger default behavior in current API)
      const response = await getShopInfo(0, 0);
      if (response?.shops) {
        setShops(response.shops);
      } else {
        // Fallback for demo if API fails
        setShops([
          {
            _id: "shop-1",
            ShopName: "Sparkle Shine Auto",
            ProfileImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=400&h=300",
            distance: 2500,
            ExactLocation: "Downtown",
            City: "Mumbai",
            Timing: "09:00 AM - 08:00 PM",
            rating: 4.8
          },
          {
            _id: "shop-2",
            ShopName: "Premium Wash Care",
            ProfileImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=400&h=300",
            distance: 4200,
            ExactLocation: "Andheri West",
            City: "Mumbai",
            Timing: "08:00 AM - 09:00 PM",
            rating: 4.9
          },
          {
            _id: "shop-3",
            ShopName: "Eco Steam Wash",
            ProfileImage: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=400&h=300",
            distance: 6800,
            ExactLocation: "Bandra",
            City: "Mumbai",
            Timing: "10:00 AM - 07:00 PM",
            rating: 4.7
          }
        ]);
      }
    } catch (error) {
      console.error("Fetch shops error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter((shop) =>
    shop.ShopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.City.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.ExactLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8DC] to-[#FFF1B5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium italic">Finding the best centers for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8DC] to-[#FFF1B5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigate("/services")}
              className="flex items-center gap-2 text-[#D4AF37] font-bold mb-4 hover:underline transition-all group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              All Services
            </button>
            <h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#b69530] bg-clip-text text-transparent"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Centers for {formattedServiceName}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Authorized partner centers near you
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
            />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] transition-all"
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-8 flex items-center gap-2 text-gray-500 font-medium">
          <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs">
            {filteredShops.length}
          </span>
          Centers found
        </div>

        {/* Grid List */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[#D4AF37]/30">
            <Search size={48} className="mx-auto text-[#D4AF37]/50 mb-4" />
            <p className="text-xl text-gray-500 font-medium">
              No centers found matching "{searchTerm}"
            </p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 text-[#D4AF37] font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop) => (
              <div
                key={shop._id}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden border border-gray-100"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={shop.ProfileImage || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=400&h=300"}
                    alt={shop.ShopName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-lg border border-white/50">
                    <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {shop.distance ? (shop.distance / 1000).toFixed(1) : "0.0"} KM AWAY
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#D4AF37] text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {shop.rating || "4.8"}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-[#D4AF37] transition-colors"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}>
                    {shop.ShopName}
                  </h3>

                  <div className="flex items-start gap-2 mb-4 text-gray-500">
                    <MapPin size={18} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">
                      {shop.ExactLocation}, {shop.City}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[#FFF8DC]/50 rounded-2xl mb-8">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Clock size={16} className="text-[#D4AF37]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">Hours</span>
                      <span className="font-bold text-gray-800 text-xs">{shop.Timing || "09:00 AM - 08:00 PM"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/details/${shop._id}`)}
                    className="mt-auto w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Select & Book
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
