"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { MapPin, Clock, Users, Phone, ChevronLeft, Calendar, CheckCircle2, Star, Globe, Award, X } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useParams, useNavigate } from "react-router-dom"
import { getShopDetails, getShopServices, getAvailbleSlots } from '../../Api/Shop'
import { createBooking, createOrder, verifyPayment } from '../../Api/Booking'
import { useRazorpay } from "react-razorpay"

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
const SLOT_BOOKING_AMOUNT = 50

// Types
type ShopService = { _id: string; name: string; price: number; time: number; vehicleType: typeof DEFAULT_VEHICLE_TYPES }
type SelectedService = { id: string; name: string; price: number; duration: number }
type TimeSlot = { time: string; availableSlots: number }
type TimeSlots = { morning: TimeSlot[]; afternoon: TimeSlot[] }
type FreeSlot = { from: string; to: string }
type PaymentOption = 'slot' | 'full'

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
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
  selectedServices: SelectedService[]; 
  onToggle: (service: SelectedService) => void; 
  vehicle: string 
}) => {
  const filtered = useMemo(() => 
    availableServices.filter((s) => s.vehicleType.includes(vehicle as any)), 
  [availableServices, vehicle])

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
        {filtered.map((s) => {
          const selectedSvc = selectedServices.find(ss => ss.id === s._id)
          return (
            <label
              key={s._id}
              className={`block border-2 rounded-lg cursor-pointer transition-all p-3 ${
                !!selectedSvc
                  ? "border-[#D4AF37] bg-gradient-to-br from-[#FFF8DC] to-white shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:shadow"
              }`}
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={!!selectedSvc}
                  onChange={() => onToggle({ id: s._id, name: s.name, price: s.price, duration: s.time })}
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
          )
        })}
      </div>
    </div>
  )
}

const DateTimePicker = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange, 
  timeSlots, 
  loadingSlots, 
  servicesSelected 
}: { 
  date: string; 
  time: string; 
  onDateChange: (d: string) => void; 
  onTimeChange: (t: string) => void; 
  timeSlots: TimeSlots;
  loadingSlots: boolean;
  servicesSelected: boolean 
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
    {loadingSlots ? (
      <div className="text-center py-4 text-gray-500">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm">Loading slots...</p>
      </div>
    ) : date && servicesSelected ? (
      <div className="space-y-3">
        {(['morning', 'afternoon'] as const).map((period) => {
          const periodSlots = timeSlots[period]
          if (!periodSlots || periodSlots.length === 0) {
            return (
              <div key={period}>
                <h3 className="font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </h3>
                <p className="text-gray-500 text-xs py-1">No slots available</p>
              </div>
            )
          }
          return (
            <div key={period}>
              <h3 className="font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </h3>
              <div className="flex gap-1.5 flex-wrap">
                {periodSlots.map((slot) => (
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
                ))}
              </div>
            </div>
          )
        })}
      </div>
    ) : (
      <div className="text-center py-4 text-gray-500">
        <p className="text-sm">Select a date and at least one service to view available time slots</p>
      </div>
    )}
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
  services: SelectedService[]; 
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

// Confirmation Modal
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  center, 
  vehicle, 
  selectedServices, 
  date, 
  time, 
  serviceType, 
  totalPrice, 
  totalTime,
  paymentOption,
  onPaymentOptionChange
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  center: any; 
  vehicle: string; 
  selectedServices: SelectedService[]; 
  date: string; 
  time: string; 
  serviceType: string; 
  totalPrice: number; 
  totalTime: number;
  paymentOption: PaymentOption;
  onPaymentOptionChange: (option: PaymentOption) => void;
}) => {
  if (!isOpen) return null

  const slotAmount = SLOT_BOOKING_AMOUNT
  const selectedAmount = paymentOption === 'slot' ? slotAmount : totalPrice

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Confirm Booking</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold text-gray-900">Shop:</p>
            <p className="text-gray-600">{center.ShopName}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Vehicle:</p>
            <p className="text-gray-600">{vehicle}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Services:</p>
            <p className="text-gray-600">{selectedServices.map(s => s.name).join(', ')}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Date & Time:</p>
            <p className="text-gray-600">{date} at {time}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Service Type:</p>
            <p className="text-gray-600 capitalize">{serviceType.replace(/([A-Z])/g, ' $1')}</p>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total: ₹{totalPrice}</span>
              <span>{totalTime} min</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="font-semibold text-gray-900 mb-2">Payment Option:</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="slot"
                  checked={paymentOption === 'slot'}
                  onChange={() => onPaymentOptionChange('slot')}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <div>
                  <div className="font-medium">Slot Booking</div>
                  <div className="text-xs text-gray-600">Secure your slot for ₹{slotAmount} (pay remaining later)</div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="full"
                  checked={paymentOption === 'full'}
                  onChange={() => onPaymentOptionChange('full')}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <div>
                  <div className="font-medium">Full Payment</div>
                  <div className="text-xs text-gray-600">Pay total amount upfront</div>
                </div>
              </label>
            </div>
            <div className="flex justify-between text-lg font-bold mt-3 pt-2 border-t">
              <span>Amount to Pay: ₹{selectedAmount}</span>
              <span>Remaining: ₹{paymentOption === 'slot' ? totalPrice - slotAmount : 0}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-2 px-4 bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white rounded-lg font-bold hover:shadow-md"
          >
            Confirm & Pay ₹{selectedAmount}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Detailed() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [center, setCenter] = useState<any>(null)
  const [shopServicesRaw, setShopServicesRaw] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [vehicle, setVehicle] = useState(DEFAULT_VEHICLE_TYPES[0])
  const [services, setServices] = useState<SelectedService[]>([])
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [serviceType, setServiceType] = useState<"center" | "pickDrop" | "home">("center")
  const [timeSlots, setTimeSlots] = useState<TimeSlots>(DEFAULT_TIME_SLOTS)
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('slot')
  // Assume userId from auth context/localStorage; replace with actual auth logic
  const userId = useMemo(() => localStorage.getItem('userId') || 'temp-user-id', []) // TODO: Integrate with auth
  const email = useMemo(() => localStorage.getItem('email') || 'customer@example.com', []) // From localStorage

  const { error, isLoading: razorpayLoading } = useRazorpay()

  // Function to generate TimeSlots from API schedule
  const generateTimeSlots = useCallback((schedule: any): TimeSlots => {
    if (!schedule?.freeSlots || !Array.isArray(schedule.freeSlots)) {
      console.warn("Invalid schedule or no free slots provided")
      return DEFAULT_TIME_SLOTS
    }

    // Helper to parse HH:MM to minutes since midnight
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }

    // Helper to format minutes to "H:MM AM/PM"
    const formatTime = (minutes: number): string => {
      let hours = Math.floor(minutes / 60)
      const mins = (minutes % 60).toString().padStart(2, '0')
      const period = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12
      return `${hours}:${mins} ${period}`
    }

    interface TempSlot extends TimeSlot { minutes: number }
    const morning: TempSlot[] = []
    const afternoon: TempSlot[] = []

    schedule.freeSlots.forEach((freeSlot: FreeSlot) => {
      let currentMin = parseTime(freeSlot.from)
      const endMin = parseTime(freeSlot.to)

      // Generate 30-minute slots within the free period
      while (currentMin + 30 <= endMin) {
        const slotTime = formatTime(currentMin)
        const availableSlots = 4 // Fixed; adjust as needed
        const slot: TempSlot = { time: slotTime, availableSlots, minutes: currentMin }

        if (currentMin < 12 * 60) {
          morning.push(slot)
        } else {
          afternoon.push(slot)
        }

        currentMin += 30
      }
    })

    // Sort by minutes and map back to TimeSlot
    const sortedMorning = morning.sort((a, b) => a.minutes - b.minutes).map(({ time, availableSlots }) => ({ time, availableSlots }))
    const sortedAfternoon = afternoon.sort((a, b) => a.minutes - b.minutes).map(({ time, availableSlots }) => ({ time, availableSlots }))

    return { morning: sortedMorning, afternoon: sortedAfternoon }
  }, [])

  // All hooks hoisted to top
  const fetchData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const [detailsRes, servicesRes] = await Promise.all([
        getShopDetails(id).catch(err => { console.error("Shop details error:", err); return null }),
        getShopServices(id).catch(err => { console.error("Shop services error:", err); return null })
      ])
      if (detailsRes?.data) setCenter(detailsRes.data[0])
      if (servicesRes?.data) setShopServicesRaw(servicesRes.data)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchAvailableSlots = useCallback(async (shopId: string, bookingDate: string) => {
    if (!shopId || !bookingDate) return
    try {
      setLoadingSlots(true)
      const response = await getAvailbleSlots({ shopId, bookingDate })
      if (response?.data?.success && response.data.availableSlots?.success === true) {
        const schedule = response.data.availableSlots.schedule
        if (schedule?.freeSlots?.length > 0) {
          const generatedSlots = generateTimeSlots(schedule)
          setTimeSlots(generatedSlots)
          return
        }
      }
      setTimeSlots(DEFAULT_TIME_SLOTS)
    } catch (error) {
      console.error("Error fetching available slots:", error)
      setTimeSlots(DEFAULT_TIME_SLOTS)
    } finally {
      setLoadingSlots(false)
    }
  }, [generateTimeSlots])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Fetch slots only after date and services are selected
  useEffect(() => {
    if (center?._id && date && services.length > 0) {
      fetchAvailableSlots(center._id, date)
    } else {
      setTimeSlots(DEFAULT_TIME_SLOTS)
    }
  }, [center, date, services.length, fetchAvailableSlots])

  const shopServices = useMemo((): ShopService[] => 
    shopServicesRaw.map(s => ({
      _id: s._id,
      name: s.ServiceName,
      price: parseInt(s.Rate) || 0,
      time: 30,
      vehicleType: DEFAULT_VEHICLE_TYPES
    })), 
  [shopServicesRaw])

  const totals = useMemo(() => {
    const totalPrice = services.reduce((sum, s) => sum + s.price, 0)
    const totalTime = services.reduce((sum, s) => sum + s.duration, 0)
    return { totalPrice, totalTime }
  }, [services])

  useEffect(() => {
    if (center) {
      setVehicle(DEFAULT_VEHICLE_TYPES[0])
      setServices([])
      setDate("")
      setTime("")
      setServiceType("center")
      setTimeSlots(DEFAULT_TIME_SLOTS)
      setPaymentOption('slot')
    }
  }, [center])

  const toggleService = useCallback((service: SelectedService) => {
    setServices((prev) => 
      prev.some((s) => s.id === service.id) 
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    )
  }, [])

  const handleVehicleChange = useCallback((newVehicle: string) => {
    setVehicle(newVehicle)
    setServices([])
  }, [])

  const filteredServices = useMemo(() => 
    shopServices.filter((service) => service.vehicleType.includes(vehicle)),
  [shopServices, vehicle])

  const pickAndDrop = useMemo(() => center?.pickAndDrop || DEFAULT_PICK_DROP, [center])
  const washAtHome = useMemo(() => center?.washAtHome || DEFAULT_WASH_HOME, [center])
  const canBook = useMemo(() => services.length > 0 && date && time, [services, date, time])
  const servicesSelected = useMemo(() => services.length > 0, [services])

  // Parse time to minutes for end time calculation
  const parseTimeToMinutes = useCallback((timeStr: string): number => {
    const [timePart, period] = timeStr.split(' ')
    let [hours, minutes] = timePart.split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return hours * 60 + minutes
  }, [])

  const handleBook = useCallback(async () => {
    if (canBook && center && services.length > 0 && !razorpayLoading) {
      // Calculate start and end times
      const startMinutes = parseTimeToMinutes(time)
      const startDate = new Date(date)
      startDate.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0)
      const endDate = new Date(startDate)
      endDate.setMinutes(endDate.getMinutes() + totals.totalTime)

      const amountToPay = paymentOption === 'slot' ? SLOT_BOOKING_AMOUNT : totals.totalPrice
      const remainingAmount = paymentOption === 'slot' ? totals.totalPrice - SLOT_BOOKING_AMOUNT : 0
      const description = paymentOption === 'slot' 
        ? `Slot booking for ${vehicle} - ${services.map(s => s.name).join(', ')} (₹${amountToPay} advance)`
        : `Full booking for ${vehicle} - ${services.map(s => s.name).join(', ')}`

      // Prepare order data (minimal for Razorpay order creation)
      const orderData = {
        amount: amountToPay * 100, // In paise
        currency: "INR",
        receipt: `booking-${Date.now()}`, // Unique receipt ID
        notes: {
          userId,
          shopId: center._id,
          vehicle,
          services: services.map(s => ({ id: s.id, name: s.name })),
          bookingDate: date,
          timeSlot: { startingTime: startDate.toISOString(), endingTime: endDate.toISOString() },
          serviceType,
          paymentType: paymentOption,
          remainingAmount
        }
      }

      console.log("Prepared order data:", orderData)
      try {
        // Step 1: Call createOrder to get Razorpay orderId
        const orderResponse = await createOrder(orderData)
        console.log("Order response:", orderResponse)
        if (orderResponse?.status !== 200 || !orderResponse.data?.id) {
          throw new Error('Failed to create order')
        }

        const razorpayOrderId = orderResponse.data.id
        console.log("Razorpay Order ID:", razorpayOrderId)

        // Step 2: Open Razorpay with the orderId
        const options = {
          key: "rzp_test_fccR1aGiSJLS1e" || process.env.REACT_APP_RAZORPAY_KEY, // Use env var in production
          amount: amountToPay * 100, // Amount in paise
          currency: "INR",
          name: center.ShopName,
          description,
          order_id: razorpayOrderId,
          prefill: {
            name: localStorage.getItem('name') || "Customer Name", // From localStorage if available
            email,
            contact: localStorage.getItem('phone') || "9999999999", // From localStorage if available
          },
          theme: {
            color: "#D4AF37",
          },
          modal: {
            ondismiss: () => {
              // Optional: Handle payment dismissal (e.g., cancel order if needed)
              console.log('Payment dismissed')
            }
          }
        };

        const rzp = new (window as any).Razorpay(options); // Use window.Razorpay if useRazorpay hook issues
        rzp.open();

        rzp.on('payment.success', async (paymentResponse: any) => {
          console.log("Payment response:", paymentResponse);
          
          // Step 3: Verify payment on backend
          const verifyData = {
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature,
            email // Pass email from localStorage
          }

          try {
            const verifyResponse = await verifyPayment(verifyData)
            console.log("Verify response:", verifyResponse)
            if (verifyResponse?.status !== 200 || !verifyResponse.data?.success) {
              throw new Error('Payment verification failed')
            }

            // Step 4: On verification success, create the booking with payment details
            const bookingData = {
              userId,
              shopId: center._id,
              serviceIds: services.map(s => s.id),
              services: services.map(s => ({
                id: s.id,
                name: s.name,
                price: s.price,
                duration: s.duration
              })),
              bookingDate: date,
              timeSlot: {
                startingTime: startDate.toISOString(),
                endingTime: endDate.toISOString()
              },
              totalPrice: totals.totalPrice,
              totalDuration: totals.totalTime,
              paymentType: paymentOption,
              amountToPay,
              remainingAmount,
              currency: "INR",
              serviceType,
              vehicle,
              // Add verified payment details
              verifiedPayment: verifyResponse.data // Include full verified data if needed
            }

            const bookingResponse = await createBooking(bookingData)
            console.log("Booking response:", bookingResponse)
            if (bookingResponse?.status === 200 && bookingResponse.data?.success) {
              const { bookingId } = bookingResponse.data
              alert(`🎉 Payment Verified & Booking Successful! Booking ID: ${bookingId}\n\nThank you for choosing us!`)
              // Reset form or navigate
              setServices([])
              setDate("")
              setTime("")
              navigate('/bookings') // Assuming route
            } else {
              throw new Error('Booking creation failed after verification')
            }
          } catch (error) {
            console.error('Verification or Booking error:', error)
            alert(`Payment succeeded, but verification/booking failed. Please contact support with Payment ID: ${paymentResponse.razorpay_payment_id}`)
          }
        });
      } catch (error) {
        console.error('API Error:', error)
        alert(`Error: ${error.response?.data?.message || 'Order creation failed'}`)
      }
    }
  }, [canBook, center, services, date, time, serviceType, totals, userId, navigate, parseTimeToMinutes, razorpayLoading, time, paymentOption, vehicle, email])

  const openConfirmModal = useCallback(() => {
    if (canBook && center) {
      setShowConfirmModal(true)
    }
  }, [canBook, center])

  const closeConfirmModal = useCallback(() => {
    setShowConfirmModal(false)
  }, [])

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
              loadingSlots={loadingSlots}
              servicesSelected={servicesSelected}
            />
            <ServiceTypeSelector 
              type={serviceType} 
              pickAndDrop={pickAndDrop} 
              washAtHome={washAtHome} 
              onChange={setServiceType} 
            />
            <BookingButton 
              canBook={canBook} 
              onBook={openConfirmModal} 
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

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={handleBook}
        center={center}
        vehicle={vehicle}
        selectedServices={services}
        date={date}
        time={time}
        serviceType={serviceType}
        totalPrice={totals.totalPrice}
        totalTime={totals.totalTime}
        paymentOption={paymentOption}
        onPaymentOptionChange={setPaymentOption}
      />
    </div>
  )
}