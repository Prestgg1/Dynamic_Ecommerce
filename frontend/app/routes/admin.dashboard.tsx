import { trpc } from "~/lib/trpc";

export default function AdminDashboard() {
  // ✅ Fetch all stats from backend
  const { data: statsData, isLoading } = trpc.useQuery(
    "get",
    "/statistics/admin/dashboard",
  );

  // ✅ Type-safe stats from backend
  const stats = {
    users: (statsData as any)?.users || 0,
    categories: (statsData as any)?.categories || 0,
    products: (statsData as any)?.products || 0,
    orders: (statsData as any)?.orders || 0,
    revenue: (statsData as any)?.revenue || 0,
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Total Categories"
          value={stats.categories}
          icon="📁"
          color="indigo"
        />
        <StatCard
          title="Total Products"
          value={stats.products}
          icon="📦"
          color="orange"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon="🛒"
          color="green"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon="💰"
          color="purple"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div
      className={`${colors[color as keyof typeof colors]} border rounded-xl p-4 md:p-6 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl md:text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-3xl md:text-4xl flex-shrink-0">{icon}</span>
      </div>
    </div>
  );
}
