import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import OwnerNavbar from "../Layout/OwnerNavBar";
import { getOwnerBookings, updateBookingStatus } from "../../../Api/Booking";

type ServiceItem = {
  name: string;
  price: number;
  duration: number;
};

type Booking = {
  _id: string;
  userId: { firstName: string; lastName: string } | null;
  shopName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  services: ServiceItem[];
  totalPrice: number;
  bookingStatus: string;
  paymentStatus: string;
};

const STATUS_FLOW: Record<string, string> = {
  confirmed: "in-progress",
  "in-progress": "completed",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Start",
  "in-progress": "Complete",
};

export default function OwnerBookings() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getOwnerBookings();
      if (response.status === 200 && response.data?.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError(response.data?.message || "Failed to fetch bookings");
      }
    } catch (err: any) {
      console.error("Failed to fetch bookings:", err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    try {
      const response = await updateBookingStatus(id, nextStatus);
      if (response.status === 200 && response.data?.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, bookingStatus: nextStatus } : b))
        );
      } else {
        alert(response.data?.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  const scrollTable = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <>
      <OwnerNavbar />
      <div className="min-h-screen bg-gray-50 pt-20 px-4 flex flex-col overflow-x-hidden">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6 flex-1 w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Bookings</h1>
          <p className="text-sm text-gray-500 mb-6">Manage customer bookings</p>

          {loading ? (
            <p className="text-gray-400 text-sm text-center py-10">Loading bookings...</p>
          ) : error ? (
            <p className="text-red-500 text-sm text-center py-10">{error}</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No bookings yet.</p>
          ) : (
            <div className="relative">
              <button
                onClick={() => scrollTable("left")}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-[#FFF4D6] border border-[#E6C86E] rounded-full p-2 text-[#D4AF37] shadow-sm hover:bg-[#FFE8A3] lg:hidden"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollTable("right")}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-[#FFF4D6] border border-[#E6C86E] rounded-full p-2 text-[#D4AF37] shadow-sm hover:bg-[#FFE8A3] lg:hidden"
              >
                <ChevronRight size={18} />
              </button>

              <div ref={scrollRef} className="overflow-x-auto px-8 scroll-smooth">
                <table className="min-w-[800px] w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left border-b text-gray-500">
                      <th className="py-3">Customer</th>
                      <th>Services</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th className="pl-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} className="border-b last:border-none hover:bg-gray-50">
                        <td className="py-3 font-medium">
                          {b.userId ? `${b.userId.firstName} ${b.userId.lastName}` : "Unknown"}
                        </td>
                        <td>
                          <div className="flex flex-col gap-0.5">
                            {b.services.map((s, i) => (
                              <span key={i} className="text-xs text-gray-600">{s.name}</span>
                            ))}
                          </div>
                        </td>
                        <td>{b.bookingDate}</td>
                        <td className="whitespace-nowrap">{b.startTime} – {b.endTime}</td>
                        <td className="font-medium">₹{b.totalPrice}</td>
                        <td>
                          <PaymentBadge status={b.paymentStatus} />
                        </td>
                        <td>
                          <StatusBadge status={b.bookingStatus} />
                        </td>
                        <td className="pl-2">
                          {STATUS_FLOW[b.bookingStatus] && (
                            <button
                              onClick={() => handleUpdateStatus(b._id, STATUS_FLOW[b.bookingStatus])}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-[#D4AF37] text-white whitespace-nowrap"
                            >
                              {STATUS_LABEL[b.bookingStatus]}
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
          )}
        </div>

        <footer className="w-full text-center text-sm text-gray-600 py-3 bg-gray-100 mt-6">
          © {new Date().getFullYear()} Sparkle Car Wash
        </footer>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "not paid": "bg-red-100 text-red-600",
    paid: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}