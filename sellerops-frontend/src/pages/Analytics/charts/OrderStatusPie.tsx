/* eslint-disable @typescript-eslint/no-explicit-any */
// components/charts/OrderStatusPie.tsx
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export default function OrderStatusPie({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-4">Order Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="order_status" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
