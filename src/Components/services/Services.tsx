import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, DollarSign, Car, Bike, Truck, Search } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: string;
  vehicleTypes: string[];
  popular?: boolean;
}

const SERVICE_DATA: Service[] = [
  {
    id: 1,
    name: "Express Wash",
    description: "Quick exterior wash with premium soap and shine",
    price: "₹150 - ₹350",
    duration: "20-30 min",
    vehicleTypes: ["Car", "Bike", "Heavy Vehicle"],
    popular: true,
  },
  {
    id: 2,
    name: "Full Detail",
    description: "Complete interior and exterior deep cleaning",
    price: "₹400 - ₹800",
    duration: "60-90 min",
    vehicleTypes: ["Car", "Heavy Vehicle"],
    popular: true,
  },
  {
    id: 3,
    name: "Interior Cleaning",
    description: "Deep interior vacuum and dashboard polish",
    price: "₹250 - ₹500",
    duration: "40-60 min",
    vehicleTypes: ["Car"],
  },
];

export default function Services() {
  const navigate = useNavigate();

  const [selectedVehicle, setSelectedVehicle] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const vehicleCategories = ["All", "Car", "Bike", "Heavy Vehicle"];

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle) {
      case "Car":
        return <Car size={14} />;
      case "Bike":
        return <Bike size={14} />;
      case "Heavy Vehicle":
        return <Truck size={14} />;
      default:
        return null;
    }
  };

  const filteredServices = SERVICE_DATA.filter((service) => {
    const matchesVehicle =
      selectedVehicle === "All" ||
      service.vehicleTypes.includes(selectedVehicle);

    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesVehicle && matchesSearch;
  });

  const handleServiceClick = (serviceName: string) => {
    const slug = serviceName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/services/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#FFD975] to-[#E6C200] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Our Services</h1>
          <p className="text-lg opacity-90">
            Premium car wash services for every vehicle
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* SEARCH & FILTER */}
        <div className="mb-8 space-y-4">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* VEHICLE FILTER */}
          <div className="flex flex-wrap gap-3">
            {vehicleCategories.map((vehicle) => (
              <button
                key={vehicle}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`px-5 py-2 rounded-lg font-medium transition ${
                  selectedVehicle === vehicle
                    ? "bg-[#D4AF37] text-white"
                    : "bg-white border text-gray-700 hover:border-[#D4AF37]"
                }`}
              >
                {vehicle}
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES GRID */}
        {filteredServices.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            No services found
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer flex flex-col"
                onClick={() => handleServiceClick(service.name)}
              >
                {service.popular && (
                  <div className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 inline-block">
                    POPULAR
                  </div>
                )}

                <div className="p-5 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2">
                    {service.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 min-h-[48px]">
                    {service.description}
                  </p>

                  {/* PRICE & DURATION */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-[#D4AF37]" />
                      <span className="font-semibold">{service.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#D4AF37]" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                  </div>

                  {/* VEHICLE TYPES */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {service.vehicleTypes.map((vehicle) => (
                      <span
                        key={vehicle}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs"
                      >
                        {getVehicleIcon(vehicle)}
                        {vehicle}
                      </span>
                    ))}
                  </div>

                  {/* BUTTON */}
                  <button
                    className="mt-auto w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2 rounded-lg font-semibold"
                  >
                    View Centers
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
