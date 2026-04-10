import { Outlet, NavLink } from "react-router";
import { useState } from "react";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-gray-300">Manage your store</p>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(true)} className="md:hidden text-2xl">
            ☰
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Overlay (mobile) */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
    fixed md:relative top-0 left-0 z-50 md:z-auto
    h-full md:h-auto w-64 bg-white shadow-lg border-r
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
        >
          <div className="p-4 flex justify-between items-center md:hidden border-b">
            <span className="font-semibold">Menu</span>
            <button onClick={() => setOpen(false)} className="text-xl">
              ✕
            </button>
          </div>

          <nav className="p-4 space-y-1">
            <NavLink
              to="/admin"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📊</span> Dashboard
            </NavLink>

            <NavLink
              to="/admin/categories"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📁</span> Categories
            </NavLink>

            <NavLink
              to="/admin/products"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>📦</span> Products
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 w-full">
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
      <p className="text-xs mt-1">
        POST/PATCH/DELETE endpoints are mocked. Backend integration ready but
        commented out.
      </p>
    </div>
  );
}
