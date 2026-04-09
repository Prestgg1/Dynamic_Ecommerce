// components/admin/CategoryForm.tsx
import { useState } from "react";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";
import { IconDisplay, CATEGORY_ICONS, getGradient, type CategoryIconKey } from "~/lib/admin-icons";
import { IconSelector } from "./IconSelector";

interface CategoryFormProps {
  category?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryForm({ category, onClose, onSuccess }: CategoryFormProps) {
  const isNew = !category;
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [form, setForm] = useState({
    id: category?.id || "",
    labelAz: category?.labelAz || "",
    labelRu: category?.labelRu || "",
    labelEn: category?.labelEn || "",
    icon: (category?.icon || "tools") as CategoryIconKey,
  });

  const { mutate: create } = trpc.useMutation("post", "/categories");
  const { mutate: update } = trpc.useMutation("patch", "/categories/{id}");

  const handleSubmit = () => {
    if (!form.id || !form.labelAz || !form.labelRu || !form.labelEn) {
      toast.error("Please fill all fields");
      return;
    }

    const action = isNew ? create : update;
    const config = isNew
      ? { body: form, onSuccess: () => { toast.success("Category created"); onSuccess(); } }
      : { params: { path: { id: form.id } }, body: form, onSuccess: () => { toast.success("Category updated"); onSuccess(); } };

    action(config as any, { onError: () => toast.error("Failed to save") });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-5 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold">{isNew ? "Add Category" : "Edit Category"}</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">✕</button>
          </div>
          <div className="p-5 space-y-4">
            <input type="text" placeholder="Category ID" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })}
              disabled={!isNew} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-100" />
            <input type="text" placeholder="Label (AZ)" value={form.labelAz} onChange={e => setForm({ ...form, labelAz: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
            <input type="text" placeholder="Label (RU)" value={form.labelRu} onChange={e => setForm({ ...form, labelRu: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
            <input type="text" placeholder="Label (EN)" value={form.labelEn} onChange={e => setForm({ ...form, labelEn: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />

            <button onClick={() => setShowIconSelector(true)} className="w-full p-3 border-2 rounded-lg flex items-center justify-center gap-3 hover:border-orange-500">
              <IconDisplay icon={form.icon} size="sm" />
              <span className="font-medium capitalize">{form.icon}</span>
            </button>
          </div>
          <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              {isNew ? "Create" : "Update"}
            </button>
          </div>
        </div>
      </div>

      {showIconSelector && (
        <IconSelector selected={form.icon} onSelect={icon => { setForm({ ...form, icon }); setShowIconSelector(false); }} onClose={() => setShowIconSelector(false)} />
      )}
    </>
  );
}
