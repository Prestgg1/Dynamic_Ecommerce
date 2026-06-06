// components/admin/ProductForm.tsx
import { useState } from "react";
import { trpc, BACKEND_URL } from "~/lib/trpc";
import toast from "react-hot-toast";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isNew = !product;
  const { data: categories } = trpc.useQuery("get", "/categories");

  const [form, setForm] = useState({
    name: product?.name || "",
    nameRu: product?.nameRu || "",
    nameEn: product?.nameEn || "",
    description: product?.description || "",
    descriptionRu: product?.descriptionRu || "",
    descriptionEn: product?.descriptionEn || "",
    price: product?.price?.toString() || "",
    oldPrice: product?.oldPrice?.toString() || "",
    category: product?.categoryId || product?.category?.id || "",
    image: product?.image || "",
    imagePreview: product?.image ? (product.image.includes("unsplash") ? product.image : `${BACKEND_URL}${product.image}`) : null,
  });

  const { mutate: create } = trpc.useMutation("post", "/products");
  const { mutate: update } = trpc.useMutation("put", "/products/{id}");

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      name: form.name,
      nameRu: form.nameRu,
      nameEn: form.nameEn,
      description: form.description,
      descriptionRu: form.descriptionRu || undefined,
      descriptionEn: form.descriptionEn || undefined,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      categoryId: form.category,
      image: form.image || 'https://via.placeholder.com/400',
    };
    const action = isNew ? create : update;
    const config = isNew
      ? { body: payload }
      : { params: { path: { id: (product?.id ?? '').toString() } }, body: payload };

    action(config as any, {
      onSuccess: () => {
        toast.success(isNew ? "Product created" : "Product updated");
        onSuccess();
      },
      onError: () => toast.error("Failed to save"),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8">
        <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold">{isNew ? "Add Product" : "Edit Product"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">✕</button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
          {/* Image URL */}
          <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          {form.imagePreview && <img src={form.imagePreview} className="w-24 h-24 object-cover rounded" />}

          {/* Name inputs */}
          <div className="grid grid-cols-3 gap-3">
            <input type="text" placeholder="Product Name (AZ)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            <input type="text" placeholder="Product Name (RU)" value={form.nameRu} onChange={e => setForm({ ...form, nameRu: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            <input type="text" placeholder="Product Name (EN)" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="number" placeholder="Old Price" value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg bg-white">
              <option value="">Select Category</option>
              {Array.isArray(categories) && categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.labelAz}</option>)}
            </select>
          </div>

          {/* Descriptions */}
          <textarea placeholder="Description (AZ)" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <textarea placeholder="Description (RU)" rows={2} value={form.descriptionRu} onChange={e => setForm({ ...form, descriptionRu: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <textarea placeholder="Description (EN)" rows={2} value={form.descriptionEn} onChange={e => setForm({ ...form, descriptionEn: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />

        </div>

        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            {isNew ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
