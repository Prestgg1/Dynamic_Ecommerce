import { useState, useRef } from "react";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isNew = !product;
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: categories } = trpc.useQuery("get", "/categories");

  const [form, setForm] = useState({
    id: product?.id || "",
    name: product?.name || "",
    nameRu: product?.nameRu || "",
    nameEn: product?.nameEn || "",
    description: product?.description || "",
    descriptionRu: product?.descriptionRu || "",
    descriptionEn: product?.descriptionEn || "",
    price: product?.price?.toString() || "",
    oldPrice: product?.oldPrice?.toString() || "",
    rating: product?.rating?.toString() || "",
    category: product?.categoryId || product?.category?.id || "",
    image: product?.image || "",
    imagePreview: product?.image
      ? product.image.includes("unsplash")
        ? product.image
        : `http://localhost:4000${product.image}`
      : null,
    inStock: product?.inStock !== false,
  });

  const { mutate: create } = trpc.useMutation("post", "/products");
  const { mutate: update } = trpc.useMutation("patch", "/products/{id}");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setForm((prev) => ({
          ...prev,
          imagePreview: reader.result as string,
          image: file.name,
        }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      name: form.name,
      nameRu: form.nameRu,
      nameEn: form.nameEn,
      description: form.description,
      descriptionRu: form.descriptionRu,
      descriptionEn: form.descriptionEn,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      rating: form.rating ? Number(form.rating) : null,
      categoryId: form.category,
      inStock: form.inStock,
    };

    try {
      if (isNew) {
        create(
          { body: payload },
          {
            onSuccess: () => {
              toast.success("Product created successfully");
              onSuccess();
              onClose();
            },
            onError: (error: any) => {
              toast.error(error?.message || "Failed to create product");
            },
          },
        );
      } else {
        update(
          {
            params: { path: { id: form.id } },
            body: payload,
          },
          {
            onSuccess: () => {
              toast.success("Product updated successfully");
              onSuccess();
              onClose();
            },
            onError: (error: any) => {
              toast.error(error?.message || "Failed to update product");
            },
          },
        );
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-4 md:my-8 shadow-2xl">
        <div className="p-4 md:p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl gap-4">
          <h3 className="text-lg md:text-2xl font-bold text-gray-900">
            {isNew ? "Add Product" : "Edit Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
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

        <div className="p-4 md:p-6 space-y-4 md:space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Image Upload */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors flex-shrink-0 mx-auto sm:mx-0"
              onClick={() => fileRef.current?.click()}
            >
              {form.imagePreview ? (
                <img
                  src={form.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <div className="flex-1 space-y-2 md:space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Product Name (AZ) *
                </label>
                <input
                  type="text"
                  placeholder="Enter product name in Azerbaijani"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Product Name (RU)
                </label>
                <input
                  type="text"
                  placeholder="Введите название товара"
                  value={form.nameRu}
                  onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Product Name (EN)
                </label>
                <input
                  type="text"
                  placeholder="Enter product name in English"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Price (AZN) *
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Old Price (AZN)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={form.oldPrice}
                onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Rating
              </label>
              <input
                type="number"
                placeholder="0.0"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-sm"
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) &&
                  categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.labelAz || cat.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Description (AZ)
            </label>
            <textarea
              placeholder="Enter product description in Azerbaijani"
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Description (RU)
            </label>
            <textarea
              placeholder="Введите описание товара"
              rows={2}
              value={form.descriptionRu}
              onChange={(e) =>
                setForm({ ...form, descriptionRu: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Description (EN)
            </label>
            <textarea
              placeholder="Enter product description in English"
              rows={2}
              value={form.descriptionEn}
              onChange={(e) =>
                setForm({ ...form, descriptionEn: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
            />
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">In Stock</span>
          </label>
        </div>

        <div className="p-4 md:p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 md:gap-3 sticky bottom-0 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors shadow-lg shadow-orange-500/20 text-sm md:text-base"
          >
            {isNew ? "Create Product" : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
