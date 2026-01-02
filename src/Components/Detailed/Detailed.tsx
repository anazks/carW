import { useState } from "react";
import { MapPin, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

/* ================= DATA ================= */
const carWashCenters = [
  {
    id: 1,
    name: "Mycarwash Downtown",
    location: "123 Main Street, Downtown",
    hours: "8:00 AM - 8:00 PM",
    price: "₹150 - ₹500",
    totalTime: "30-45 min",
    vehicleTypes: ["Car", "Bike", "Heavy Vehicle"],
    pickAndDrop: true,
    washAtHome: true,
    lat: 40.7128,
    lng: -74.006,
    services: [
      { name: "Express Wash", price: 150, time: 20 },
      { name: "Full Detail", price: 500, time: 60 },
      { name: "Interior Clean", price: 200, time: 30 },
      { name: "Wax & Polish", price: 250, time: 40 },
      { name: "Engine Clean", price: 300, time: 30 },
      { name: "Tire Shine", price: 100, time: 15 },
      { name: "Underbody Wash", price: 150, time: 20 },
      { name: "Seat Shampoo", price: 200, time: 25 },
    ],
  },
  {
    id: 2,
    name: "Mycarwash Uptown",
    location: "Uptown Avenue",
    hours: "7:00 AM - 9:00 PM",
    price: "₹200 - ₹750",
    totalTime: "45-60 min",
    vehicleTypes: ["Car", "Bike", "Heavy Vehicle"],
    pickAndDrop: true,
    washAtHome: false,
    lat: 40.73061,
    lng: -73.935242,
    services: [
      { name: "Express Wash", price: 200, time: 25 },
      { name: "Interior Clean", price: 250, time: 35 },
      { name: "Wax", price: 300, time: 40 },
      { name: "Engine Clean", price: 350, time: 45 },
      { name: "Seat Shampoo", price: 200, time: 30 },
      { name: "Tire Shine", price: 100, time: 15 },
      { name: "Full Detail", price: 600, time: 75 },
      { name: "Underbody Wash", price: 150, time: 20 },
    ],
  },
  {
    id: 3,
    name: "Mycarwash Westside",
    location: "Westside Road",
    hours: "8:00 AM - 7:00 PM",
    price: "₹120 - ₹400",
    totalTime: "30-40 min",
    vehicleTypes: ["Car", "Bike", "Heavy Vehicle"],
    pickAndDrop: false,
    washAtHome: true,
    lat: 40.74061,
    lng: -73.955242,
    services: [
      { name: "Express Wash", price: 120, time: 20 },
      { name: "Interior Clean", price: 150, time: 25 },
      { name: "Wax & Polish", price: 200, time: 30 },
      { name: "Seat Shampoo", price: 180, time: 25 },
      { name: "Tire Shine", price: 100, time: 15 },
      { name: "Engine Clean", price: 250, time: 30 },
      { name: "Underbody Wash", price: 150, time: 20 },
      { name: "Full Detail", price: 400, time: 50 },
    ],
  },
  {
    id: 4,
    name: "Mycarwash NorthWest",
    location: "NorthWest Street",
    hours: "8:00 AM - 6:00 PM",
    price: "₹350 - ₹800",
    totalTime: "50-60 min",
    vehicleTypes: ["Car", "Bike", "Heavy Vehicle"],
    pickAndDrop: true,
    washAtHome: false,
    lat: 40.75061,
    lng: -73.975242,
    services: [
      { name: "Express Wash", price: 350, time: 30 },
      { name: "Full Detail", price: 800, time: 75 },
      { name: "Wax & Polish", price: 400, time: 40 },
      { name: "Interior Clean", price: 300, time: 35 },
      { name: "Engine Clean", price: 350, time: 40 },
      { name: "Seat Shampoo", price: 250, time: 30 },
      { name: "Underbody Wash", price: 300, time: 35 },
      { name: "Tire Shine", price: 150, time: 20 },
    ],
  },
];

/* ================= COMPONENT ================= */
export default function Detailed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const center = carWashCenters.find((c) => c.id === Number(id));

  const [vehicle, setVehicle] = useState(center?.vehicleTypes[0] || "");
  const [services, setServices] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [serviceType, setServiceType] =
    useState<"center" | "pickDrop" | "home">("center");

  if (!center) return null;

  const toggleService = (name: string) =>
    setServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );

  const totalPrice = services.reduce((sum, s) => {
    const svc = center.services.find((x) => x.name === s);
    return sum + (svc?.price || 0);
  }, 0);

  const totalTime = services.reduce((sum, s) => {
    const svc = center.services.find((x) => x.name === s);
    return sum + (svc?.time || 0);
  }, 0);

  const timeSlots = {
    morning: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
    afternoon: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#D4AF37] font-medium"
      >
        ← Back to locations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">

        {/* LEFT: Map + Heading */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow border">
            <h1 className="text-2xl font-bold">{center.name}</h1>
            <p className="flex items-center gap-1">
              <MapPin size={16} /> {center.location}
            </p>
            <p className="flex items-center gap-1">
              <Clock size={16} /> {center.hours}
            </p>
            <p className="font-medium mt-1">
              {center.totalTime} | {center.price}
            </p>
          </div>

          <div className="h-[300px] sm:h-[400px] lg:h-[550px] rounded-xl overflow-hidden relative z-0">
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[center.lat, center.lng]}>
                <Popup>{center.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* RIGHT: Booking Options */}
        <div className="space-y-4">

          {/* Vehicle */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <label className="font-semibold">Vehicle Type</label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              {center.vehicleTypes.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Services */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <h2 className="font-bold mb-2">Select Services</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {center.services.map((s) => (
                <label
                  key={s.name}
                  className="border p-2 rounded flex gap-2 items-center"
                >
                  <input
                    type="checkbox"
                    checked={services.includes(s.name)}
                    onChange={() => toggleService(s.name)}
                  />
                  <span>{s.name} — ₹{s.price} ({s.time}m)</span>
                </label>
              ))}
            </div>
            <p className="mt-2 font-semibold">
              Total: ₹{totalPrice} | {totalTime} min
            </p>
          </div>

          {/* Date & Time */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <h2 className="font-bold mb-2">Choose Date & Time</h2>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <h3 className="font-semibold mb-1">Morning Slots</h3>
            <div className="flex gap-2 flex-wrap mb-3">
              {timeSlots.morning.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`px-3 py-1 border rounded ${
                    time === t ? "bg-[#D4AF37] text-white" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <h3 className="font-semibold mb-1">Afternoon Slots</h3>
            <div className="flex gap-2 flex-wrap">
              {timeSlots.afternoon.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`px-3 py-1 border rounded ${
                    time === t ? "bg-[#D4AF37] text-white" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Service Type + Confirm */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-bold mb-2">Service Type</h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setServiceType("center")}
                  className={`px-4 py-2 border rounded ${
                    serviceType === "center" && "bg-[#FFF8DC]"
                  }`}
                >
                  At Center
                </button>

                {center.pickAndDrop && (
                  <button
                    onClick={() => setServiceType("pickDrop")}
                    className={`px-4 py-2 border rounded ${
                      serviceType === "pickDrop" && "bg-[#FFF8DC]"
                    }`}
                  >
                    Pick & Drop
                  </button>
                )}

                {center.washAtHome && (
                  <button
                    onClick={() => setServiceType("home")}
                    className={`px-4 py-2 border rounded ${
                      serviceType === "home" && "bg-[#FFF8DC]"
                    }`}
                  >
                    Wash at Home
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                alert(`Booking Confirmed!\nDate: ${date}\nTime: ${time}\nVehicle: ${vehicle}\nServices: ${services.join(", ")}\nService Type: ${serviceType}\nTotal Time: ${totalTime} min\nTotal Amount: ₹${totalPrice}`)
              }
              className="bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white px-6 py-2 rounded font-bold whitespace-nowrap"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
