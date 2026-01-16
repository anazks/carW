"use client"

import { useState } from "react"
import { Plus, Trash2, Save } from "lucide-react"
import OwnerNavBar from "../Layout/OwnerNavBar"

interface Service {
  id: number
  name: string
  price: string
  durationValue: string
  durationUnit: "min" | "hr"
  vehicleType: string[]
}

export default function OwnerServices() {
  const [services, setServices] = useState<Service[]>([])

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        price: "",
        durationValue: "",
        durationUnit: "min",
        vehicleType: [],
      },
    ])
  }

  const updateService = (id: number, field: keyof Service, value: string | string[]) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const toggleVehicleType = (id: number, vehicle: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = s.vehicleType.includes(vehicle)
            ? s.vehicleType.filter((v) => v !== vehicle)
            : [...s.vehicleType, vehicle]
          return { ...s, vehicleType: updated }
        }
        return s
      }),
    )
  }

  const deleteService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  const submitServices = () => {
    console.log("Services:", services)
    alert("Services saved successfully!")
  }

  const vehicleOptions = ["Car", "Bike", "Heavy Vehicle"]

  return (
    <div className="flex flex-col min-h-screen">
      <OwnerNavBar />

      <div className="flex-grow bg-gray-50 pt-20 px-4 pb-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Services</h1>
              <p className="text-sm text-gray-500">Manage your wash services and pricing</p>
            </div>

            <button
              onClick={addService}
              className="flex items-center gap-2 
                         bg-[#D4AF37] text-white px-5 py-2 
                         rounded-lg font-semibold hover:opacity-90"
            >
              <Plus size={18} />
              Add Service
            </button>
          </div>

          {/* EMPTY STATE */}
          {services.length === 0 && (
            <div className="border-2 border-dashed rounded-xl p-10 text-center">
              <p className="text-gray-500">No services added yet</p>
            </div>
          )}

          {/* SERVICES LIST */}
          {services.length > 0 && (
            <div className="space-y-6">
              {services.map((service) => (
                <div key={service.id} className="border-2 rounded-xl p-5 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Service Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Service Name</label>
                      <input
                        placeholder="e.g., Express Wash"
                        value={service.name}
                        onChange={(e) => updateService(service.id, "name", e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Price</label>
                      <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-[#D4AF37]">
                        <span className="text-gray-500 mr-1">₹</span>
                        <input
                          type="number"
                          placeholder="150"
                          value={service.price}
                          onChange={(e) => updateService(service.id, "price", e.target.value)}
                          className="w-full outline-none"
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Duration</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="30"
                          value={service.durationValue}
                          onChange={(e) => updateService(service.id, "durationValue", e.target.value)}
                          className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        />
                        <select
                          value={service.durationUnit}
                          onChange={(e) => updateService(service.id, "durationUnit", e.target.value as "min" | "hr")}
                          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        >
                          <option value="min">min</option>
                          <option value="hr">hr</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Type Selection */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Available for Vehicle Types</label>
                    <div className="flex gap-3 flex-wrap">
                      {vehicleOptions.map((vehicle) => (
                        <label
                          key={vehicle}
                          className={`px-4 py-2 border-2 rounded-lg cursor-pointer transition-all ${
                            service.vehicleType.includes(vehicle)
                              ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                              : "bg-white border-gray-300 hover:border-[#D4AF37]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={service.vehicleType.includes(vehicle)}
                            onChange={() => toggleVehicleType(service.id, vehicle)}
                            className="hidden"
                          />
                          {vehicle}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteService(service.id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium"
                    >
                      <Trash2 size={18} />
                      Delete Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SAVE BUTTON */}
          {services.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={submitServices}
                className="flex items-center gap-2 
                           bg-[#D4AF37] text-white 
                           px-8 py-3 rounded-xl 
                           font-bold hover:bg-[#c9a635] transition-all shadow-lg"
              >
                <Save size={18} />
                Save All Services
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
        © {new Date().getFullYear()} Sparkle Car Wash. All rights reserved.
      </footer>
    </div>
  )
}
