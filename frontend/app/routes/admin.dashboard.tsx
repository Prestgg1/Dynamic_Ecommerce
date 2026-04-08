import { useState, useRef } from "react";
import { trpc } from "~/lib/trpc";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";
import toast from "react-hot-toast";

// ✅ Predefined icons for hardware store categories
const CATEGORY_ICONS = {
  tools: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a4 4 0 01-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-3 3z" />
    </svg>
  ),
  hardware: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  pipes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h6a3 3 0 013 3v4a3 3 0 003 3h4" />
    </svg>
  ),
  fasteners: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15 7 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 7" />
    </svg>
  ),
  electrical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
    </svg>
  ),
  welding: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="12" r="3" />
      <line x1="11" y1="12" x2="13" y2="12" />
    </svg>
  ),
  safety: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 6.5a5.5 5.5 0 01-7.8 5.1L6 20l-2-2 8.6-8.2A5.5 5.5 0 1118 4l-3 3 4 4 3-3z" />
    </svg>
  ),
  hammer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3l7 7-3 3-7-7z" />
      <path d="M2 22l10-10" />
    </svg>
  ),
  screwdriver: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2l8 8-3 3-8-8z" />
      <path d="M2 22l10-10" />
    </svg>
  ),
  drill: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="8" width="13" height="8" rx="2" />
      <path d="M16 10h4l1 2-1 2h-4" />
    </svg>
  ),
  cable: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12h6a4 4 0 014 4v4" />
      <circle cx="4" cy="12" r="2" />
    </svg>
  ),
  paint: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a10 10 0 100 20c2 0 2-2 2-3s-1-2-1-3 1-2 3-2h2a4 4 0 004-4 10 10 0 00-10-8z" />
    </svg>
  ),
  gloves: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 12V6a2 2 0 114 0v6M10 12V5a2 2 0 114 0v7M14 12V7a2 2 0 114 0v9a4 4 0 01-4 4H9a5 5 0 01-5-5v-3a2 2 0 114 0z" />
    </svg>
  ),
  helmet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 13a8 8 0 0116 0v3H4z" />
    </svg>
  ),
  nut: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 19 6 19 18 12 22 5 18 5 6" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L6 14h5l-1 8 7-12h-5z" />
    </svg>
  ),
  laser: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="12" r="2" />
      <line x1="8" y1="12" x2="22" y2="12" />
    </svg>
  ),
  gauge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 14a8 8 0 0116 0" />
      <line x1="12" y1="14" x2="16" y2="10" />
    </svg>
  ),
} as const;

type CategoryIconKey = keyof typeof CATEGORY_ICONS;

const getGradientColors = (iconKey: CategoryIconKey): string => {
  const gradients: Record<CategoryIconKey, string> = {
    tools: "from-blue-400 to-blue-600",
    hardware: "from-purple-400 to-purple-600",
    pipes: "from-cyan-400 to-cyan-600",
    fasteners: "from-amber-400 to-amber-600",
    electrical: "from-yellow-400 to-yellow-600",
    welding: "from-orange-400 to-orange-600",
    safety: "from-red-400 to-red-600",
    wrench: "from-slate-400 to-slate-600",
    hammer: "from-rose-400 to-rose-600",
    screwdriver: "from-lime-400 to-lime-600",
    drill: "from-indigo-400 to-indigo-600",
    cable: "from-teal-400 to-teal-600",
    paint: "from-pink-400 to-pink-600",
    gloves: "from-green-400 to-green-600",
    helmet: "from-fuchsia-400 to-fuchsia-600",
    nut: "from-violet-400 to-violet-600",
    bolt: "from-sky-400 to-sky-600",
    laser: "from-red-400 to-pink-600",
    gauge: "from-emerald-400 to-emerald-600",
  };
  return gradients[iconKey] || "from-gray-400 to-gray-600";
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"categories" | "products">(
    "categories",
  );
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState<any | null>(null);
  const [editProductModal, setEditProductModal] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "category" | "product";
    id: string | number;
  } | null>(null);

  // Categories Query
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    trpc.useQuery("get", "/categories");

  // Products Query
  const { data: productsData, isLoading: isProductsLoading } = trpc.useQuery(
    "get",
    "/products",
  );

  //   const createProduct = trpc.useMutation("post", "/products");
  // const updateProduct = trpc.useMutation("patch", "/products/{id}");
  // const deleteProduct = trpc.useMutation("delete", "/products/{id}");

  // const createCategory = trpc.useMutation("post", "/categories");
  // const updateCategory = trpc.useMutation("patch", "/categories/{id}");
  // const deleteCategory = trpc.useMutation("delete", "/categories/{id}");

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const products = Array.isArray(productsData) ? productsData : [];

  const [categoryForm, setCategoryForm] = useState({
    id: "",
    labelAz: "",
    labelRu: "",
    labelEn: "",
    icon: "tools" as CategoryIconKey,
  });

  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    nameRu: "",
    nameEn: "",
    description: "",
    descriptionRu: "",
    descriptionEn: "",
    price: "",
    oldPrice: "",
    rating: "",
    reviewCount: "",
    weight: "",
    material: "",
    dimensions: "",
    badge: "",
    category: "",
    image: "",
    imagePreview: "" as string | null,
    isBestSeller: false,
    isNew: false,
    inStock: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({
          ...prev,
          imagePreview: reader.result as string,
          image: file.name,
        }));
      };
      reader.readAsDataURL(file);
      console.log("📸 Image selected:", file.name);
    }
  };

  // Reset forms
  const resetCategoryForm = () => {
    setCategoryForm({
      id: "",
      labelAz: "",
      labelRu: "",
      labelEn: "",
      icon: "tools",
    });
  };

  const resetProductForm = () => {
    setProductForm({
      id: "",
      name: "",
      nameRu: "",
      nameEn: "",
      description: "",
      descriptionRu: "",
      descriptionEn: "",
      price: "",
      oldPrice: "",
      rating: "",
      reviewCount: "",
      weight: "",
      material: "",
      dimensions: "",
      badge: "",
      category: "",
      image: "",
      imagePreview: "",
      isBestSeller: false,
      isNew: false,
      inStock: true,
    });
  };

  // ✅ Handle Save Category
  const handleSaveCategory = () => {
    if (
      !categoryForm.id ||
      !categoryForm.labelAz ||
      !categoryForm.labelRu ||
      !categoryForm.labelEn
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log("💾 Save category:", categoryForm);

    if (editCategoryModal) {
      // PATCH - Update existing
      console.log("🔄 Updating category with ID:", editCategoryModal.id);
      toast.success("✅ Category updated (Testing - Backend not ready)");
    } else {
      // POST - Create new
      console.log("✨ Creating new category");
      toast.success("✅ Category created (Testing - Backend not ready)");
    }

    setEditCategoryModal(null);
    resetCategoryForm();
  };
// const handleSaveCategory = () => {
//   if (!categoryForm.id || !categoryForm.labelAz || !categoryForm.labelRu || !categoryForm.labelEn) {
//     toast.error("Please fill in all fields");
//     return;
//   }

//   if (editCategoryModal) {
//     // PATCH
//     updateCategory.mutate(
//       { params: { path: { id: categoryForm.id } }, body: categoryForm },
//       {
//         onSuccess: () => {
//           toast.success("✅ Category updated");
//           setEditCategoryModal(null);
//           resetCategoryForm();
//         },
//         onError: () => toast.error("❌ Failed to update category"),
//       }
//     );
//   } else {
//     // POST
//     createCategory.mutate(
//       { body: categoryForm },
//       {
//         onSuccess: () => {
//           toast.success("✅ Category created");
//           resetCategoryForm();
//         },
//         onError: () => toast.error("❌ Failed to create category"),
//       }
//     );
//   }
// };
  // ✅ Handle Save Product
  const handleSaveProduct = () => {
    if (
      !productForm.id ||
      !productForm.name ||
      !productForm.price ||
      !productForm.category
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("💾 Save product:", productForm);

    if (editProductModal) {
      // PATCH - Update existing
      console.log("🔄 Updating product with ID:", editProductModal.id);
      toast.success("✅ Product updated (Testing - Backend not ready)");
    } else {
      // POST - Create new
      console.log("✨ Creating new product");
      toast.success("✅ Product created (Testing - Backend not ready)");
    }

    setEditProductModal(null);
    resetProductForm();
  };
  // const handleSaveProduct = () => {
  //   if (
  //     !productForm.id ||
  //     !productForm.name ||
  //     !productForm.price ||
  //     !productForm.category
  //   ) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   console.log("💾 Save product:", productForm);

  //   const payload = {
  //     ...productForm,
  //     price: Number(productForm.price),
  //     oldPrice: productForm.oldPrice
  //       ? Number(productForm.oldPrice)
  //       : undefined,
  //     rating: productForm.rating
  //       ? Number(productForm.rating)
  //       : undefined,
  //     reviewCount: productForm.reviewCount
  //       ? Number(productForm.reviewCount)
  //       : undefined,
  //   };

  //   if (editProductModal) {
  //     // 🔄 PATCH - Update existing
  //     console.log("🔄 Updating product with ID:", editProductModal.id);

  //     updateProduct.mutate(
  //       {
  //         params: {
  //           path: { id: productForm.id },
  //         },
  //         body: payload,
  //       },
  //       {
  //         onSuccess: () => {
  //           toast.success("✅ Product updated");
  //           setEditProductModal(null);
  //           resetProductForm();
  //         },
  //         onError: () => {
  //           toast.error("❌ Failed to update product");
  //         },
  //       }
  //     );
  //   } else {
  //     // ✨ POST - Create new
  //     console.log("✨ Creating new product");

  //     createProduct.mutate(
  //       {
  //         body: payload,
  //       },
  //       {
  //         onSuccess: () => {
  //           toast.success("✅ Product created");
  //           setEditProductModal(null);
  //           resetProductForm();
  //         },
  //         onError: () => {
  //           toast.error("❌ Failed to create product");
  //         },
  //       }
  //     );
  //   }
  // };

  const handleDeleteProduct = (id: number) => {
    console.log("🗑️ Delete product:", id);
    toast.success("✅ Product deleted (Testing - Backend not ready)");
    setDeleteConfirm(null);
  };
  // const handleDeleteProduct = (id: number) => {
  //   if (!id) return;
  //   deleteProduct.mutate(
  //     { params: { path: { id } } },
  //     {
  //       onSuccess: () => toast.success("🗑 Product deleted"),
  //       onError: () => toast.error("❌ Failed to delete product"),
  //     }
  //   );
  // };

  const handleDeleteCategory = (id: string) => {
    console.log("🗑️ Delete category:", id);
    toast.success("✅ Category deleted (Testing - Backend not ready)");
    setDeleteConfirm(null);
  };
// const handleDeleteCategory = (id: string) => {
//   if (!id) return;
//   deleteCategory.mutate(
//     { params: { path: { id } } },
//     {
//       onSuccess: () => toast.success("🗑 Category deleted"),
//       onError: () => toast.error("❌ Failed to delete category"),
//     }
//   );
// };

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
          <ul className="mt-2 ml-4 list-disc space-y-1 text-xs">
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
              ⚠️ POST /categories, PATCH /categories, DELETE /categories - implemented using mock handlers, real api handlers ready and commented out. Waiting for backend.
            </li>
            <li>
              ⚠️ POST /products, PATCH /products, DELETE /products - implemented using mock handlers, real api handlers ready and commented out. Waiting for backend.
            </li>
          </ul>
        </div>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Categories List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setEditCategoryModal({ isNew: true });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
              >
                + Add Category
              </button>
            </div>

            {isCategoriesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading categories...</p>
              </div>
            ) : categories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Icon
                      </th>
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
                    {categories.map((category: any) => (
                      <tr
                        key={category.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getGradientColors((category.icon || "tools") as CategoryIconKey)} flex items-center justify-center text-white shadow-md`}
                          >
                            <div className="w-6 h-6">
                              {CATEGORY_ICONS[
                                (category.icon || "tools") as CategoryIconKey
                              ] || CATEGORY_ICONS.tools}
                            </div>
                          </div>
                        </td>
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
                              setCategoryForm({
                                id: category.id,
                                labelAz: category.labelAz,
                                labelRu: category.labelRu,
                                labelEn: category.labelEn,
                                icon: (category.icon ||
                                  "tools") as CategoryIconKey,
                              });
                              setEditCategoryModal(category);
                            }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: "category",
                                id: category.id,
                              })
                            }
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
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
          {/* Products List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Products</h2>
              <button
                onClick={() => {
                  resetProductForm();
                  setEditProductModal({ isNew: true });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
              >
                + Add Product
              </button>
            </div>

            {isProductsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading products...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                        Image
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
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product: any) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                            <img
                              src={
                                product.image?.includes("unsplash")
                                  ? product.image
                                  : `http://localhost:4000${product.image}`
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/48?text=No+Image";
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium max-w-xs truncate">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          ${parseFloat(product.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {product.category?.id || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                            ⭐ {product.rating}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3 flex justify-end">
                          <button
                            onClick={() => {
                              setProductForm({
                                id: product.id,
                                name: product.name,
                                nameRu: product.nameRu,
                                nameEn: product.nameEn,
                                description: product.description,
                                descriptionRu: product.descriptionRu,
                                descriptionEn: product.descriptionEn,
                                price: product.price?.toString(),
                                oldPrice: product.oldPrice?.toString() || "",
                                rating: product.rating?.toString(),
                                reviewCount: product.reviewCount?.toString(),
                                weight: product.weight || "",
                                material: product.material || "",
                                dimensions: product.dimensions || "",
                                badge: product.badge || "",
                                category:
                                  product.categoryId || product.category?.id,
                                image: product.image,
                                imagePreview: product.image?.includes(
                                  "unsplash",
                                )
                                  ? product.image
                                  : `http://localhost:4000${product.image}`,
                                isBestSeller: product.isBestSeller || false,
                                isNew: product.isNew || false,
                                inStock: product.inStock !== false,
                              });
                              setEditProductModal(product);
                            }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: "product",
                                id: product.id,
                              })
                            }
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
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

      {/* ✅ Edit Category Modal */}
      {editCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                {editCategoryModal.isNew ? "Add Category" : "Edit Category"}
              </h3>
              <button
                onClick={() => {
                  setEditCategoryModal(null);
                  resetCategoryForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <input
                type="text"
                placeholder="Category ID"
                value={categoryForm.id}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, id: e.target.value })
                }
                disabled={!editCategoryModal.isNew}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
              />
              <input
                type="text"
                placeholder="Label (AZ)"
                value={categoryForm.labelAz}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, labelAz: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Label (RU)"
                value={categoryForm.labelRu}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, labelRu: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Label (EN)"
                value={categoryForm.labelEn}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, labelEn: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category Icon
                </label>
                <button
                  onClick={() => setIconModalOpen(true)}
                  className="w-full h-20 rounded-xl bg-gradient-to-br transition-transform hover:scale-105 border-2 border-gray-300 hover:border-orange-500 flex items-center justify-center gap-4"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getGradientColors(categoryForm.icon)} rounded-lg flex items-center justify-center text-white shadow-lg`}
                  >
                    <div className="w-8 h-8">
                      {CATEGORY_ICONS[categoryForm.icon]}
                    </div>
                  </div>
                  <span className="text-gray-700 font-semibold capitalize">
                    {categoryForm.icon}
                  </span>
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditCategoryModal(null);
                  resetCategoryForm();
                }}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                {editCategoryModal.isNew ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Edit Product Modal */}
      {editProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                {editProductModal.isNew ? "Add Product" : "Edit Product"}
              </h3>
              <button
                onClick={() => {
                  setEditProductModal(null);
                  resetProductForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Image Preview */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 hover:border-orange-500 transition-colors p-2 cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {productForm.imagePreview ? (
                      <>
                        <img
                          src={productForm.imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            Change
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                  {productForm.imagePreview && (
                    <button
                      onClick={() =>
                        setProductForm((prev) => ({
                          ...prev,
                          imagePreview: "",
                          image: "",
                        }))
                      }
                      className="text-xs text-red-500 hover:text-red-700 font-medium mt-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Product Details */}
                <div className="md:col-span-2 space-y-3">
                  <input
                    type="text"
                    placeholder="Product Name (AZ)"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Product Name (RU)"
                    value={productForm.nameRu}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        nameRu: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Product Name (EN)"
                    value={productForm.nameEn}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        nameEn: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Price"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Old Price"
                      value={productForm.oldPrice}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          oldPrice: e.target.value,
                        })
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={productForm.rating}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          rating: e.target.value,
                        })
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.labelAz || cat.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-2">
                <textarea
                  placeholder="Description (AZ)"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  rows={2}
                />
                <textarea
                  placeholder="Description (RU)"
                  value={productForm.descriptionRu}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      descriptionRu: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  rows={2}
                />
                <textarea
                  placeholder="Description (EN)"
                  value={productForm.descriptionEn}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      descriptionEn: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  rows={2}
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Weight"
                  value={productForm.weight}
                  onChange={(e) =>
                    setProductForm({ ...productForm, weight: e.target.value })
                  }
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  placeholder="Material"
                  value={productForm.material}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      material: e.target.value,
                    })
                  }
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  placeholder="Dimensions"
                  value={productForm.dimensions}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      dimensions: e.target.value,
                    })
                  }
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        inStock: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-orange-500"
                  />
                  <span className="text-sm text-gray-700">In Stock</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditProductModal(null);
                  resetProductForm();
                }}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                {editProductModal.isNew ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Icon Selection Modal */}
      {iconModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                Select Category Icon
              </h3>
              <button
                onClick={() => setIconModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {(Object.keys(CATEGORY_ICONS) as CategoryIconKey[]).map(
                  (iconKey) => (
                    <button
                      key={iconKey}
                      onClick={() => {
                        setCategoryForm({
                          ...categoryForm,
                          icon: iconKey,
                        });
                        setIconModalOpen(false);
                      }}
                      className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:scale-105 relative ${
                        categoryForm.icon === iconKey
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-gray-50 hover:border-orange-300"
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getGradientColors(iconKey)} flex items-center justify-center text-white shadow-md mb-2 group-hover:shadow-lg transition-shadow`}
                      >
                        <div className="w-8 h-8">{CATEGORY_ICONS[iconKey]}</div>
                      </div>
                      <span className="text-xs font-semibold text-gray-700 text-center capitalize">
                        {iconKey}
                      </span>
                      {categoryForm.icon === iconKey && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setIconModalOpen(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIconModalOpen(false)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete this {deleteConfirm.type}? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === "category") {
                    handleDeleteCategory(deleteConfirm.id as string);
                  } else {
                    handleDeleteProduct(deleteConfirm.id as number);
                  }
                }}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
