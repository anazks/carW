"use client"

import { useState } from "react"
import { Plus, Trash2, Save, Clock, Minus, Users, CheckCircle } from "lucide-react"
import OwnerNavBar from "../Layout/OwnerNavBar"

interface TimeSlot {
  id: number
  startTime: string
  endTime: string
  availableSlots: number
  isActive: boolean
}

export default function OwnerTimeSlots() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [saved, setSaved] = useState(false)

  const addTimeSlot = () => {
    setTimeSlots((prev) => [
      ...prev,
      {
        id: Date.now(),
        startTime: "09:00",
        endTime: "10:00",
        availableSlots: 1,
        isActive: true,
      },
    ])
    setSaved(false)
  }

  const updateTimeSlot = (
    id: number,
    field: keyof TimeSlot,
    value: string | number | boolean
  ) => {
    setTimeSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    )
    setSaved(false)
  }

  const deleteTimeSlot = (id: number) => {
    setTimeSlots((prev) => prev.filter((slot) => slot.id !== id))
    setSaved(false)
  }

  const submitTimeSlots = () => {
    console.log("Time Slots:", timeSlots)
    setSaved(true) // non-blocking success banner
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <OwnerNavBar />

      <div className="flex-grow bg-gray-50 pt-20 px-4 pb-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Time Slots</h1>
              <p className="text-sm text-gray-500">
                Manage your available time slots and capacity for bookings
              </p>
            </div>

            <button
              onClick={addTimeSlot}
              className="flex items-center gap-2 bg-[#D4AF37] text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              <Plus size={18} />
              Add Time Slot
            </button>
          </div>

          {/* INFO BANNER */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Users className="text-blue-500 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Available Slots per Time
                </p>
                <p className="text-sm text-blue-600">
                  Set how many simultaneous bookings can be made for each time
                  slot. Users will see the remaining availability when booking.
                </p>
              </div>
            </div>
          </div>

          {/* SUCCESS BANNER */}
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-700 font-medium">
                Time slots saved successfully!
              </span>
            </div>
          )}

          {/* EMPTY STATE */}
          {timeSlots.length === 0 && (
            <div className="border-2 border-dashed rounded-xl p-10 text-center">
              <Clock className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="text-gray-500 mb-2">No time slots added yet</p>
              <p className="text-sm text-gray-400">
                Add time slots to define when customers can book your services
              </p>
            </div>
          )}

          {/* TIME SLOTS LIST */}
          {timeSlots.length > 0 && (
            <div className="space-y-4">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`border-2 rounded-xl p-5 transition-all ${
                    slot.isActive
                      ? "bg-gray-50 border-gray-200"
                      : "bg-gray-100 border-gray-300 opacity-60"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    {/* Start Time */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateTimeSlot(slot.id, "startTime", e.target.value)
                        }
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateTimeSlot(slot.id, "endTime", e.target.value)
                        }
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>

                    {/* Available Slots */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Available Slots
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = Math.max(1, slot.availableSlots - 1)
                            updateTimeSlot(slot.id, "availableSlots", newValue)
                          }}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100"
                        >
                          <Minus size={18} />
                        </button>
                        <div className="flex-1 text-center">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={slot.availableSlots}
                            onChange={(e) => {
                              const val = e.target.value
                              updateTimeSlot(
                                slot.id,
                                "availableSlots",
                                val === ""
                                  ? 1
                                  : Math.max(
                                      1,
                                      Math.min(99, Number.parseInt(val))
                                    )
                              )
                            }}
                            className="w-full text-center border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = Math.min(99, slot.availableSlots + 1)
                            updateTimeSlot(slot.id, "availableSlots", newValue)
                          }}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Active Toggle & Delete */}
                    <div className="flex items-center gap-3 justify-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slot.isActive}
                          onChange={(e) =>
                            updateTimeSlot(slot.id, "isActive", e.target.checked)
                          }
                          className="w-5 h-5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Active
                        </span>
                      </label>

                      <button
                        onClick={() => deleteTimeSlot(slot.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Slot Preview */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </span>
                      <span className="mx-2">•</span>
                      <Users size={16} />
                      <span className="font-medium text-[#D4AF37]">
                        {slot.availableSlots} {slot.availableSlots === 1 ? "slot" : "slots"} available
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SAVE BUTTON */}
          {timeSlots.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={submitTimeSlots}
                className="flex items-center gap-2 bg-[#D4AF37] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#c9a635] transition-all shadow-lg"
              >
                <Save size={18} />
                Save Time Slots
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