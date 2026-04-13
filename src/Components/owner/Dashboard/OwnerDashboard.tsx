import { useState, useEffect } from "react";
import { Car, Calendar, IndianRupee, Clock, Bell, Plus, Settings, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import OwnerNavBar from "../Layout/OwnerNavBar";
import EarningsChart from "./EarningsChart";
import Notifications from "./Notification";
import { getmyshops } from "../../../Api/Service";

export default function OwnerDashboard() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await getmyshops();
        if (res.success) {
          setShops(res.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  return (
    <>
      <OwnerNavBar />

      <div className="min-h-screen bg-gray-50 pt-20 px-4">

        {/* HEADER */}
        <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your car wash business</p>
          </div>
          <Bell className="text-gray-600" />
        </div>

        {/* MY SHOPS SECTION */}
        <div className="max-w-6xl mx-auto mb-8">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-gray-800">My Wash Centers</h2>
             <Link to="/owner/addShop" className="text-[#D4AF37] text-sm font-bold flex items-center gap-1 hover:underline">
               <Plus size={16} /> ADD NEW
             </Link>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
             {loading ? (
               <div className="col-span-2 py-10 text-center text-gray-400">Loading your shops...</div>
             ) : shops.length > 0 ? (
               shops.map((shop) => (
                 <div key={shop._id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 border border-gray-100 hover:shadow-md transition">
                    <img 
                      src={shop.ProfileImage || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=200&h=200"} 
                      className="w-24 h-24 rounded-xl object-cover" 
                      alt={shop.ShopName}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{shop.ShopName}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={14}/> {shop.City}</p>
                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => navigate("/owner/services")}
                          className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-900 transition"
                        >
                          MANAGE SERVICES
                        </button>
                        <button 
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>
                 </div>
               ))
             ) : (
               <div className="col-span-2 py-10 bg-white rounded-2xl border-2 border-dashed text-center text-gray-500">
                  <p className="mb-2">No shops found for your account.</p>
                  <Link to="/owner/addShop" className="text-[#D4AF37] font-bold hover:underline">Create your first shop now</Link>
               </div>
             )}
           </div>
        </div>

        {/* STATS CARDS */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <StatCard icon={<Car />} label="Bookings" value="128" />
          <StatCard icon={<Calendar />} label="Today" value="12" />
          <StatCard icon={<IndianRupee />} label="Earnings" value="₹24,500" />
          <StatCard icon={<Clock />} label="Pending" value="5" />
        </div>

        {/* CHART + NOTIFICATIONS */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-24">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-4">
            <h2 className="font-semibold mb-3">Earnings Overview</h2>
            <EarningsChart />
          </div>

          <Notifications />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full text-center text-sm text-gray-600 py-3 bg-gray-100 mt-6">
  © {new Date().getFullYear()} Sparkle Car Wash. All rights reserved.
</footer>

    </>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-3">
      <div className="p-2 bg-[#FFF4D6] rounded-xl text-[#D4AF37]">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
