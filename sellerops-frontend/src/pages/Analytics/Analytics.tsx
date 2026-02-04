import RevenueByCategory from "./charts/RevenueByCategory";
import RevenueOverTime from "./charts/RevenueOverTime";
import RevenueByCountry from "./charts/RevenueByCountry";
import OrderStatusPie from "./charts/OrderStatusPie";
import ChartSlide from "./ChartSlide";
export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Analytics</h1>

      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory">
        
        <ChartSlide title="Revenue by Category">
          <RevenueByCategory data={[]} />
        </ChartSlide>

        <ChartSlide title="Revenue Over Time">
          <RevenueOverTime data={[]} />
        </ChartSlide>

        <ChartSlide title="Revenue by Country">
          <RevenueByCountry data={[]} />
        </ChartSlide>

        <ChartSlide title="Order Status">
          <OrderStatusPie data={[]} />
        </ChartSlide>

      </div>
    </div>
  );
}
