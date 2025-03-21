import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface Order {
  total: string;
  createdAt: string;
}

interface OverviewProps {
  data: Order[];
}

export function Overview({ data }: OverviewProps) {
  const chartData = data.reduce((acc: any[], order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const existingDay = acc.find(item => item.name === date);
    if (existingDay) {
      existingDay.total += parseFloat(order.total || "0");
    } else {
      acc.push({ name: date, total: parseFloat(order.total || "0") });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}