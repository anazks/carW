import { useState, useEffect, useRef } from "react";
import { Check, AlertCircle, Plus, Trash2 } from "lucide-react";
import { addnewShop } from '../../../Api/Service';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/UserContext"; // Assuming shared auth context
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'; // Add: npm install react-leaflet leaflet
import 'leaflet/dist/leaflet.css'; // Add to your CSS or import in main file
import NavBar from "../../NavBar/NavBar";
import OwnerNavBar from "../Layout/OwnerNavBar";

// Type for media item
interface MediaItem {
  url: string;
  title: string;
  description?: string;
}

export default function AddShop() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current shop owner for ShopOwnerId

  // Form states
  const [profileImage, setProfileImage] = useState<string>("");
  const [shopName, setShopName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [exactLocation, setExactLocation] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(10.0123); // Default Kochi lat
  const [longitude, setLongitude] = useState<number>(76.2123); // Default Kochi lng
  const [mobile, setMobile] = useState<string>(""); // String for input, convert to Number
  const [timing, setTiming] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [media, setMedia] = useState<MediaItem[]>([]); // Dynamic media array
  const [isPremium, setIsPremium] = useState<boolean>(false); // Default false
  const [premiumStartDate, setPremiumStartDate] = useState<string>(""); // Optional
  const [premiumEndDate, setPremiumEndDate] = useState<string>(""); // Optional

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Add new media item
  const addMedia = () => {
    setMedia([...media, { url: "", title: "", description: "" }]);
  };

  // Update media item
  const updateMedia = (index: number, field: keyof MediaItem, value: string) => {
    const updated = [...media];
    updated[index] = { ...updated[index], [field]: value };
    setMedia(updated);
  };

  // Remove media item
  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  // Leaflet click handler component
  function LocationMarker() {
    useMapEvents({
      click: (e) => {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        console.log(`Selected: Lat ${e.latlng.lat}, Lng ${e.latlng.lng}`); // For debugging
      },
    });
    return latitude && longitude ? <Marker position={[latitude, longitude]} /> : null;
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!shopName || !city || !exactLocation || !mobile || !timing || !website) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      setError("Mobile must be a valid 10-digit number.");
      return;
    }
    if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(website)) {
      setError("Please enter a valid website URL.");
      return;
    }
    if (media.some(m => !m.url || !m.title)) {
      setError("All media items must have URL and title.");
      return;
    }
    if (isPremium && (!premiumStartDate || !premiumEndDate)) {
      setError("Premium dates are required if premium is enabled.");
      return;
    }
    // if (!user?._id) {
    //   setError("User authentication required. Please log in.");
    //   return;
    // }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const shopData = {
        ProfileImage: profileImage || undefined,
        ShopName: shopName.trim(),
        City: city.trim(),
        ExactLocation: exactLocation.trim(),
        ExactLocationCoord: {
          type: "Point",
          coordinates: [longitude, latitude], // Always include selected coords
        },
        Mobile: Number(mobile),
        Timing: timing.trim(),
        website: website.trim(),
        media: media.length > 0 ? media : undefined,
        ShopOwnerId: user._id, // From auth context
        IsPremium: isPremium,
        ...(isPremium && {
          PremiumStartDate: new Date(premiumStartDate),
          PremiumEndDate: new Date(premiumEndDate),
        }),
      };
      console.log("Submitting shop data:", shopData); // For debugging

      const response = await addnewShop(shopData);
      console.log("Shop added successfully:", response); // For debugging

      // Assuming success response; adjust based on API
      if (response.success) { // Or response.status === 201, etc.
        setSuccess("Shop added successfully! Redirecting...");
        setTimeout(() => {
          navigate("/owner-dashboard"); // Adjust redirect path
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to add shop.");
      }
    } catch (err: any) {
      console.error("Add Shop error:", err);
      setError(err.message || "Failed to add shop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProfileImage("");
    setShopName("");
    setCity("");
    setExactLocation("");
    setLatitude(10.0123); // Reset to default
    setLongitude(76.2123);
    setMobile("");
    setTiming("");
    setWebsite("");
    setMedia([]);
    setIsPremium(false);
    setPremiumStartDate("");
    setPremiumEndDate("");
    setError("");
    setSuccess("");
  };

  return (
   <>
   <OwnerNavBar/>
    <div className="min-h-screen w-full bg-[#FFF9E8] font-[Bodoni_Moda] relative flex flex-col">
      {/* MAIN CONTENT */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-[#F1E3B3] p-6 overflow-y-auto max-h-[90vh]">
          {/* BRAND */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-white text-lg font-bold shadow">
              SC
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-3">
              Add New Shop
            </h2>
            <p className="text-xs text-gray-500">
              Register your Sparkle Car Wash location
            </p>
          </div>

          <div className="space-y-4">
            {/* PROFILE IMAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL (Optional)
              </label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/profile.jpg"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* SHOP NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Sparkle Wash Kochi"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* CITY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kochi"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* EXACT LOCATION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exact Location *
              </label>
              <input
                type="text"
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
                placeholder="MG Road, Near Lulu Mall"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* OPENSTREETMAP FOR COORDINATES SELECTION (Free, No API Key) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Location on Map (Click to set coordinates)
              </label>
              <MapContainer
                center={[latitude, longitude]}
                zoom={12}
                style={{ height: '256px', width: '100%', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
              {latitude && longitude && (
                <p className="text-xs text-green-600 mt-1">
                  Selected: Lat {latitude.toFixed(6)}, Lng {longitude.toFixed(6)}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Click on the map to select your shop location. Coordinates will auto-fill.
              </p>
            </div>

            {/* MOBILE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="1234567890"
                maxLength={10}
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* TIMING */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating Hours *
              </label>
              <input
                type="text"
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                placeholder="9:00 AM - 6:00 PM"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* WEBSITE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL *
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://sparklewash.com/kochi"
                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                style={{ backgroundColor: "#FFF4D6" }}
              />
            </div>

            {/* MEDIA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Gallery (Optional)
              </label>
              {media.map((item, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-3 mb-3 bg-gray-50">
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => updateMedia(index, "url", e.target.value)}
                      placeholder="Media URL"
                      className="w-full px-3 py-1 rounded border border-gray-300 text-sm"
                      style={{ backgroundColor: "#FFF4D6" }}
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateMedia(index, "title", e.target.value)}
                      placeholder="Title/Caption"
                      className="w-full px-3 py-1 rounded border border-gray-300 text-sm"
                      style={{ backgroundColor: "#FFF4D6" }}
                    />
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => updateMedia(index, "description", e.target.value)}
                      placeholder="Description (Optional)"
                      className="w-full px-3 py-1 rounded border border-gray-300 text-sm"
                      style={{ backgroundColor: "#FFF4D6" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="mt-2 flex items-center text-red-500 text-sm gap-1 hover:opacity-80"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMedia}
                className="flex items-center text-[#D4AF37] text-sm gap-1 hover:opacity-80"
              >
                <Plus className="w-4 h-4" />
                Add Media Item
              </button>
            </div>

            {/* PREMIUM */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPremium"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                Enable Premium Listing
              </label>
            </div>

            {/* PREMIUM DATES (Conditional) */}
            {isPremium && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Premium Start Date
                  </label>
                  <input
                    type="date"
                    value={premiumStartDate}
                    onChange={(e) => setPremiumStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                    style={{ backgroundColor: "#FFF4D6" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Premium End Date
                  </label>
                  <input
                    type="date"
                    value={premiumEndDate}
                    onChange={(e) => setPremiumEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] border border-gray-300"
                    style={{ backgroundColor: "#FFF4D6" }}
                  />
                </div>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-red-500 text-sm text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="text-green-600 text-sm text-center flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                {success}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading || !shopName || !city || !exactLocation || !mobile || !timing || !website}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Adding Shop..." : (
                <>
                  <Check className="w-5 h-5" />
                  Add Shop
                </>
              )}
            </button>

            {/* LINK BACK */}
            <div className="text-center">
              <button
                onClick={() => navigate("/owner-dashboard")}
                className="text-[#D4AF37] font-medium text-xs underline hover:opacity-80"
              >
                Back to Dashboard
              </button>
            </div>

            {/* RESET BUTTON */}
            <button
              onClick={resetForm}
              className="w-full text-gray-500 font-medium text-xs text-center underline hover:opacity-80"
            >
              Reset Form
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
        © {new Date().getFullYear()} Sparkle Car Wash. All rights reserved.
      </footer>
    </div>
   </>
  );
}