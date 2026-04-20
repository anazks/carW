import { Bell, CalendarCheck } from "lucide-react";

export default function Notifications() {
  const recentBookings = [
    { id: 1, text: "New booking received", time: "10 mins ago" },
    { id: 2, text: "Booking cancelled by customer", time: "1 hour ago" },
    { id: 3, text: "Payment received", time: "2 hours ago" },
    { id: 4, text: "New booking received", time: "4 hours ago" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 h-full flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
        <CalendarCheck className="text-[#D4AF37]" size={20} />
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-4">
          {recentBookings.map((b) => (
            <div key={b.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              <div className="p-2 bg-[#FFF4D6] rounded-lg text-[#D4AF37] mt-1 shrink-0">
                <Bell size={14} />
              </div>
              <div>
                <p className="text-gray-700 text-sm font-medium">{b.text}</p>
                <p className="text-gray-400 text-xs mt-1">{b.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
