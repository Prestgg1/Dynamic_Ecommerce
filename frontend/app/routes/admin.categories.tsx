import { useState } from "react";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";
import { IconDisplay, type CategoryIconKey } from "~/lib/admin-icons";
import { CategoryForm } from "~/components/admin/CategoryForm";

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, refetch } = trpc.useQuery("get", "/categories");
  const { mutate: deleteCategory } = trpc.useMutation("delete", "/categories/{id}");

  const categories = Array.isArray(data) ? data : [];

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCategory({ params: { path: { id: deleteTarget.id } } }, {
      onSuccess: () => { toast.success("Category deleted"); refetch(); setDeleteTarget(null); },
      onError: () => toast.error("Failed to delete"),
    });
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={() => { setEditingCategory(null); setShowForm(true); }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <span>+</span> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><Spinner /></div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No categories found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Icon</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Label (AZ)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Label (RU)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Label (EN)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Products</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat: any) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3"><IconDisplay icon={(cat.icon || "tools") as CategoryIconKey} size="sm" /></td>
                  <td className="px-6 py-3 text-sm font-mono">{cat.id}</td>
                  <td className="px-6 py-3 text-sm">{cat.labelAz}</td>
                  <td className="px-6 py-3 text-sm">{cat.labelRu}</td>
                  <td className="px-6 py-3 text-sm">{cat.labelEn}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{cat.products?.length || 0}</span>
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(cat)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">Edit</button>
                    <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.labelAz })} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => setShowForm(false)}
          onSuccess={() => { refetch(); setShowForm(false); }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete Category"
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
