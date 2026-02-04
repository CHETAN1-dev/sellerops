
import UploadCsv from "../../components/ui/UploadCsv";
import StatCard from "../Analytics/StatCard";

export default function Dashboard() {
    const summary = {
    revenue: 123456,
    orders: 2823,
    units: 13450,
    countries: 12,
  };
  return (
    <div className="min-h-screen bg-gray-50">
        <main className="p-4">
        <p className="text-gray-600">
          Upload your sales data to get started.
        </p>
        <UploadCsv />
      </main>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${summary.revenue}`} />
        <StatCard title="Total Orders" value={summary.orders} />
        <StatCard title="Units Sold" value={summary.units} />
        <StatCard title="Countries" value={summary.countries} />
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <button
          onClick={() => window.location.href = "/analytics"}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          View Detailed Analytics →
        </button>
      </div>
    </div>
  );
}
