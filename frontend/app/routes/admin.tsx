import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth.store";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const hasCheckedAuth = useAuthStore((s) => s.hasCheckedAuth);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (hasCheckedAuth && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [hasCheckedAuth, isAdmin, navigate]);

  if (!hasCheckedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm font-semibold text-gray-500">
        Yüklənir...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#041d23] via-[#041d23] to-[#041d23] text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-gray-300">Manage your store</p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-72px)] border-r">
          <nav className="p-4 space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#0080e8]/10 text-[#0080e8] border-r-2 border-[#0080e8]"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#0080e8]/10 text-[#0080e8] border-r-2 border-[#0080e8]"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📁</span> Categories
            </NavLink>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#0080e8]/10 text-[#0080e8] border-r-2 border-[#0080e8]"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📦</span> Products
            </NavLink>
            <NavLink
              to="/admin/content"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#0080e8]/10 text-[#0080e8] border-r-2 border-[#0080e8]"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>🧩</span> Site Content
            </NavLink>
            <NavLink
              to="/admin/messages"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#0080e8]/10 text-[#0080e8] border-r-2 border-[#0080e8]"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>✉️</span> Messages
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#0080e8]/10 text-[#0080e8] border-r-2 border-[#0080e8]"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>🛒</span> Orders
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <WarningBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Warning Banner Component
function WarningBanner() {
  return (
    <div className="mb-6 rounded-lg border border-[#0080e8]/25 bg-[#0080e8]/10 p-3 text-sm text-[#001446]">
      <p className="font-semibold">Admin panel</p>
      <p className="mt-1 text-xs">
        Məzmun dəyişiklikləri canlı backend endpointləri ilə işləyir.
      </p>
    </div>
  );
}
