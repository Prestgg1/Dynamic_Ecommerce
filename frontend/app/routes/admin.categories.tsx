import { useState } from "react";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";
import { IconDisplay, type CategoryIconKey } from "~/lib/admin-icons";
import { CategoryForm } from "~/components/admin/CategoryForm";
import { DeleteConfirmModal } from "~/components/admin/DeleteConfirmModal";

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, refetch } = trpc.useQuery("get", "/categories");
  const { mutate: deleteCategory } = trpc.useMutation(
    "delete",
    "/categories/{id}",
  );

  const categories = Array.isArray(data) ? data : [];

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(
      { params: { path: { id: deleteTarget.id } } },
      {
        onSuccess: () => {
          toast.success("Category deleted");
          refetch();
          setDeleteTarget(null);
        },
        onError: () => toast.error("Failed to delete"),
      },
    );
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSuccessForm = () => {
    refetch();
    handleCloseForm();
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Categories
        </h2>
        <button
          onClick={handleNewCategory}
          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 md:py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <span>+</span> Add Category
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <Spinner />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold hidden md:table-cell">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold">
                  Label (AZ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold hidden lg:table-cell">
                  Label (RU)
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold hidden lg:table-cell">
                  Label (EN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold hidden md:table-cell">
                  Products
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat: any) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <IconDisplay
                      icon={(cat.icon || "tools") as CategoryIconKey}
                      size="sm"
                    />
                  </td>
                  <td className="px-6 py-3 text-xs font-mono hidden md:table-cell">
                    {cat.id}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium">
                    {cat.labelAz}
                  </td>
                  <td className="px-6 py-3 text-sm hidden lg:table-cell">
                    {cat.labelRu}
                  </td>
                  <td className="px-6 py-3 text-sm hidden lg:table-cell">
                    {cat.labelEn}
                  </td>
                  <td className="px-6 py-3 text-sm hidden md:table-cell">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {cat.products?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({ id: cat.id, name: cat.labelAz })
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
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl">
            No categories found
          </div>
        ) : (
          categories.map((cat: any) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <IconDisplay
                  icon={(cat.icon || "tools") as CategoryIconKey}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900">
                    {cat.labelAz}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">{cat.labelRu}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-t pt-3">
                <div>
                  <p className="text-xs text-gray-500">Products</p>
                  <p className="text-sm font-bold text-gray-900">
                    {cat.products?.length || 0}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteTarget({ id: cat.id, name: cat.labelAz })
                    }
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleCloseForm}
          onSuccess={handleSuccessForm}
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
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-orange-500 mx-auto" />
  );
}
