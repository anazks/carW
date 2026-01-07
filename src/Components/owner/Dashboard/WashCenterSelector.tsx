import { useState } from "react";

const centers = ["Downtown", "Uptown", "Westside", "NorthWest"];

export default function WashCenterSelector() {
  const [selected, setSelected] = useState(centers[0]);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center gap-4">
      <label className="font-medium text-gray-700">Select Center:</label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border p-2 rounded focus:ring-2 focus:ring-[#D4AF37] outline-none"
      >
        {centers.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
