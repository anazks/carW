import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Store,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Crown,
  Image as ImageIcon,
} from "lucide-react";
import OwnerNavbar from "../Layout/OwnerNavBar";
import { getProfileShop, getmyshops } from '../../../Api/Service'; // Added: Import updateShopProfile (assume it exists)

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

interface Shop {
  _id: string;
  shopName: string;
  city: string;
  exactLocation: string;
  exactLocationCoord: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  isPremium: boolean;
  mobile: number | string;
  profileImage: string;
  shopOwnerId: string;
  timing: string;
  createdAt: string;
  media: any[];
  updatedAt: string;
  website: string;
  __v: number;
}

/* ================= COMPONENT ================= */
export default function OwnerProfile() {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    name: "",
    shopName: "",
    phone: "",
    email: "",
    location: "",
    openTime: "09:00",
    closeTime: "19:00",
    closedOn: "Sunday",
  });

  const [shop, setShop] = useState<Shop | null>(null); // State for single shop object

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // For initial fetch
  const [saveLoading, setSaveLoading] = useState(false); // For save action
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchOwnerProfile();
    getmyshopsfn();
  }, []);

  const getmyshopsfn = async () => {
    try {
      const res = await getmyshops(); 
      console.log("My Shops Data-----------------------: ", res);
      
      if (res.success) {
        console.log("My Shop Object:**** ", res.data);
        setShop(res.data); // Set single shop object
        // Optionally, set default shopName from shop
        if (res.data && !ownerInfo.shopName) {
          setOwnerInfo(prev => ({ ...prev, shopName: res.data.shopName || '' }));
        }
      } else {
        setError(res.message || "Failed to fetch shop");
      }
    } catch (error: any) {
      console.error('Error fetching my shop:', error);
      setError(error.message || "An error occurred while fetching shop");
    }
  };

  const fetchOwnerProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await getProfileShop();
      console.log("Shop Profile API Response:---------", response);

      if (response.success) {
        const data = response.data; // Assume response.data contains the fields
        setOwnerInfo({
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || "", // Map firstName + lastName to name
          shopName: data.shopName || "", // If shopName exists; otherwise empty (will use from shops if available)
          phone: data.mobileNo || "", // Map mobileNo to phone
          email: data.email || "",
          location: data.city || "", // Map city to location
          openTime: data.openTime || "09:00", // Defaults if not in response
          closeTime: data.closeTime || "19:00",
          closedOn: data.closedOn || "Sunday",
        });
      } else {
        setError(response.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      console.error("Error fetching shop profile:", err);
      setError(err.message || "An error occurred while fetching profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleOwnerChange = (field: keyof OwnerInfo, value: string) => {
    setOwnerInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error/success on change
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSave = async () => {
    // Basic validation
    if (!ownerInfo.name || !ownerInfo.shopName || !ownerInfo.phone || !ownerInfo.email || !ownerInfo.location) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaveLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = { ...ownerInfo }; // Send all fields
      const response = await updateShopProfile(payload);
      console.log("Update Shop Profile Response:", response);

      if (response.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        // Optionally refetch to confirm
        await fetchOwnerProfile();
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Error updating shop profile:", err);
      setError(err.message || "An error occurred while updating profile");
    } finally {
      setSaveLoading(false);
    }
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <>
        <OwnerNavbar />
        <div className="min-h-screen bg-[#FFF4D6] pt-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

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

          {/* ERROR/SUCCESS MESSAGES */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} />
              {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:opacity-80">×</button>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle size={16} />
              {success}
              <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:opacity-80">×</button>
            </div>
          )}

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

          {/* MY SHOP SECTION - INTEGRATED: Full details from provided data */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Store className="text-[#D4AF37]" />
              My Shop
            </h2>
            {shop ? (
              <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                {/* Profile Image */}
                {shop.profileImage ? (
                  <img 
                    src={shop.ProfileImage} 
                    alt={shop.shopName}
                    className="w-full h-48 md:h-64 object-cover rounded-lg mb-3"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide if broken
                  />
                ) : (
                  <div className="w-full h-48 md:h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Shop Name */}
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">{shop.ShopName}</h3>
                
                {/* Location */}
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <MapPin size={14} /> {shop.City}, {shop.exactLocation}
                </p>
                
                {/* Coordinates (Optional: Show if needed) */}
                {shop.exactLocationCoord && (
                  <p className="text-xs text-gray-500 mb-1">
                    Coords: [{shop.exactLocationCoord.coordinates[1].toFixed(4)}, {shop.exactLocationCoord.coordinates[0].toFixed(4)}]
                  </p>
                )}
                
                {/* Timing */}
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Clock size={14} /> {shop.Timing}
                </p>
                
                {/* Website */}
                {shop.website && (
                  <p className="text-sm text-blue-600 mb-1 truncate">
                    <a href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`} 
                       target="_blank" rel="noopener noreferrer" 
                       className="hover:underline">
                      {shop.website}
                    </a>
                  </p>
                )}
                
                {/* Mobile */}
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Phone size={14} /> {shop.Mobile}
                </p>
                
                {/* Premium Badge */}
                {shop.isPremium && (
                  <div className="flex items-center gap-1 text-xs text-yellow-600 mb-2">
                    <Crown size={12} /> Premium
                  </div>
                )}
                
                {/* Created Date */}
                <p className="text-xs text-gray-500">
                  Created: {new Date(shop.createdAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                  })}
                </p>
                
                {/* Updated Date */}
                <p className="text-xs text-gray-500">
                  Updated: {new Date(shop.updatedAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                  })}
                </p>
                
                {/* Media Count */}
                {shop.media && shop.media.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {shop.media.length} media items
                  </p>
                )}
                
                {/* Shop ID & Version (Optional: For dev/debug) */}
                <p className="text-xs text-gray-400 mt-2">
                  ID: {shop._id} | v{shop.__v}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shop found. Add your first shop to get started.</p>
            )}
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
                  onClick={() => {
                    setIsEditing(false);
                    fetchOwnerProfile(); // Reload original data on cancel
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={saveLoading}
                  className="w-full sm:w-auto px-5 py-3 sm:py-2 
                             bg-[#D4AF37] text-black font-semibold 
                             rounded-lg hover:bg-[#c9a635] transition disabled:opacity-50"
                  onClick={handleSave}
                >
                  {saveLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
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
          className="w-full border p-2 rounded mt-1 text-sm"
        />
      ) : (
        <p className="font-medium mt-1 text-sm">{value || "Not specified"}</p>
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
          className="w-full border p-2 rounded mt-1 text-sm"
        />
      ) : (
        <p className="font-medium mt-1 text-sm">{value}</p>
      )}
    </div>
  );
}