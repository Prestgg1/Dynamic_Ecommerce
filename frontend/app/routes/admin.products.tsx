import { useState } from "react";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";
import { ProductForm } from "~/components/admin/ProductForm";
import { DeleteConfirmModal } from "~/components/admin/DeleteConfirmModal";

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data, isLoading, refetch } = trpc.useQuery("get", "/products");
  const { data: categories } = trpc.useQuery("get", "/categories");
  const { mutate: deleteProduct } = trpc.useMutation(
    "delete",
    "/products/{id}",
  );

  const products = Array.isArray(data) ? data : [];
  const categoryMap = new Map(
    Array.isArray(categories) ? categories.map((c: any) => [c.id, c]) : [],
  );

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleSuccessForm = () => {
    refetch();
    handleCloseForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(
      { params: { path: { id: deleteTarget.id.toString() } } },
      {
        onSuccess: () => {
          toast.success("Product deleted");
          refetch();
          setDeleteTarget(null);
        },
        onError: () => toast.error("Failed to delete"),
      },
    );
  };

  const getImageUrl = (image: string) => {
    if (!image) return "https://via.placeholder.com/48?text=No+Image";
    if (image.includes("unsplash")) return image;
    return `http://localhost:4000${image}`;
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Products
        </h2>
        <button
          onClick={handleNewProduct}
          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 md:py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold hidden md:table-cell">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold hidden lg:table-cell">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product: any) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium max-w-xs truncate">
                    {product.name}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-sm hidden md:table-cell">
                    {categoryMap.get(product.categoryId || product.category?.id)
                      ?.labelAz || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm hidden lg:table-cell">
                    ⭐ {product.rating || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            id: product.id,
                            name: product.name,
                          })
                        }
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="p-8 text-center">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl">
            No products found
          </div>
        ) : (
          products.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {categoryMap.get(product.categoryId || product.category?.id)
                      ?.labelAz || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ⭐ {product.rating || "N/A"}
                  </p>
                </div>
              </div>
              <div className="border-t pt-3 flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setDeleteTarget({ id: product.id, name: product.name })
                  }
                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={handleCloseForm}
          onSuccess={handleSuccessForm}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-orange-500 mx-auto" />
  );
}
