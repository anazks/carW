import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Store,
  Clock,
  Trash2,
  Plus,
} from "lucide-react";
import OwnerNavbar from "../Layout/OwnerNavBar";

/* ================= TYPES ================= */
interface OwnerInfo {
  name: string;
  shopName: string;
  phone: string;
  email: string;
  location: string;
  openTime: string;
  closeTime: string;
  closedOn: string;
}

interface Service {
  id: number;
  name: string;
  price: string;
  durationValue: string;
  durationUnit: "min" | "hr";
}

/* ================= COMPONENT ================= */
export default function OwnerProfile() {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    name: "Rahul Kumar",
    shopName: "Sparkle Car Wash",
    phone: "+91 98765 43210",
    email: "owner@sparklewash.com",
    location: "Kochi, Kerala",
    openTime: "09:00",
    closeTime: "19:00",
    closedOn: "Sunday",
  });

  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Basic Wash", price: "300", durationValue: "30", durationUnit: "min" },
    { id: 2, name: "Premium Wash", price: "600", durationValue: "1", durationUnit: "hr" },
  ]);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  /* ================= HANDLERS ================= */
  const handleOwnerChange = (field: keyof OwnerInfo, value: string) => {
    setOwnerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateService = (id: number, field: keyof Service, value: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addService = () => {
    setServices((prev) => [
      ...prev,
      { id: Date.now(), name: "", price: "", durationValue: "", durationUnit: "min" },
    ]);
  };

  const deleteService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile & services updated successfully!");
    // 🔗 API call can go here
  };

  /* ================= UI ================= */
  return (
    <>
      <OwnerNavbar />

      <div className="min-h-screen bg-gray-50 pt-20 px-4 flex flex-col">
        {/* MAIN CONTENT */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 flex-1">
          {/* HEADER */}
          <h1 className="text-2xl font-bold text-gray-800">Shop Owner Profile</h1>
          <p className="text-sm text-gray-500 mb-6">Manage shop details, timing & services</p>

          {/* PROFILE INFO */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <InfoRow icon={<User />} label="Owner Name" value={ownerInfo.name} editable={isEditing} onChange={(v) => handleOwnerChange("name", v)} />
            <InfoRow icon={<Store />} label="Shop Name" value={ownerInfo.shopName} editable={isEditing} onChange={(v) => handleOwnerChange("shopName", v)} />
            <InfoRow icon={<Phone />} label="Phone" value={ownerInfo.phone} editable={isEditing} onChange={(v) => handleOwnerChange("phone", v)} />
            <InfoRow icon={<Mail />} label="Email" value={ownerInfo.email} editable={isEditing} onChange={(v) => handleOwnerChange("email", v)} />
            <InfoRow icon={<MapPin />} label="Location" value={ownerInfo.location} editable={isEditing} onChange={(v) => handleOwnerChange("location", v)} />
          </div>

          {/* SHOP TIMING */}
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="text-[#D4AF37]" /> Shop Timing
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <TimingField label="Opening Time" type="time" value={ownerInfo.openTime} editable={isEditing} onChange={(v) => handleOwnerChange("openTime", v)} />
            <TimingField label="Closing Time" type="time" value={ownerInfo.closeTime} editable={isEditing} onChange={(v) => handleOwnerChange("closeTime", v)} />
            <TimingField label="Closed On" type="text" value={ownerInfo.closedOn} editable={isEditing} onChange={(v) => handleOwnerChange("closedOn", v)} />
          </div>

          {/* SERVICES */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Services Offered</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  <input
                    placeholder="Service name"
                    value={service.name}
                    disabled={!isEditing}
                    onChange={(e) => updateService(service.id, "name", e.target.value)}
                    className="border p-2 rounded"
                  />
                  <div className="flex items-center border rounded p-2">
                    <span className="text-gray-500 mr-1">₹</span>
                    <input
                      type="number"
                      value={service.price}
                      disabled={!isEditing}
                      onChange={(e) => updateService(service.id, "price", e.target.value)}
                      className="w-full outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={service.durationValue}
                      disabled={!isEditing}
                      onChange={(e) => updateService(service.id, "durationValue", e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                    <select
                      value={service.durationUnit}
                      disabled={!isEditing}
                      onChange={(e) => updateService(service.id, "durationUnit", e.target.value as "min" | "hr")}
                      className="border p-2 rounded"
                    >
                      <option value="min">min</option>
                      <option value="hr">hr</option>
                    </select>
                  </div>
                  {isEditing && (
                    <button onClick={() => deleteService(service.id)} className="text-red-500 flex justify-center">
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <button onClick={addService} className="mt-4 flex items-center gap-2 text-[#D4AF37]">
                <Plus /> Add Service
              </button>
            )}
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex justify-end gap-3">
            {!isEditing ? (
              <button className="border px-4 py-2 rounded-lg" onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
              <>
                <button className="border px-4 py-2 rounded-lg" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg" onClick={handleSave}>Save Changes</button>
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-4 w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
          © {new Date().getFullYear()} MyCarWash. All rights reserved.
        </footer>
      </div>
    </>
  );
}

/* ================= REUSABLE COMPONENTS ================= */
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
}

function InfoRow({ icon, label, value, editable, onChange }: InfoRowProps) {
  return (
    <div>
      <p className="text-sm text-gray-500 flex items-center gap-2">{icon} {label}</p>
      {editable ? (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border p-2 rounded mt-1" />
      ) : (
        <p className="font-medium mt-1">{value}</p>
      )}
    </div>
  );
}

interface TimingFieldProps {
  label: string;
  type: string;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
}

function TimingField({ label, type, value, editable, onChange }: TimingFieldProps) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {editable ? (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border p-2 rounded mt-1" />
      ) : (
        <p className="font-medium mt-1">{value}</p>
      )}
    </div>
  );
}
