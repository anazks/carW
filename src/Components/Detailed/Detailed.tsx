"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { MapPin, ChevronLeft, CheckCircle2, Clock, Bike, Car, Truck } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useParams, useNavigate } from "react-router-dom"
import { getShopDetails, getShopServices, getAvailbleSlots } from "../../Api/Shop"
import { createBooking } from "../../Api/Booking"
import L from "leaflet"

import "leaflet/dist/leaflet.css"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// ---------------- TYPES ----------------
const DUMMY_IDS = ["shop-1", "shop-2", "shop-3"];

const DUMMY_SHOPS: Record<string, ShopDetails> = {
  "shop-1": {
    _id: "shop-1",
    ShopName: "Sparkle Shine Auto",
    ExactLocation: "Downtown, Mumbai",
    ExactLocationCoord: { type: "Point", coordinates: [72.8777, 19.076] }
  },
  "shop-2": {
    _id: "shop-2",
    ShopName: "Premium Wash Care",
    ExactLocation: "Andheri West, Mumbai",
    ExactLocationCoord: { type: "Point", coordinates: [72.8697, 19.1136] }
  },
  "shop-3": {
    _id: "shop-3",
    ShopName: "Eco Steam Wash",
    ExactLocation: "Bandra, Mumbai",
    ExactLocationCoord: { type: "Point", coordinates: [72.8295, 19.0596] }
  },
};

const SERVICE_SETS = {
  "shop-1": [
    { _id: "s1", name: "Standard Exterior Wash", price: 399, duration: "30", vehicleType: "Car", description: "Exterior cleaning with soap and wax." },
    { _id: "s2", name: "Premium Interior Detailing", price: 1499, duration: "60", vehicleType: "Car", description: "Deep cleaning of seats and dashboard." },
    { _id: "s3", name: "Bike Polish", price: 299, duration: "40", vehicleType: "Bike", description: "Surface polishing and chain cleaning." },
    { _id: "s4", name: "Heavy Wash", price: 1200, duration: "60", vehicleType: "Heavy Vehicle", description: "Full pressure wash for large vehicles." },
  ],
  "shop-2": [
    { _id: "s5", name: "Engine Steam Cleaning", price: 899, duration: "45", vehicleType: "Car", description: "Deep safe engine degreasing." },
    { _id: "s6", name: "Full Body Polish", price: 1999, duration: "90", vehicleType: "Car", description: "Scratch removal and shine." },
    { _id: "s7", name: "Bike Foam Wash", price: 199, duration: "25", vehicleType: "Bike", description: "Quick foam wash and dry." },
  ],
  "shop-3": [
    { _id: "s8", name: "Anti-Rust Coating", price: 3500, duration: "150", vehicleType: "Car", description: "Chassis protection." },
    { _id: "s9", name: "Express Foam Wash", price: 499, duration: "25", vehicleType: "Car", description: "Quick pressure wash." },
    { _id: "s10", name: "Chassis Wash", price: 800, duration: "45", vehicleType: "Heavy Vehicle", description: "Deep cleaning of vehicle undercarriage." },
  ],
};

const DUMMY_SLOTS: Slot[] = [
  { time: "09:00 AM", availableSlots: 2 },
  { time: "10:30 AM", availableSlots: 1 },
  { time: "12:00 PM", availableSlots: 0 },
  { time: "02:00 PM", availableSlots: 3 },
  { time: "04:30 PM", availableSlots: 1 },
];

interface ShopDetails {
  _id: string
  ShopName: string
  ExactLocation: string
  ProfileImage?: string    // Added
  ExactLocationCoord: {
    type: string
    coordinates: number[]
  }
}

interface ShopService {
  _id: string
  name: string
  price: number
  duration: string         // Changed to string to match model
  description: string
  vehicleType?: string     // Added
}

interface SelectedService extends ShopService {
  quantity: number
}

interface Slot {
  time: string
  availableSlots: number
}

// ---------------- COMPONENT ----------------
export default function Detailed() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [shop, setShop] = useState<ShopDetails | null>(null)
  const [services, setServices] = useState<ShopService[]>([])
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])

  const [vehicleType, setVehicleType] = useState<'Bike' | 'Car' | 'Heavy Vehicle'>('Car')
  const [date, setDate] = useState("")
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // ---------------- FETCH SHOP + SERVICES ----------------
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const shopRes = await getShopDetails(id)
        const serviceRes = await getShopServices(id)

        if (shopRes.success) {
          setShop(shopRes.data)
        } else if (id && DUMMY_IDS.includes(id)) {
          setShop(DUMMY_SHOPS[id])
        }

        if (serviceRes.success || Array.isArray(serviceRes)) {
          setServices(serviceRes.data || serviceRes)
        } else if (id && DUMMY_IDS.includes(id)) {
          setServices(SERVICE_SETS[id as keyof typeof SERVICE_SETS] || SERVICE_SETS["shop-1"])
        }
      } catch (err) {
        console.error("Failed to fetch shop data", err)
        if (id && DUMMY_IDS.includes(id)) {
          setShop(DUMMY_SHOPS[id])
          setServices(SERVICE_SETS[id as keyof typeof SERVICE_SETS] || SERVICE_SETS["shop-1"])
        }
      }
    }

    fetchData()
  }, [id])

  // ---------------- FETCH SLOTS ----------------
  const fetchSlots = useCallback(async () => {
    if (!id || !date) return

    try {
      setLoadingSlots(true)
      setSelectedSlot(null) // reset selection on date change

      const response = await getAvailbleSlots(id, date)
      // response is already response.data from the axios call
      // Backend returns: { success: true, availableSlots: ["09:00 AM - 10:00 AM", ...] }
      const rawSlots = response?.availableSlots || response?.data?.availableSlots

      if (rawSlots && rawSlots.length > 0) {
        // Normalize: backend may return strings or objects
        const normalized: Slot[] = rawSlots.map((s: any) => {
          if (typeof s === 'string') {
            return { time: s, availableSlots: 3 } // default capacity since backend doesn't return it
          }
          return s as Slot
        })
        setSlots(normalized)
      } else if (id && DUMMY_IDS.includes(id)) {
        setSlots(DUMMY_SLOTS)
      } else {
        setSlots([])
      }
    } catch (err) {
      console.error("Failed to fetch slots", err)
      if (id && DUMMY_IDS.includes(id)) {
        setSlots(DUMMY_SLOTS)
      } else {
        setSlots([])
      }
    } finally {
      setLoadingSlots(false)
    }
  }, [id, date])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  // ---------------- ACTIONS ----------------
  const toggleService = (service: ShopService) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s._id === service._id);
      if (exists) {
        return prev.filter(s => s._id !== service._id);
      } else {
        return [...prev, { ...service, quantity: 1 }];
      }
    });
  };

  // ---------------- TOTALS ----------------
  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0),
    [selectedServices]
  )

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, s) => sum + (parseInt(s.duration) || 0) * s.quantity, 0),
    [selectedServices]
  )

  // ---------------- BOOKING ----------------
  const handleBooking = async () => {
    if (!id) return;
    
    if (selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }
    if (!date) {
      alert("Please select a booking date.");
      return;
    }
    if (!selectedSlot) {
      alert("Please select a time slot.");
      return;
    }

    try {
      setLoading(true)

      const parseTime = (timeStr: string) => {
        if (!timeStr) return "";
        try {
          return new Date(`${date} ${timeStr}`).toISOString();
        } catch (e) {
          return `${date} ${timeStr}`;
        }
      };

const bookingData = {
  shopId: id,
  shopName: shop?.ShopName || "Car Wash Shop", // ✅ was "barberName", must be "shopName"
  bookingDate: date,
  startTime: selectedSlot.split(' - ')[0]?.trim() || selectedSlot, // ✅ plain string, no ISO
  endTime: selectedSlot.split(' - ')[1]?.trim() || selectedSlot,   // ✅ plain string, no ISO
  services: selectedServices.map(s => ({
    name: s.name,
    price: s.price,
    duration: parseInt(s.duration) || 0, // ✅ number, not string
  })),
  totalPrice: totalPrice,
  vehicleType,
};

      const bookingRes = await createBooking(bookingData)

      if (bookingRes.data?.success) {
        setShowConfirm(true)
      } else {
        throw new Error("Booking failed on server");
      }
    } catch (err: any) {
      console.error("Booking failed", err)
      const errorMsg = err.response?.data?.message || err.message || "Unknown error";
      alert(`Booking failed: ${errorMsg}`);
    } finally {
      setLoading(false)
    }
  }

  // ---------------- UI ----------------
  if (!shop) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER SECTION */}
      <div className="relative h-[300px] lg:h-[400px]">
        <img 
          src={shop.ProfileImage || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1200&h=400"} 
          alt={shop.ShopName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-6 left-6 flex gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute bottom-10 left-6 right-6 lg:left-20 text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">{shop.ShopName}</h1>
          <p className="flex items-center gap-2 opacity-90 text-lg">
            <MapPin size={20} className="text-[#D4AF37]" /> {shop.ExactLocation}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* VEHICLE TYPE SELECTOR */}
            <div className="bg-white p-2 rounded-2xl shadow-xl flex gap-2">
              {(['Bike', 'Car', 'Heavy Vehicle'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setVehicleType(type);
                    setSelectedServices([]);
                  }}
                  className={`flex-1 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    vehicleType === type
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-transparent text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {type === 'Bike' && <Bike size={20} />}
                  {type === 'Car' && <Car size={20} />}
                  {type === 'Heavy Vehicle' && <Truck size={20} />}
                  {type}
                </button>
              ))}
            </div>

            {/* SERVICES */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Available Services for <span className="text-[#D4AF37]">{vehicleType}</span>
              </h2>
              <div className="grid gap-4">
                {services
                  .filter(s => s.vehicleType === vehicleType || (s as any).vehicleTypes?.includes(vehicleType))
                  .map((service) => {
                    const isSelected = selectedServices.some(s => s._id === service._id);
                    return (
                      <div
                        key={service._id}
                        onClick={() => toggleService(service)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${
                          isSelected 
                            ? 'border-black bg-gray-50' 
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 group-hover:text-black transition">{service.name}</h3>
                          <p className="text-gray-500 text-sm mb-2">{service.description}</p>
                          <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={14} /> {service.duration} mins</span>
                            <span className="text-black text-sm">₹{service.price}</span>
                          </div>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="text-black" size={28} />
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-gray-200 group-hover:border-black transition" />
                        )}
                      </div>
                    );
                  })}
                {services.filter(s => s.vehicleType === vehicleType || (s as any).vehicleTypes?.includes(vehicleType)).length === 0 && (
                  <p className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl">No services available for this vehicle type yet.</p>
                )}
              </div>
            </div>

            {/* MAP */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-96">
               <h2 className="text-2xl font-bold mb-4">Location</h2>
               <div className="h-[calc(100%-40px)] rounded-xl overflow-hidden shadow-inner">
                <MapContainer
                  center={[shop.ExactLocationCoord.coordinates[1], shop.ExactLocationCoord.coordinates[0]]}
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[shop.ExactLocationCoord.coordinates[1], shop.ExactLocationCoord.coordinates[0]]}>
                    <Popup>{shop.ShopName}</Popup>
                  </Marker>
                </MapContainer>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-black sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Select Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none font-semibold"
                />
              </div>

              <div className="mb-8">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Available Slots</label>
                <div className="grid grid-cols-2 gap-3">
                  {!date ? (
                    <div className="col-span-2 py-4 text-center text-gray-400 text-sm">Please select a date first</div>
                  ) : loadingSlots ? (
                    <div className="col-span-2 py-4 text-center text-gray-400 italic">Finding slots...</div>
                  ) : slots.length === 0 ? (
                    <div className="col-span-2 py-4 text-center text-gray-400 text-sm">No slots available for this date</div>
                  ) : (
                    slots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={slot.availableSlots === 0}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all ${
                          selectedSlot === slot.time 
                            ? 'bg-black border-black text-white shadow-lg' 
                            : slot.availableSlots === 0 
                              ? 'bg-gray-50 border-gray-50 text-gray-300 cursor-not-allowed line-through'
                              : 'bg-white border-gray-100 hover:border-gray-200 text-gray-600'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t-2 border-dashed pt-6 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Selected Services</span>
                  <span className="font-bold text-black">{selectedServices.length}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Total Duration</span>
                  <span className="font-bold text-black">{totalDuration} mins</span>
                </div>
                <div className="h-px bg-gray-100 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total Price</span>
                  <span className="text-2xl font-extrabold text-[#D4AF37]">₹{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading || !selectedSlot || !date || selectedServices.length === 0}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl ${
                  loading || !selectedSlot || !date || selectedServices.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-black text-white hover:bg-gray-900 active:scale-95'
                }`}
              >
                {loading ? "Processing..." : "CONFIRM BOOKING"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white p-10 rounded-3xl w-full max-w-md text-center shadow-2xl scale-in-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-600" size={48} />
            </div>
            <h3 className="text-3xl font-black mb-2">Booking Done!</h3>
            <p className="text-gray-500 mb-8">Your car wash session has been scheduled successfully. We'll see you there!</p>
            <button
              onClick={() => navigate("/history")}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-gray-900 active:scale-95 transition"
            >
              VIEW MY BOOKINGS
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
