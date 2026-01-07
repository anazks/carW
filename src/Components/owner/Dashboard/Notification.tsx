import { Bell } from "lucide-react";

export default function Notifications() {
  const notifications = [
    { id: 1, message: "New booking received" },
    { id: 2, message: "Booking cancelled by customer" },
    { id: 3, message: "Payment received" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800">Notifications</h2>
        <Bell className="text-gray-600" />
      </div>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li key={n.id} className="text-gray-600 text-sm border-b pb-1">
            {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
