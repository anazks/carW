import { useRef } from 'react';
import { Clock, Star, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';

import car1 from '../../assets/images/car1.jpg';
import car2 from '../../assets/images/car2.jpg';
import car3 from '../../assets/images/car3.jpg';

export default function Card() {
  const carWashCenters = [
    {
      id: 1,
      name: "Mycarwash Downtown",
      rating: 4.8,
      reviews: 245,
      hours: "8:00 AM - 8:00 PM",
      distance: "2.3 km",
      price: "₹150 - ₹500",
      image: car1,
    },
    {
      id: 2,
      name: "Mycarwash Uptown",
      rating: 4.9,
      reviews: 312,
      hours: "7:00 AM - 9:00 PM",
      distance: "3.7 km",
      price: "₹200 - ₹750",
      image: car2,
    },
    {
      id: 3,
      name: "Mycarwash Westside",
      rating: 4.7,
      reviews: 189,
      hours: "8:00 AM - 7:00 PM",
      distance: "5.1 km",
      price: "₹120 - ₹400",
      image: car3,
    },
    {
      id: 4,
      name: "Mycarwash NorthWest",
      rating: 4.8,
      reviews: 245,
      hours: "8:00 AM - 6:00 PM",
      distance: "5.3 km",
      price: "₹350 - ₹800",
      image: car1,
    },
  ];

  const renderSection = (title: string) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      scrollRef.current?.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    };

    return (
      <div className="mb-14 relative">
        {/* TITLE */}
        <h2
          style={{ fontFamily: "'Bodoni Moda', serif" }}
          className="text-2xl font-bold text-gray-900 mb-5"
        >
          {title}
        </h2>

        {/* LEFT ARROW */}
<button
  onClick={() => scroll('left')}
  className="absolute left-0 top-1/2 -translate-y-1/2 z-20
             bg-white shadow-md rounded-full p-2
             hover:bg-[#FFF8DC]"
>
  <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
</button>


        {/* CARD LIST */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-10
                     [&::-webkit-scrollbar]:hidden scroll-smooth"
        >
          {carWashCenters.map((center) => (
            <div
              key={center.id}
              className="min-w-[280px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative h-40">
                <img
                  src={center.image}
                  alt={center.name}
                  className="w-full h-full object-cover"
                />

                {/* Distance */}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                  <Navigation className="w-3 h-3" />
                  {center.distance}
                </div>

                {/* Rating */}
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{center.rating}</span>
                  <span className="text-gray-500">({center.reviews})</span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-grow">
                <h3
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                  className="text-base font-bold text-gray-900 mb-2"
                >
                  {center.name}
                </h3>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">
                    {center.hours}
                  </span>
                </div>

                {/* PRICE + BUTTON */}
                <div className="mt-auto flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-xs text-gray-500">Price Range</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {center.price}
                    </p>
                  </div>

                  <button className="px-3 py-1.5 text-xs font-semibold bg-black text-white rounded-md hover:bg-gray-800">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT ARROW */}
<button
  onClick={() => scroll('right')}
  className="absolute right-0 top-1/2 -translate-y-1/2 z-20
             bg-white shadow-md rounded-full p-2
             hover:bg-[#FFF8DC]"
>
  <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
</button>

      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {renderSection("Near You")}
        {renderSection("Most Popular")}
        {renderSection("Suggested")}
      </div>
    </div>
  );
}
