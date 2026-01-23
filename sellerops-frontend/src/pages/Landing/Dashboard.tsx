import DashboardHeader from "../../components/dashboard/DashboardHeader";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="p-4">
        <p className="text-gray-600">
          Upload your sales data to get started.
        </p>
      </main>
    </div>
  );
}
