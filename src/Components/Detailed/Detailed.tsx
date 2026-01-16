"use client"

import { useState } from "react"
import { MapPin, Clock, Users } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useParams, useNavigate } from "react-router-dom"
import "leaflet/dist/leaflet.css"

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
      { name: "Express Wash", price: 150, time: 20, vehicleType: ["Car", "Bike", "Heavy Vehicle"] },
      { name: "Full Detail", price: 500, time: 60, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Interior Clean", price: 200, time: 30, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Wax & Polish", price: 250, time: 40, vehicleType: ["Car"] },
      { name: "Engine Clean", price: 300, time: 30, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Tire Shine", price: 100, time: 15, vehicleType: ["Car", "Bike", "Heavy Vehicle"] },
      { name: "Underbody Wash", price: 150, time: 20, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Seat Shampoo", price: 200, time: 25, vehicleType: ["Car"] },
      { name: "Chain Cleaning", price: 100, time: 15, vehicleType: ["Bike"] },
      { name: "Bike Polish", price: 150, time: 20, vehicleType: ["Bike"] },
      { name: "Heavy Wash", price: 600, time: 90, vehicleType: ["Heavy Vehicle"] },
      { name: "Cargo Area Clean", price: 400, time: 45, vehicleType: ["Heavy Vehicle"] },
    ],
    timeSlots: {
      morning: [
        { time: "8:00 AM", availableSlots: 3 },
        { time: "9:00 AM", availableSlots: 5 },
        { time: "10:00 AM", availableSlots: 2 },
        { time: "11:00 AM", availableSlots: 4 },
      ],
      afternoon: [
        { time: "12:00 PM", availableSlots: 6 },
        { time: "1:00 PM", availableSlots: 3 },
        { time: "2:00 PM", availableSlots: 1 },
        { time: "3:00 PM", availableSlots: 4 },
        { time: "4:00 PM", availableSlots: 5 },
      ],
    },
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
      { name: "Express Wash", price: 200, time: 25, vehicleType: ["Car", "Bike", "Heavy Vehicle"] },
      { name: "Interior Clean", price: 250, time: 35, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Wax", price: 300, time: 40, vehicleType: ["Car"] },
      { name: "Engine Clean", price: 350, time: 45, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Seat Shampoo", price: 200, time: 30, vehicleType: ["Car"] },
      { name: "Tire Shine", price: 100, time: 15, vehicleType: ["Car", "Bike", "Heavy Vehicle"] },
      { name: "Full Detail", price: 600, time: 75, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Underbody Wash", price: 150, time: 20, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Chain Cleaning", price: 120, time: 20, vehicleType: ["Bike"] },
      { name: "Bike Polish", price: 180, time: 25, vehicleType: ["Bike"] },
      { name: "Heavy Wash", price: 700, time: 100, vehicleType: ["Heavy Vehicle"] },
    ],
    timeSlots: {
      morning: [
        { time: "7:00 AM", availableSlots: 4 },
        { time: "8:00 AM", availableSlots: 6 },
        { time: "9:00 AM", availableSlots: 3 },
        { time: "10:00 AM", availableSlots: 5 },
        { time: "11:00 AM", availableSlots: 2 },
      ],
      afternoon: [
        { time: "12:00 PM", availableSlots: 4 },
        { time: "1:00 PM", availableSlots: 5 },
        { time: "2:00 PM", availableSlots: 3 },
        { time: "3:00 PM", availableSlots: 6 },
        { time: "4:00 PM", availableSlots: 4 },
        { time: "5:00 PM", availableSlots: 2 },
      ],
    },
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
      { name: "Express Wash", price: 120, time: 20, vehicleType: ["Car", "Bike", "Heavy Vehicle"] },
      { name: "Interior Clean", price: 150, time: 25, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Wax & Polish", price: 200, time: 30, vehicleType: ["Car"] },
      { name: "Seat Shampoo", price: 180, time: 25, vehicleType: ["Car"] },
      { name: "Tire Shine", price: 100, time: 15, vehicleType: ["Car", "Bike", "Heavy Vehicle"] },
      { name: "Engine Clean", price: 250, time: 30, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Underbody Wash", price: 150, time: 20, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Full Detail", price: 400, time: 50, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Chain Cleaning", price: 80, time: 15, vehicleType: ["Bike"] },
      { name: "Bike Polish", price: 120, time: 20, vehicleType: ["Bike"] },
    ],
    timeSlots: {
      morning: [
        { time: "8:00 AM", availableSlots: 2 },
        { time: "9:00 AM", availableSlots: 3 },
        { time: "10:00 AM", availableSlots: 4 },
        { time: "11:00 AM", availableSlots: 2 },
      ],
      afternoon: [
        { time: "12:00 PM", availableSlots: 3 },
        { time: "1:00 PM", availableSlots: 4 },
        { time: "2:00 PM", availableSlots: 2 },
        { time: "3:00 PM", availableSlots: 3 },
      ],
    },
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
      { name: "Express Wash", price: 350, time: 30, vehicleType: ["Car", "Bike", "Heavy Vehicle"] },
      { name: "Full Detail", price: 800, time: 75, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Wax & Polish", price: 400, time: 40, vehicleType: ["Car"] },
      { name: "Interior Clean", price: 300, time: 35, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Engine Clean", price: 350, time: 40, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Seat Shampoo", price: 250, time: 30, vehicleType: ["Car"] },
      { name: "Underbody Wash", price: 300, time: 35, vehicleType: ["Car", "Heavy Vehicle"] },
      { name: "Tire Shine", price: 150, time: 20, vehicleType: ["Car", "Bike", "Heavy Vehicle"] },
      { name: "Chain Cleaning", price: 150, time: 25, vehicleType: ["Bike"] },
      { name: "Bike Polish", price: 200, time: 30, vehicleType: ["Bike"] },
      { name: "Heavy Wash", price: 750, time: 95, vehicleType: ["Heavy Vehicle"] },
      { name: "Cargo Area Clean", price: 450, time: 50, vehicleType: ["Heavy Vehicle"] },
    ],
    timeSlots: {
      morning: [
        { time: "8:00 AM", availableSlots: 5 },
        { time: "9:00 AM", availableSlots: 6 },
        { time: "10:00 AM", availableSlots: 4 },
        { time: "11:00 AM", availableSlots: 3 },
      ],
      afternoon: [
        { time: "12:00 PM", availableSlots: 5 },
        { time: "1:00 PM", availableSlots: 4 },
        { time: "2:00 PM", availableSlots: 6 },
        { time: "3:00 PM", availableSlots: 3 },
        { time: "4:00 PM", availableSlots: 2 },
      ],
    },
  },
]

/* ================= COMPONENT ================= */
export default function Detailed() {
  const { id } = useParams()
  const navigate = useNavigate()
  const center = carWashCenters.find((c) => c.id === Number(id))

  const [vehicle, setVehicle] = useState(center?.vehicleTypes[0] || "")
  const [services, setServices] = useState<string[]>([])
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [serviceType, setServiceType] = useState<"center" | "pickDrop" | "home">("center")

  if (!center) return null

  // Filter services based on selected vehicle type
  const filteredServices = center.services.filter((service) => service.vehicleType.includes(vehicle))

  const toggleService = (name: string) => {
    setServices((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]))
  }

  // Reset services when vehicle type changes
  const handleVehicleChange = (newVehicle: string) => {
    setVehicle(newVehicle)
    setServices([]) // Clear selected services when vehicle type changes
  }

  const totalPrice = services.reduce((sum, s) => {
    const svc = center.services.find((x) => x.name === s)
    return sum + (svc?.price || 0)
  }, 0)

  const totalTime = services.reduce((sum, s) => {
    const svc = center.services.find((x) => x.name === s)
    return sum + (svc?.time || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50 pt-5 px-4 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-[#D4AF37] font-medium">
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
            <MapContainer center={[center.lat, center.lng]} zoom={13} className="h-full w-full">
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
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              {center.vehicleTypes.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Services - Filtered by Vehicle Type (slots removed) */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <h2 className="font-bold mb-2">Select Services for {vehicle}</h2>

            {filteredServices.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No services available for this vehicle type</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {filteredServices.map((s) => (
                  <label
                    key={s.name}
                    className={`border-2 p-3 rounded-lg cursor-pointer transition-all ${
                      services.includes(s.name)
                        ? "border-[#D4AF37] bg-[#FFF8DC]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex gap-2 items-start">
                      <input
                        type="checkbox"
                        checked={services.includes(s.name)}
                        onChange={() => toggleService(s.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-600">
                          ₹{s.price} • {s.time} min
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <p className="mt-3 pt-3 border-t font-semibold">
              Total: ₹{totalPrice} | {totalTime} min
            </p>
          </div>

          {/* Date & Time - Now with available slots shown */}
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
              {center.timeSlots.morning.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => setTime(slot.time)}
                  disabled={slot.availableSlots === 0}
                  className={`px-3 py-2 border rounded flex flex-col items-center min-w-[80px] ${
                    time === slot.time
                      ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                      : slot.availableSlots === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:border-[#D4AF37]"
                  }`}
                >
                  <span className="font-medium">{slot.time}</span>
                  <span
                    className={`text-xs flex items-center gap-1 ${
                      time === slot.time ? "text-white/80" : "text-green-600"
                    }`}
                  >
                    <Users size={10} />
                    {slot.availableSlots} slot{slot.availableSlots !== 1 ? "s" : ""}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="font-semibold mb-1">Afternoon Slots</h3>
            <div className="flex gap-2 flex-wrap">
              {center.timeSlots.afternoon.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => setTime(slot.time)}
                  disabled={slot.availableSlots === 0}
                  className={`px-3 py-2 border rounded flex flex-col items-center min-w-[80px] ${
                    time === slot.time
                      ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                      : slot.availableSlots === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:border-[#D4AF37]"
                  }`}
                >
                  <span className="font-medium">{slot.time}</span>
                  <span
                    className={`text-xs flex items-center gap-1 ${
                      time === slot.time ? "text-white/80" : "text-green-600"
                    }`}
                  >
                    <Users size={10} />
                    {slot.availableSlots} slot{slot.availableSlots !== 1 ? "s" : ""}
                  </span>
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
                  className={`px-4 py-2 border rounded ${serviceType === "center" && "bg-[#FFF8DC]"}`}
                >
                  At Center
                </button>

                {center.pickAndDrop && (
                  <button
                    onClick={() => setServiceType("pickDrop")}
                    className={`px-4 py-2 border rounded ${serviceType === "pickDrop" && "bg-[#FFF8DC]"}`}
                  >
                    Pick & Drop
                  </button>
                )}

                {center.washAtHome && (
                  <button
                    onClick={() => setServiceType("home")}
                    className={`px-4 py-2 border rounded ${serviceType === "home" && "bg-[#FFF8DC]"}`}
                  >
                    Wash at Home
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  `Booking Confirmed!\nDate: ${date}\nTime: ${time}\nVehicle: ${vehicle}\nServices: ${services.join(", ")}\nService Type: ${serviceType}\nTotal Time: ${totalTime} min\nTotal Amount: ₹${totalPrice}`,
                )
              }
              className="bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white px-6 py-2 rounded font-bold whitespace-nowrap"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
