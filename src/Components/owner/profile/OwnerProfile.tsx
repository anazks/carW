import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Store,
  Clock,
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

  const [isEditing, setIsEditing] = useState(false);

  /* ================= HANDLERS ================= */
  const handleOwnerChange = (field: keyof OwnerInfo, value: string) => {
    setOwnerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  /* ================= UI ================= */
  return (
    <>
      <OwnerNavbar />

      <div className="min-h-screen bg-[#FFF4D6] pt-20 px-4 flex flex-col">
        {/* MAIN CONTENT */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-5 sm:p-6 flex-1 w-full">
          <h1 className="text-2xl font-bold text-gray-800">
            Shop Owner Profile
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Manage shop details & timing
          </p>

          {/* PROFILE INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <InfoRow
              icon={<User />}
              label="Owner Name"
              value={ownerInfo.name}
              editable={isEditing}
              onChange={(v) => handleOwnerChange("name", v)}
            />
            <InfoRow
              icon={<Store />}
              label="Shop Name"
              value={ownerInfo.shopName}
              editable={isEditing}
              onChange={(v) => handleOwnerChange("shopName", v)}
            />
            <InfoRow
              icon={<Phone />}
              label="Phone"
              value={ownerInfo.phone}
              editable={isEditing}
              onChange={(v) => handleOwnerChange("phone", v)}
            />
            <InfoRow
              icon={<Mail />}
              label="Email"
              value={ownerInfo.email}
              editable={isEditing}
              onChange={(v) => handleOwnerChange("email", v)}
            />
            <InfoRow
              icon={<MapPin />}
              label="Location"
              value={ownerInfo.location}
              editable={isEditing}
              onChange={(v) => handleOwnerChange("location", v)}
            />
          </div>

          {/* SHOP TIMING */}
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="text-[#D4AF37]" />
            Shop Timing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <TimingField
              label="Opening Time"
              type="time"
              value={ownerInfo.openTime}
              editable={isEditing}
              onChange={(v) => handleOwnerChange("openTime", v)}
            />
            <TimingField
              label="Closing Time"
              type="time"
              value={ownerInfo.closeTime}
              editable={isEditing}
              onChange={(v) => handleOwnerChange("closeTime", v)}
            />
            <TimingField
              label="Closed On"
              type="text"
              value={ownerInfo.closedOn}
              editable={isEditing}
              onChange={(v) => handleOwnerChange("closedOn", v)}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
            {!isEditing ? (
              <button
                className="w-full sm:w-auto px-5 py-3 sm:py-2 rounded-lg 
                           bg-[#D4AF37] text-black font-semibold 
                           hover:bg-[#c9a635] transition"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="w-full sm:w-auto px-5 py-3 sm:py-2 
                             border rounded-lg hover:bg-gray-100"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto px-5 py-3 sm:py-2 
                             bg-[#D4AF37] text-black font-semibold 
                             rounded-lg hover:bg-[#c9a635] transition"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-6 w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
          © {new Date().getFullYear()} Sparkle Car Wash. All rights reserved.
        </footer>
      </div>
    </>
  );
}

/* ================= REUSABLE COMPONENTS ================= */
function InfoRow({
  icon,
  label,
  value,
  editable,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 flex items-center gap-2">
        {icon} {label}
      </p>
      {editable ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      ) : (
        <p className="font-medium mt-1">{value}</p>
      )}
    </div>
  );
}

function TimingField({
  label,
  type,
  value,
  editable,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {editable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      ) : (
        <p className="font-medium mt-1">{value}</p>
      )}
    </div>
  );
}
