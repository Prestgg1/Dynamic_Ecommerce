import { useState } from "react";
import { trpc, type Categories, type Products } from "~/lib/trpc";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";

// Match your actual API response types

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"categories" | "products">(
    "categories",
  );
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "category" | "product";
    id: string | number;
  } | null>(null);

  // Categories Query (GET works)
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    trpc.useQuery("get", "/categories");

  // Debug log for categories
  console.log("🔍 Categories Response:", categoriesData);
  console.log("⏳ Categories Loading:", isCategoriesLoading);

  // Products Query (GET works)
  const { data: productsData, isLoading: isProductsLoading } = trpc.useQuery(
    "get",
    "/products",
  );

  // Debug log for products
  console.log("🔍 Products Response:", productsData);
  console.log("⏳ Products Loading:", isProductsLoading);

  // Form states
  const [categoryForm, setCategoryForm] = useState<Partial<Categories[number]>>(
    {},
  );
  const [productForm, setProductForm] = useState<Partial<Products[number]>>({});

  // Extract data from response - handle array or wrapped response
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const products = Array.isArray(productsData) ? productsData : [];

  console.log("📊 Parsed Categories:", categories);
  console.log("📊 Parsed Products:", products);

  const handleDeleteCategory = (id: string) => {
    console.log("🗑️ Delete category:", id);
    console.log("⚠️ Backend DELETE /categories/{id} not implemented yet");
    alert("Backend DELETE endpoint not yet implemented");
  };

  const handleDeleteProduct = (id: number) => {
    console.log("🗑️ Delete product:", id);
    console.log("⚠️ Backend DELETE /products/{id} not implemented yet");
    alert("Backend DELETE endpoint not yet implemented");
  };

  const handleSaveCategory = () => {
    if (
      !categoryForm.id ||
      !categoryForm.labelAz ||
      !categoryForm.labelRu ||
      !categoryForm.labelEn
    ) {
      alert("Please fill in all fields");
      return;
    }

    console.log("💾 Save category:", categoryForm);
    console.log("✏️ Editing ID:", editingId);
    console.log(
      "⚠️ Backend POST /categories and PATCH /categories/{id} not implemented yet",
    );
    alert("Backend endpoints not yet implemented");
  };

  const handleSaveProduct = () => {
    if (
      !productForm.id ||
      !productForm.name ||
      !productForm.price ||
      !productForm.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("💾 Save product:", productForm);
    console.log("✏️ Editing ID:", editingId);
    console.log(
      "⚠️ Backend POST /products and PATCH /products/{id} not implemented yet",
    );
    alert("Backend endpoints not yet implemented");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your products and categories</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 px-1 font-semibold transition-all ${
              activeTab === "categories"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 px-1 font-semibold transition-all ${
              activeTab === "products"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Products
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          <p className="font-semibold">⚠️ Backend Endpoints Status:</p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>
              ✅{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                GET /categories
              </code>{" "}
              - Working
            </li>
            <li>
              ✅{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                GET /products
              </code>{" "}
              - Working
            </li>
            <li>
              ❌{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                POST /categories
              </code>{" "}
              - Not implemented
            </li>
            <li>
              ❌{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                PATCH /categories/{"{id}"}
              </code>{" "}
              - Not implemented
            </li>
            <li>
              ❌{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                DELETE /categories/{"{id}"}
              </code>{" "}
              - Not implemented
            </li>
            <li>
              ❌{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                POST /products
              </code>{" "}
              - Not implemented
            </li>
            <li>
              ❌{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                PATCH /products/{"{id}"}
              </code>{" "}
              - Not implemented
            </li>
            <li>
              ❌{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                DELETE /products/{"{id}"}
              </code>{" "}
              - Not implemented
            </li>
          </ul>
          <p className="mt-3 text-xs">
            Open DevTools Console (F12) to see debug logs
          </p>
        </div>
      </div>
      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Add/Edit Category Form */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Category ID"
                value={categoryForm.id || ""}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, id: e.target.value })
                }
                disabled={!!editingId}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
              />
              <input
                type="text"
                placeholder="Label (AZ)"
                value={categoryForm.labelAz || ""}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, labelAz: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Label (RU)"
                value={categoryForm.labelRu || ""}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, labelRu: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Label (EN)"
                value={categoryForm.labelEn || ""}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, labelEn: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveCategory}
                disabled={true}
                className="bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg opacity-50 cursor-not-allowed"
              >
                {editingId ? "Update Category" : "Add Category"}
              </button>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setCategoryForm({});
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              ⚠️ POST/PATCH endpoints not yet implemented on backend
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {isCategoriesLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading categories...</p>
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Label (AZ)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Label (RU)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Label (EN)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Products
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((category: Categories[number]) => (
                      <tr
                        key={category.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {category.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {category.labelAz}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {category.labelRu}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {category.labelEn}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {category.products?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3 flex justify-end">
                          <button
                            onClick={() => {
                              console.log("📝 Editing category:", category);
                              setEditingId(category.id);
                              setCategoryForm(category);
                            }}
                            disabled={true}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              console.log(
                                "🗑️ Delete category clicked:",
                                category.id,
                              );
                              setDeleteConfirm({
                                type: "category",
                                id: category.id,
                              });
                            }}
                            disabled={true}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No categories found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Add/Edit Product Form */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Product Name"
                value={productForm.name || ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
              <input
                type="number"
                placeholder="Price"
                value={productForm.price || ""}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
              <input
                type="number"
                placeholder="Old Price (Optional)"
                value={productForm.oldPrice || ""}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    oldPrice: parseFloat(e.target.value) || undefined,
                  })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
              <input
                type="number"
                placeholder="Rating"
                min="0"
                max="5"
                value={productForm.rating || ""}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    rating: parseFloat(e.target.value) || 0,
                  })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
              <textarea
                placeholder="Description"
                value={productForm.description || ""}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors md:col-span-2"
                rows={3}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={productForm.image || ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, image: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors md:col-span-2"
              />
              <div className="flex gap-4 md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller || false}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        isBestSeller: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Best Seller
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNew || false}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        isNew: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    New Arrival
                  </span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProduct}
                disabled={true}
                className="bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg opacity-50 cursor-not-allowed"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setProductForm({});
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              ⚠️ POST/PATCH endpoints not yet implemented on backend
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {isProductsLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading products...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product: Products[number]) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {product.category?.id || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                            ⭐ {product.rating}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            {product.isBestSeller && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                Best Seller
                              </span>
                            )}
                            {product.isNew && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                New
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3 flex justify-end">
                          <button
                            onClick={() => {
                              console.log("📝 Editing product:", product);
                              setEditingId(product.id);
                              setProductForm(product);
                            }}
                            disabled={true}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              console.log(
                                "🗑️ Delete product clicked:",
                                product.id,
                              );
                              setDeleteConfirm({
                                type: "product",
                                id: product.id,
                              });
                            }}
                            disabled={true}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Disabled */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Delete Not Available
            </h3>
            <p className="text-gray-600 mb-8">
              DELETE endpoint for {deleteConfirm.type} is not yet implemented on
              the backend.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
