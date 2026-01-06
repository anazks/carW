import { useState, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import OwnerNavbar from "../Layout/OwnerNavBar";

/* ================= TYPES ================= */
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  /* 🔥 SCROLL HANDLER */
  const scrollTable = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <>
      <OwnerNavbar />

      <div className="min-h-screen bg-gray-50 pt-20 px-4 flex flex-col overflow-x-hidden">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6 flex-1 w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Bookings
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Manage customer bookings
          </p>

          {/* TABLE WRAPPER */}
          <div className="relative">

{/* LEFT ARROW — MOBILE ONLY */}
<button
  onClick={() => scrollTable("left")}
  className="
    absolute left-1 top-1/2 -translate-y-1/2 z-10
    bg-[#FFF4D6] border border-[#E6C86E]
    rounded-full p-2
    text-[#D4AF37]
    shadow-sm
    hover:bg-[#FFE8A3]
    lg:hidden
  "
>
  <ChevronLeft size={18} />
</button>

{/* RIGHT ARROW — MOBILE ONLY */}
<button
  onClick={() => scrollTable("right")}
  className="
    absolute right-1 top-1/2 -translate-y-1/2 z-10
    bg-[#FFF4D6] border border-[#E6C86E]
    rounded-full p-2
    text-[#D4AF37]
    shadow-sm
    hover:bg-[#FFE8A3]
    lg:hidden
  "
>
  <ChevronRight size={18} />
</button>


            {/* SCROLL AREA */}
            <div
              ref={scrollRef}
              className="overflow-x-auto px-8 scroll-smooth"
            >
              <table className="min-w-[700px] w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b text-gray-500">
                    <th className="py-3">Customer</th>
                    <th>Car No</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th className="pl-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b last:border-none hover:bg-gray-50"
                    >
                      <td className="py-3 font-medium">{b.customer}</td>
                      <td>{b.carNumber}</td>
                      <td>{b.service}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="pl-2">
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
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-[#D4AF37] text-white whitespace-nowrap"
                          >
                            {b.status === "Pending"
                              ? "Start"
                              : "Complete"}
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <footer className="w-full text-center text-sm text-gray-600 py-3 bg-gray-100 mt-6">
          © {new Date().getFullYear()} Sparkle Car Wash
        </footer>
      </div>
    </>
  );
}

/* ===== STATUS BADGE ===== */
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
