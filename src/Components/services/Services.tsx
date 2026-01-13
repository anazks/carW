import { useState } from "react";
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
  // … keep the rest of your services here
];

export default function Services() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const vehicleCategories: string[] = ["All", "Car", "Bike", "Heavy Vehicle"];

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle) {
      case "Car":
        return <Car size={16} />;
      case "Bike":
        return <Bike size={16} />;
      case "Heavy Vehicle":
        return <Truck size={16} />;
      default:
        return null;
    }
  };

  const filteredServices: Service[] = SERVICE_DATA.filter((service) => {
    const matchesVehicle =
      selectedVehicle === "All" || service.vehicleTypes.includes(selectedVehicle);
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVehicle && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD975] to-[#E6C200] text-white py-12 px-4">        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Our Services</h1>
          <p className="text-lg opacity-90">
            Premium car wash services for every vehicle type
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>

          {/* Vehicle Type Filter */}
          <div className="flex gap-3 flex-wrap">
            {vehicleCategories.map((vehicle: string) => (
              <button
                key={vehicle}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  selectedVehicle === vehicle
                    ? "bg-[#D4AF37] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#D4AF37]"
                }`}
              >
                {vehicle}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No services found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service: Service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {service.popular && (
                  <div className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 inline-block">
                    POPULAR
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Price and Duration */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign size={16} className="text-[#D4AF37]" />
                      <span className="font-semibold">{service.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-[#D4AF37]" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                  </div>

                  {/* Vehicle Types */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Available for:</p>
                    <div className="flex gap-2 flex-wrap">
                      {service.vehicleTypes.map((vehicle: string) => (
                        <span
                          key={vehicle}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {getVehicleIcon(vehicle)}
                          {vehicle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Book Button */}
                  <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Book Now
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