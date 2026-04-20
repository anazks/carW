import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type ChartData = {
  day: string;
  earnings: number;
};

export default function EarningsChart({ data }: { data: ChartData[] }) {
  // Use generic fallback data if empty array is passed accidentally
  const defaultData = [
    { day: "Mon", earnings: 0 },
    { day: "Tue", earnings: 0 },
    { day: "Wed", earnings: 0 },
    { day: "Thu", earnings: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="earnings" stroke="#D4AF37" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}
