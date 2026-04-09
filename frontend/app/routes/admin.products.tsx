// routes/admin/products.tsx
import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";
import { DeleteConfirmModal } from "~/components/admin/DeleteConfirmModal";

export default function ProductsPage() {
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const { data, isLoading, refetch } = trpc.useQuery("get", "/products");
  const { data: categories } = trpc.useQuery("get", "/categories");
  const { mutate: deleteProduct } = trpc.useMutation("delete", "/products/{id}");

  const products = Array.isArray(data) ? data : [];
  const categoryMap = new Map(Array.isArray(categories) ? categories.map((c: any) => [c.id, c]) : []);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProduct({ params: { path: { id: deleteTarget.id.toString() } } }, {
      onSuccess: () => { toast.success("Product deleted"); refetch(); setDeleteTarget(null); },
      onError: () => toast.error("Failed to delete"),
    });
  };

  const getImageUrl = (image: string) => {
    if (!image) return "https://via.placeholder.com/48?text=No+Image";
    if (image.includes("unsplash")) return image;
    return `http://localhost:4000${image}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <Link to="/admin/products/new" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
          <span>+</span> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><Spinner /></div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                      <img src={getImageUrl(product.image)} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium">{product.name}</td>
                  <td className="px-6 py-3 text-sm">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="px-6 py-3 text-sm">{categoryMap.get(product.categoryId || product.category?.id)?.labelAz || "N/A"}</td>
                  <td className="px-6 py-3 text-sm">⭐ {product.rating || "N/A"}</td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <Link to={`/admin/products/${product.id}/edit`} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm inline-block">Edit</Link>
                    <button onClick={() => setDeleteTarget({ id: product.id, name: product.name })} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
  return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />;
}
