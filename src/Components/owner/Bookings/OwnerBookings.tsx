import { useState } from "react";
import OwnerNavbar from "../Layout/OwnerNavBar";

type Booking = {
  id: number;
  customer: string;
  carNumber: string;
  service: string;
  date: string;
  time: string;
  status: "Pending" | "In Progress" | "Completed";
};

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      customer: "Akhil",
      carNumber: "KL 07 AB 1234",
      service: "Premium Wash",
      date: "10 Jan 2026",
      time: "10:30 AM",
      status: "Pending",
    },
    {
      id: 2,
      customer: "Rahul",
      carNumber: "KL 05 CD 5678",
      service: "Basic Wash",
      date: "10 Jan 2026",
      time: "11:00 AM",
      status: "In Progress",
    },
    {
      id: 3,
      customer: "Sneha",
      carNumber: "KL 01 EF 9988",
      service: "Interior Cleaning",
      date: "09 Jan 2026",
      time: "04:00 PM",
      status: "Completed",
    },
  ]);

  const updateStatus = (id: number, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status } : b
      )
    );
  };

  return (
    <>
      <OwnerNavbar />

      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6">

          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Bookings
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Manage customer bookings
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="py-3">Customer</th>
                  <th>Car No</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b last:border-none">
                    <td className="py-3 font-medium">{b.customer}</td>
                    <td>{b.carNumber}</td>
                    <td>{b.service}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="text-right">
                      {b.status !== "Completed" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              b.id,
                              b.status === "Pending"
                                ? "In Progress"
                                : "Completed"
                            )
                          }
                          className="px-3 py-1 text-xs rounded-lg bg-[#D4AF37] text-white"
                        >
                          {b.status === "Pending" ? "Start" : "Complete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      <footer className="fixed bottom-0 left-0 w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
        © {new Date().getFullYear()} MyCarWash. All rights reserved.
      </footer>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const map = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
      {status}
    </span>
  );
}
