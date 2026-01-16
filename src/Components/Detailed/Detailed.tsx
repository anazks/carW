"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { MapPin, Clock, Users, Phone, ChevronLeft, Calendar, CheckCircle2, Star, Globe, Award } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useParams, useNavigate } from "react-router-dom"
import { getShopDetails, getShopServices } from '../../Api/Shop'
import "leaflet/dist/leaflet.css"

// Constants
const DEFAULT_VEHICLE_TYPES = ["Car", "Bike", "Heavy Vehicle"] as const
const DEFAULT_TIME_SLOTS = {
  morning: [
    { time: "9:00 AM", availableSlots: 5 },
    { time: "10:00 AM", availableSlots: 4 },
    { time: "11:00 AM", availableSlots: 3 },
  ],
  afternoon: [
    { time: "12:00 PM", availableSlots: 6 },
    { time: "2:00 PM", availableSlots: 4 },
    { time: "4:00 PM", availableSlots: 2 },
  ],
} as const
const DEFAULT_PICK_DROP = false
const DEFAULT_WASH_HOME = false

// Types
type ShopService = { name: string; price: number; time: number; vehicleType: typeof DEFAULT_VEHICLE_TYPES }
type TimeSlot = { time: string; availableSlots: number }
type TimeSlots = { morning: TimeSlot[]; afternoon: TimeSlot[] }

// Sub-components
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-gray-600 font-medium text-sm">Loading...</p>
    </div>
  </div>
)

const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="text-5xl mb-3">🔍</div>
      <p className="text-lg text-gray-600 font-medium">Shop not found</p>
    </div>
  </div>
)

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="flex items-center gap-1.5 text-gray-700 hover:text-[#D4AF37] font-medium transition-colors group text-sm"
  >
    <ChevronLeft className="group-hover:-translate-x-0.5 transition-transform" size={16} />
    Back
  </button>
)

const ShopHero = ({ center }: { center: any }) => {
  const hasMedia = center.media?.length > 0 || center.ProfileImage
  const primaryImage = center.media?.[0]?.url || center.ProfileImage

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {hasMedia && (
        <div className="relative h-48 bg-gray-900">
          <img 
            src={primaryImage} 
            alt={center.ShopName} 
            className="w-full h-full object-cover opacity-90"
            onError={(e) => { e.currentTarget.style.display = 'none'; }} // Graceful fallback
          />
          {center.IsPremium && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white px-2 py-1 rounded-md shadow-md flex items-center gap-1 font-semibold text-xs">
              <Award size={14} />
              Premium
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{center.ShopName}</h1>
            <div className="flex items-center gap-0.5 text-yellow-500 mb-2">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} fill="currentColor" size={14} />)}
              <span className="text-gray-600 ml-1 text-xs">5.0 (Premium)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <InfoCard icon={MapPin} title={center.ExactLocation} subtitle={center.City} />
          <InfoCard icon={Clock} title="Hours" subtitle={center.Timing} />
          <InfoCard icon={Phone} title="Contact" subtitle={center.Mobile} />
          {center.website && (
            <InfoCard 
              icon={Globe} 
              title="Website" 
              subtitle={
                <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                  Visit Site
                </a>
              } 
            />
          )}
        </div>
      </div>
    </div>
  )
}

const InfoCard = ({ icon: Icon, title, subtitle }: { icon: any; title: string | React.ReactNode; subtitle: string | React.ReactNode }) => (
  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
    <Icon className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={16} />
    <div>
      <p className="font-medium text-gray-900 text-sm">{title}</p>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  </div>
)

const Gallery = ({ media }: { media: any[] }) => (
  media?.length > 1 && (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Gallery</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {media.slice(1, 5).map((item, index) => (
          <div key={item._id || index} className="relative group overflow-hidden rounded-lg">
            <img 
              src={item.url} 
              alt={item.title || 'Gallery image'} 
              className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
              <p className="text-white text-xs font-medium">{item.title || 'View'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
)

const ShopMap = ({ center }: { center: any }) => {
  const lat = center.ExactLocationCoord?.coordinates?.[1] || 0
  const lng = center.ExactLocationCoord?.coordinates?.[0] || 0

  if (!center.ExactLocationCoord || (lat === 0 && lng === 0)) return null

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-3 border-b">
        <h3 className="text-lg font-bold text-gray-900">Location</h3>
      </div>
      <div className="h-64 relative z-0">
        <MapContainer center={[lat, lng]} zoom={15} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]}>
            <Popup>{center.ShopName}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}

const VehicleSelector = ({ vehicle, onChange }: { vehicle: string; onChange: (v: string) => void }) => (
  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
    <label className="block text-base font-bold text-gray-900 mb-2">Vehicle</label>
    <div className="grid grid-cols-2 gap-2">
      {DEFAULT_VEHICLE_TYPES.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`p-3 rounded-lg border-2 font-medium transition-all text-sm ${
            vehicle === v
              ? "border-[#D4AF37] bg-gradient-to-br from-[#FFF8DC] to-white text-[#D4AF37] shadow-sm"
              : "border-gray-200 hover:border-gray-300 text-gray-700"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  </div>
)

const ServicesList = ({ services: availableServices, selectedServices, onToggle, vehicle }: { 
  services: ShopService[]; 
  selectedServices: string[]; 
  onToggle: (name: string) => void; 
  vehicle: string 
}) => {
  const filtered = availableServices.filter((s) => s.vehicleType.includes(vehicle as any))
  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-3">Services</h2>
        <div className="text-center py-4 text-gray-500">
          <div className="text-2xl mb-1">🚗</div>
          <p className="text-sm">No services for {vehicle}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <h2 className="text-base font-bold text-gray-900 mb-3">Services</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {filtered.map((s) => (
          <label
            key={s.name}
            className={`block border-2 rounded-lg cursor-pointer transition-all p-3 ${
              selectedServices.includes(s.name)
                ? "border-[#D4AF37] bg-gradient-to-br from-[#FFF8DC] to-white shadow-sm"
                : "border-gray-200 hover:border-gray-300 hover:shadow"
            }`}
          >
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={selectedServices.includes(s.name)}
                onChange={() => onToggle(s.name)}
                className="w-4 h-4 accent-[#D4AF37] cursor-pointer mt-0.5"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm mb-0.5">{s.name}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#D4AF37] font-bold">₹{s.price}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600 flex items-center gap-0.5">
                    <Clock size={12} />
                    {s.time} min
                  </span>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

const DateTimePicker = ({ date, time, onDateChange, onTimeChange, timeSlots }: { 
  date: string; 
  time: string; 
  onDateChange: (d: string) => void; 
  onTimeChange: (t: string) => void; 
  timeSlots: TimeSlots 
}) => (
  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
    <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-1.5">
      <Calendar size={16} className="text-[#D4AF37]" />
      Date & Time
    </h2>
    <input
      type="date"
      value={date}
      onChange={(e) => onDateChange(e.target.value)}
      className="w-full border-2 border-gray-200 p-2 rounded-lg mb-3 focus:border-[#D4AF37] focus:outline-none font-medium text-sm"
    />
    <div className="space-y-3">
      {(['morning', 'afternoon'] as const).map((period) => (
        <div key={period}>
          <h3 className="font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </h3>
          <div className="flex gap-1.5 flex-wrap">
            {timeSlots[period]?.map((slot) => (
              <button
                key={slot.time}
                onClick={() => onTimeChange(slot.time)}
                disabled={slot.availableSlots === 0}
                className={`px-3 py-2 border-2 rounded-lg flex flex-col items-center min-w-[75px] transition-all text-sm ${
                  time === slot.time
                    ? "bg-gradient-to-br from-[#D4AF37] to-[#b69530] text-white border-[#D4AF37] shadow-sm scale-105"
                    : slot.availableSlots === 0
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "border-gray-200 hover:border-[#D4AF37] hover:shadow"
                }`}
              >
                <span className="font-bold text-xs">{slot.time}</span>
                <span className={`text-xs flex items-center gap-0.5 mt-0.5 ${
                  time === slot.time ? "text-white/90" : slot.availableSlots === 0 ? "text-gray-400" : "text-green-600"
                }`}>
                  <Users size={10} />
                  {slot.availableSlots}
                </span>
              </button>
            )) || <p className="text-gray-500 text-xs py-1">No slots</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
)

const ServiceTypeSelector = ({ type, pickAndDrop, washAtHome, onChange }: { 
  type: "center" | "pickDrop" | "home"; 
  pickAndDrop: boolean; 
  washAtHome: boolean; 
  onChange: (t: "center" | "pickDrop" | "home") => void 
}) => (
  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 space-y-3">
    <h2 className="text-base font-bold text-gray-900">Service Type</h2>
    <div className="space-y-2">
      <TypeButton 
        label="At Center" 
        sub="Visit facility" 
        selected={type === "center"} 
        onClick={() => onChange("center")} 
      />
      {pickAndDrop && (
        <TypeButton 
          label="Pick & Drop" 
          sub="We transport" 
          selected={type === "pickDrop"} 
          onClick={() => onChange("pickDrop")} 
        />
      )}
      {washAtHome && (
        <TypeButton 
          label="At Home" 
          sub="We visit you" 
          selected={type === "home"} 
          onClick={() => onChange("home")} 
        />
      )}
    </div>
  </div>
)

const TypeButton = ({ label, sub, selected, onClick }: { label: string; sub: string; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`p-3 border-2 rounded-lg font-medium transition-all text-left w-full ${
      selected
        ? "border-[#D4AF37] bg-gradient-to-br from-[#FFF8DC] to-white shadow-sm"
        : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <div className="flex items-center gap-2">
      {selected && <CheckCircle2 className="text-[#D4AF37]" size={16} />}
      <div>
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-gray-600">{sub}</div>
      </div>
    </div>
  </button>
)

const BookingButton = ({ canBook, onBook, center, vehicle, services, date, time, serviceType, totalPrice, totalTime }: { 
  canBook: boolean; 
  onBook: () => void; 
  center: any; 
  vehicle: string; 
  services: string[]; 
  date: string; 
  time: string; 
  serviceType: string; 
  totalPrice: number; 
  totalTime: number 
}) => (
  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
    <button
      onClick={onBook}
      disabled={!canBook}
      className={`w-full py-3 rounded-lg font-bold text-base transition-all ${
        canBook
          ? "bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white shadow-sm hover:shadow-md hover:scale-[1.01]"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      {canBook ? "Confirm Booking" : "Select Services & Time"}
    </button>
    {!canBook && (
      <p className="text-center text-xs text-gray-500 mt-2">Select service, date, time</p>
    )}
  </div>
)

export default function Detailed() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [center, setCenter] = useState<any>(null)
  const [shopServicesRaw, setShopServicesRaw] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [vehicle, setVehicle] = useState(DEFAULT_VEHICLE_TYPES[0])
  const [services, setServices] = useState<string[]>([])
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [serviceType, setServiceType] = useState<"center" | "pickDrop" | "home">("center")

  // All hooks hoisted to top
  const fetchData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      // Fetch in parallel but handle individually
      const detailsPromise = getShopDetails(id).then(res => {
        setCenter(res.data[0])
        return res
      }).catch(err => console.error("Shop details error:", err))

      const servicesPromise = getShopServices(id).then(res => {
        setShopServicesRaw(res.data || [])
        return res
      }).catch(err => console.error("Shop services error:", err))

      await Promise.all([detailsPromise, servicesPromise])
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const shopServices = useMemo((): ShopService[] => 
    shopServicesRaw.map(s => ({
      name: s.ServiceName,
      price: parseInt(s.Rate) || 0,
      time: 30,
      vehicleType: DEFAULT_VEHICLE_TYPES
    })), 
  [shopServicesRaw])

  const totals = useMemo(() => {
    const totalPrice = services.reduce((sum, s) => {
      const svc = shopServices.find((x) => x.name === s)
      return sum + (svc?.price || 0)
    }, 0)

    const totalTime = services.reduce((sum, s) => {
      const svc = shopServices.find((x) => x.name === s)
      return sum + (svc?.time || 0)
    }, 0)

    return { totalPrice, totalTime }
  }, [services, shopServices])

  useEffect(() => {
    if (center) {
      setVehicle(DEFAULT_VEHICLE_TYPES[0])
      setServices([])
      setDate("")
      setTime("")
      setServiceType("center")
    }
  }, [center])

  const toggleService = useCallback((name: string) => {
    setServices((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]))
  }, [])

  const handleVehicleChange = useCallback((newVehicle: string) => {
    setVehicle(newVehicle)
    setServices([])
  }, [])

  const filteredServices = useMemo(() => 
    shopServices.filter((service) => service.vehicleType.includes(vehicle)),
  [shopServices, vehicle])

  const timeSlots = useMemo(() => center?.timeSlots || DEFAULT_TIME_SLOTS, [center])
  const pickAndDrop = useMemo(() => center?.pickAndDrop || DEFAULT_PICK_DROP, [center])
  const washAtHome = useMemo(() => center?.washAtHome || DEFAULT_WASH_HOME, [center])
  const canBook = useMemo(() => services.length > 0 && date && time, [services, date, time])

  const handleBook = useCallback(() => {
    if (canBook && center) {
      alert(
        `🎉 Booking Confirmed!\n\nShop: ${center.ShopName}\nDate: ${date}\nTime: ${time}\nVehicle: ${vehicle}\nServices: ${services.join(", ")}\nType: ${serviceType}\nTime: ${totals.totalTime} min\nAmount: ₹${totals.totalPrice}\n\nThank you!`
      )
    }
  }, [canBook, center, date, time, vehicle, services, serviceType, totals.totalTime, totals.totalPrice])

  // Early returns after all hooks
  if (loading) return <LoadingSpinner />
  if (!center) return <NotFound />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <BackButton onClick={() => navigate(-1)} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <ShopHero center={center} />
            <Gallery media={center.media || []} />
            <ShopMap center={center} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <VehicleSelector vehicle={vehicle} onChange={handleVehicleChange} />
            <ServicesList 
              services={shopServices} 
              selectedServices={services} 
              onToggle={toggleService} 
              vehicle={vehicle} 
            />
            <DateTimePicker 
              date={date} 
              time={time} 
              onDateChange={setDate} 
              onTimeChange={setTime} 
              timeSlots={timeSlots} 
            />
            <ServiceTypeSelector 
              type={serviceType} 
              pickAndDrop={pickAndDrop} 
              washAtHome={washAtHome} 
              onChange={setServiceType} 
            />
            <BookingButton 
              canBook={canBook} 
              onBook={handleBook} 
              center={center} 
              vehicle={vehicle} 
              services={services} 
              date={date} 
              time={time} 
              serviceType={serviceType} 
              totalPrice={totals.totalPrice} 
              totalTime={totals.totalTime} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}