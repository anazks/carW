import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", earnings: 4000 },
  { day: "Tue", earnings: 3000 },
  { day: "Wed", earnings: 5000 },
  { day: "Thu", earnings: 4000 },
  { day: "Fri", earnings: 6000 },
  { day: "Sat", earnings: 7000 },
];

export default function EarningsChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="earnings" stroke="#D4AF37" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}
