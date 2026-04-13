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
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8DC] to-[#FFF1B5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#b69530] bg-clip-text text-transparent"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Our Services
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Premium care for your valued vehicle
            </p>
          </div>
          
          {/* SEARCH */}
          <div className="relative w-full md:w-96">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
            />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] transition-all"
            />
          </div>
        </div>

        {/* VEHICLE FILTER */}
        <div className="flex flex-wrap gap-3 mb-10">
          {vehicleCategories.map((vehicle) => (
            <button
              key={vehicle}
              onClick={() => setSelectedVehicle(vehicle)}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                selectedVehicle === vehicle
                  ? "bg-[#D4AF37] text-white shadow-lg scale-105"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-[#FFF8DC] border border-transparent hover:border-[#D4AF37]"
              }`}
            >
              {vehicle}
            </button>
          ))}
        </div>

        {/* SERVICES GRID */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[#D4AF37]/30">
            <Search size={48} className="mx-auto text-[#D4AF37]/50 mb-4" />
            <p className="text-xl text-gray-500 font-medium">
              No services found matching your criteria
            </p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedVehicle("All")}}
              className="mt-4 text-[#D4AF37] font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col overflow-hidden border border-gray-100"
                onClick={() => handleServiceClick(service.name)}
              >
                <div className="relative">
                  {service.popular && (
                    <div className="absolute top-4 right-0 bg-gradient-to-l from-[#D4AF37] to-[#b69530] text-white text-[10px] font-black px-4 py-1.5 rounded-l-full shadow-md z-10 tracking-widest">
                      POPULAR
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col h-full relative">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#D4AF37] transition-colors" 
                      style={{ fontFamily: "'Bodoni Moda', serif" }}>
                    {service.name}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* PRICE & DURATION */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-[#FFF8DC]/50 rounded-2xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <DollarSign size={18} className="text-[#D4AF37]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Price</span>
                        <span className="font-bold text-gray-800">{service.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-[#FFF8DC]/50 rounded-2xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Clock size={18} className="text-[#D4AF37]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Time</span>
                        <span className="font-bold text-gray-800">{service.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* VEHICLE TYPES */}
                  <div className="flex gap-2 flex-wrap mb-8">
                    {service.vehicleTypes.map((vehicle) => (
                      <span
                        key={vehicle}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-[10px] font-bold text-gray-600 border border-gray-100 group-hover:border-[#D4AF37]/30 transition-colors"
                      >
                        {getVehicleIcon(vehicle)}
                        {vehicle.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* BUTTON */}
                  <button
                    className="mt-auto w-full bg-gradient-to-r from-[#D4AF37] to-[#b69530] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Explore Centers
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
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
