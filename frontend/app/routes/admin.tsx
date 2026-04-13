import { Outlet, NavLink } from "react-router";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white sticky top-0 z-10">
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
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📁</span> Categories
            </NavLink>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📦</span> Products
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500" : "text-gray-600 hover:bg-gray-50"
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
    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
      <p className="font-semibold">⚠️ Development Mode</p>
      <p className="text-xs mt-1">POST/PATCH/DELETE endpoints are mocked. Backend integration ready but commented out.</p>
    </div>
  );
}
