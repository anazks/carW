import { Car, Calendar, IndianRupee, Clock, Bell } from "lucide-react";
import OwnerNavBar from "../Layout/OwnerNavBar";
import EarningsChart from "./EarningsChart";
// import WashCenterSelector from "./WashCenterSelector"; // removed
import Notifications from "./Notification";

export default function OwnerDashboard() {
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
      <footer className="fixed bottom-0 left-0 w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
        © {new Date().getFullYear()} MyCarWash. All rights reserved.
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
