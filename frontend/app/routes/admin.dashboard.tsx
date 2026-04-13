// routes/admin/_index.tsx
import { trpc } from "~/lib/trpc";

export default function AdminDashboard() {
  const { data: statsData } = trpc.useQuery("get", "/statistics/admin/dashboard");

  const stats = {
    users: (statsData as any)?.users || 0,
    products: (statsData as any)?.products || 0,
    orders: (statsData as any)?.orders || 0,
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.users} icon="👥" color="blue" />
        <StatCard title="Total Products" value={stats.products} icon="📦" color="orange" />
        <StatCard title="Total Orders" value={stats.orders} icon="🛒" color="green" />
        <StatCard title="Revenue" value="$0" icon="💰" color="purple" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };
  return (
    <div className={`${colors[color as keyof typeof colors]} border rounded-xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
