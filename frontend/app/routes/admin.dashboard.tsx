import { trpc } from "~/lib/trpc";

export default function AdminDashboard() {
  const { data: categories } = trpc.useQuery("get", "/categories");
  const { data: products } = trpc.useQuery("get", "/products");

  const stats = {
    categories: Array.isArray(categories) ? categories.length : 0,
    products: Array.isArray(products) ? products.length : 0,
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Categories"
          value={stats.categories}
          icon="📁"
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={stats.products}
          icon="📦"
          color="orange"
        />
        <StatCard title="Orders" value="0" icon="🛒" color="green" />
        <StatCard title="Revenue" value="$0" icon="💰" color="purple" />
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
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };
  return (
    <div
      className={`${colors[color as keyof typeof colors]} border rounded-xl p-4 md:p-6`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl md:text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-3xl md:text-4xl flex-shrink-0">{icon}</span>
      </div>
    </div>
  );
}
