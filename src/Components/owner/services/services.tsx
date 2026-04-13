"use client"

import React, { useState, useEffect } from "react"
import { Plus, Trash2, Save, Bike, Car, Truck, ChevronDown, ChevronUp } from "lucide-react"
import OwnerNavBar from "../Layout/OwnerNavBar"
import { AddService, getmyshops, deleteService as deleteServiceApi } from "../../../Api/Service"
import { getShopServices } from "../../../Api/Shop"

interface ServiceItem {
  _id?: string
  name: string
  price: number
  duration: string
  description: string
  vehicleType: string
}

type VehicleTab = "Bike" | "Car" | "Heavy Vehicle"

const VEHICLE_TABS: { label: VehicleTab; icon: React.ReactElement; color: string; bg: string; border: string; templates: Omit<ServiceItem, "description">[] }[] = [
  {
    label: "Bike",
    icon: <Bike size={18} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-500",
    templates: [
      { name: "Basic Wash", price: 150, duration: "20", vehicleType: "Bike" },
      { name: "Foam & Dry", price: 200, duration: "25", vehicleType: "Bike" },
      { name: "Full Polish", price: 300, duration: "40", vehicleType: "Bike" },
      { name: "Chain Lube + Clean", price: 250, duration: "30", vehicleType: "Bike" },
    ],
  },
  {
    label: "Car",
    icon: <Car size={18} />,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-500",
    templates: [
      { name: "Express Exterior Wash", price: 400, duration: "30", vehicleType: "Car" },
      { name: "Interior Vacuuming", price: 500, duration: "30", vehicleType: "Car" },
      { name: "Full Body Polish", price: 1499, duration: "60", vehicleType: "Car" },
      { name: "Deep Interior Detailing", price: 2000, duration: "90", vehicleType: "Car" },
    ],
  },
  {
    label: "Heavy Vehicle",
    icon: <Truck size={18} />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-500",
    templates: [
      { name: "Full Pressure Wash", price: 1200, duration: "60", vehicleType: "Heavy Vehicle" },
      { name: "Underbody Wash", price: 800, duration: "45", vehicleType: "Heavy Vehicle" },
      { name: "Cabin Interior Clean", price: 1500, duration: "60", vehicleType: "Heavy Vehicle" },
      { name: "Engine Degreasing", price: 2000, duration: "90", vehicleType: "Heavy Vehicle" },
    ],
  },
]

export default function OwnerServices() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [shops, setShops] = useState<any[]>([])
  const [shopId, setShopId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<VehicleTab>("Car")
  const [showTemplates, setShowTemplates] = useState(false)
  const [noShop, setNoShop] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => setStatusMsg(null), 4000)
  }

  const loadServices = async (targetShopId: string) => {
    try {
      setLoading(true)
      const serviceRes = await getShopServices(targetShopId)
      if (serviceRes.success || Array.isArray(serviceRes)) {
        setServices(serviceRes.data || serviceRes)
      }
    } catch (serviceErr) {
      console.error("Failed to load services", serviceErr)
      showStatus("error", "Could not load services for this shop.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const shopRes = await getmyshops()
        if (shopRes.success && shopRes.data && shopRes.data.length > 0) {
          setShops(shopRes.data)
          const firstShop = shopRes.data[0]
          setShopId(firstShop._id)
          loadServices(firstShop._id)
        } else {
          setNoShop(true)
        }
      } catch (err) {
        console.error("Failed to load owner data", err)
        setNoShop(true)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleShopChange = (newShopId: string) => {
    setShopId(newShopId)
    loadServices(newShopId)
  }

  const addService = (template?: Omit<ServiceItem, "description">) => {
    setServices((prev) => [
      ...prev,
      template
        ? { ...template, description: "" }
        : { name: "", price: 0, duration: "30", description: "", vehicleType: activeTab },
    ])
    setShowTemplates(false)
  }

  const updateService = (index: number, field: keyof ServiceItem, value: any) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const deleteService = async (index: number) => {
    const service = services[index]
    if (service._id) {
      // Already saved to DB — call backend to delete
      try {
        await deleteServiceApi(service._id)
        setServices((prev) => prev.filter((_, i) => i !== index))
        showStatus("success", "Service removed successfully.")
      } catch (err) {
        console.error("Delete failed", err)
        showStatus("error", "Failed to delete service. Try again.")
      }
    } else {
      // Draft (never saved) — just remove from local state
      setServices((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const submitServices = async () => {
    if (!shopId) {
      showStatus("error", "No shop found. Please create a wash center first.")
      return
    }
    const unsaved = services.filter((s) => !s._id)
    if (unsaved.length === 0) {
      showStatus("error", "No new services to save — all services are already live.")
      return
    }
    try {
      setSaving(true)
      const savedIds: { index: number; id: string }[] = []
      for (let i = 0; i < services.length; i++) {
        const service = services[i]
        if (!service._id) {
          const res = await AddService({ ...service, shopId })
          if (res?.data?._id) {
            savedIds.push({ index: i, id: res.data._id })
          }
        }
      }
      // Update local state with saved _ids so re-save won't duplicate
      if (savedIds.length > 0) {
        setServices((prev) =>
          prev.map((s, i) => {
            const saved = savedIds.find((x) => x.index === i)
            return saved ? { ...s, _id: saved.id } : s
          })
        )
      }
      showStatus("success", `${savedIds.length} service(s) saved successfully!`)
    } catch (err) {
      console.error("Save failed", err)
      showStatus("error", "Failed to save some services. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const tabServices = services.filter((s) => s.vehicleType === activeTab)
  const vehicleOptions = ["Bike", "Car", "Heavy Vehicle"]
  const currentTab = VEHICLE_TABS.find((t) => t.label === activeTab)!

  return (
    <div className="flex flex-col min-h-screen">
      <OwnerNavBar />

      <div className="flex-grow bg-gray-50 pt-20 px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          {/* PAGE HEADER */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Services</h1>
              <p className="text-sm text-gray-500">Manage your wash services for each vehicle type</p>
            </div>

            {/* SHOP SELECTOR */}
            {shops.length > 1 && (
              <div className="w-full md:w-64">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Select Wash Center</label>
                <div className="relative">
                  <select
                    value={shopId || ""}
                    onChange={(e) => handleShopChange(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 p-3 rounded-xl appearance-none focus:border-[#D4AF37] outline-none font-semibold text-sm pr-10"
                  >
                    {shops.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.ShopName || s.shopName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            )}
          </div>

          {/* STATUS TOAST */}
          {statusMsg && (
            <div className={`mb-4 px-5 py-3 rounded-xl font-semibold text-sm shadow ${
              statusMsg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {statusMsg.type === "success" ? "✅ " : "❌ "}{statusMsg.text}
            </div>
          )}

          {/* NO SHOP WARNING */}
          {!loading && noShop && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl px-5 py-4 mb-6 text-sm font-medium">
              ⚠️ You haven't added a wash center yet. Please go to <strong>Add Shop</strong> first, then come back to manage services.
            </div>
          )}

          {/* VEHICLE TYPE TABS */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {VEHICLE_TABS.map((tab) => {
              const count = services.filter((s) => s.vehicleType === tab.label).length
              const isActive = activeTab === tab.label
              return (
                <button
                  key={tab.label}
                  onClick={() => { setActiveTab(tab.label); setShowTemplates(false) }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                    isActive
                      ? `${tab.bg} ${tab.color} ${tab.border} shadow-sm`
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/70" : "bg-gray-100"}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* CONTENT CARD */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* CARD HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className={`flex items-center gap-2 ${currentTab.color} font-bold text-lg`}>
                {currentTab.icon}
                {activeTab} Services
              </div>

              <div className="flex gap-2 relative">
                {/* TEMPLATE PICKER */}
                <div className="relative">
                  <button
                    onClick={() => setShowTemplates((v) => !v)}
                    className={`flex items-center gap-2 ${currentTab.bg} ${currentTab.color} px-4 py-2 rounded-lg text-sm font-bold border ${currentTab.border} hover:opacity-90 transition`}
                  >
                    Quick Add
                    {showTemplates ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {showTemplates && (
                    <div className="absolute right-0 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-xl w-64 overflow-hidden">
                      <p className="text-xs font-bold text-gray-400 uppercase px-4 py-2 border-b">Common {activeTab} Services</p>
                      {currentTab.templates.map((t) => (
                        <button
                          key={t.name}
                          onClick={() => addService(t)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex justify-between items-center"
                        >
                          <span className="text-sm font-medium text-gray-700">{t.name}</span>
                          <span className="text-xs text-gray-400 font-bold">₹{t.price}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => addService()}
                  className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                >
                  <Plus size={16} />
                  Custom
                </button>
              </div>
            </div>

            {/* EMPTY STATE */}
            {loading ? (
              <p className="text-center py-10 text-gray-400">Loading your services...</p>
            ) : tabServices.length === 0 ? (
              <div className={`border-2 border-dashed rounded-xl p-10 text-center ${currentTab.bg}`}>
                <div className={`${currentTab.color} flex justify-center mb-3`}>{currentTab.icon && <span className="scale-150 inline-block">{currentTab.icon}</span>}</div>
                <p className="text-gray-500 font-medium mb-1">No {activeTab} services added yet</p>
                <p className="text-gray-400 text-sm">Click "Quick Add" to add a preset service, or "Custom" to create your own.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service, idx) => {
                  if (service.vehicleType !== activeTab) return null
                  return (
                    <div key={idx} className={`border-2 rounded-xl p-5 relative group transition ${service.vehicleType === activeTab ? "" : "hidden"}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Service Name */}
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Service Name</label>
                          <input
                            placeholder="e.g., Express Wash"
                            value={service.name}
                            onChange={(e) => updateService(idx, "name", e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Price (₹)</label>
                          <input
                            type="number"
                            placeholder="150"
                            value={service.price}
                            onChange={(e) => updateService(idx, "price", Number(e.target.value))}
                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                          />
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Duration (min)</label>
                          <input
                            type="text"
                            placeholder="30"
                            value={service.duration}
                            onChange={(e) => updateService(idx, "duration", e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm"
                          />
                        </div>

                        {/* Vehicle Type */}
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Vehicle Type</label>
                          <select
                            value={service.vehicleType}
                            onChange={(e) => updateService(idx, "vehicleType", e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none bg-white text-sm"
                          >
                            {vehicleOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Description</label>
                        <textarea
                          placeholder="e.g., Foam wash and chain lubrication"
                          value={service.description}
                          onChange={(e) => updateService(idx, "description", e.target.value)}
                          className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none h-16 resize-none text-sm"
                        />
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center bg-gray-50 -m-5 mt-4 p-3 rounded-b-xl px-5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          {service._id ? "✅ Live on Store" : "Draft"}
                        </span>
                        <button
                          onClick={() => deleteService(idx)}
                          className="text-red-400 hover:text-red-600 transition flex items-center gap-1 text-sm font-bold"
                        >
                          <Trash2 size={16} /> REMOVE
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* SAVE BUTTON */}
            {services.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={submitServices}
                  disabled={saving}
                  className="flex items-center gap-2 bg-black text-white px-12 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-xl disabled:bg-gray-400"
                >
                  {saving ? "SAVING..." : (
                    <>
                      <Save size={20} />
                      SAVE ALL SERVICES
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
        © {new Date().getFullYear()} Sparkle Car Wash. All rights reserved.
      </footer>
    </div>
  )
}
