// components/admin/ProductForm.tsx
import { useState, useRef } from "react";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";
import { mediaUrl, uploadImage } from "~/lib/site-settings";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

type ProductFormState = {
  id: string | number;
  name: string;
  nameRu: string;
  nameEn: string;
  description: string;
  descriptionRu: string;
  descriptionEn: string;
  price: string;
  oldPrice: string;
  rating: string;
  category: string;
  image: string;
  imagePreview: string | null;
  galleryImages: string[];
  inStock: boolean;
};

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isNew = !product;
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: categories } = trpc.useQuery("get", "/categories");

  const [form, setForm] = useState<ProductFormState>({
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
      ? product.image.startsWith("http")
        ? product.image
        : mediaUrl(product.image)
      : null,
    galleryImages: Array.isArray(product?.images) ? product.images : [],
    inStock: product?.inStock !== false,
  });
  const [uploadingCount, setUploadingCount] = useState(0);

  const { mutate: create } = (trpc as any).useMutation("post", "/products");
  const { mutate: update } = trpc.useMutation("put", "/products/{id}");

  const isUploading = uploadingCount > 0;

  const runUpload = async <T,>(task: () => Promise<T>) => {
    setUploadingCount((count) => count + 1);
    try {
      return await task();
    } finally {
      setUploadingCount((count) => Math.max(0, count - 1));
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const previousPreview = form.imagePreview;
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imagePreview: previewUrl }));

    try {
      const { url } = await runUpload(() => uploadImage(file));
      setForm((prev) => ({
        ...prev,
        image: url,
        imagePreview: mediaUrl(url),
      }));
      toast.success("Main image uploaded");
    } catch (error) {
      setForm((prev) => ({ ...prev, imagePreview: previousPreview }));
      toast.error(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleGallerySelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;

    try {
      const uploaded = await runUpload(async () => {
        const results = await Promise.all(
          files.map((file) => uploadImage(file)),
        );
        return results.map((result) => result.url);
      });

      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploaded],
      }));
      toast.success("Gallery images uploaded");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gallery upload failed",
      );
    }
  };

  const removeGalleryImage = (image: string) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((item) => item !== image),
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.category || !form.image) {
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
      image: form.image,
      inStock: form.inStock,
      categoryId: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      rating: form.rating ? Number(form.rating) : undefined,
      images: form.galleryImages,
    };
    const action = isNew ? create : update;
    const config = isNew
      ? {
          body: payload,
          onSuccess: () => {
            toast.success("Product created");
            onSuccess();
          },
        }
      : {
          params: { path: { id: form.id.toString() } },
          body: payload,
          onSuccess: () => {
            toast.success("Product updated");
            onSuccess();
          },
        };

    action(config as any, { onError: () => toast.error("Failed to save") });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8">
        <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold">
            {isNew ? "Add Product" : "Edit Product"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
          {/* Image Upload */}
          <div className="flex gap-4">
            <div
              className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer bg-gray-50"
              onClick={() => !isUploading && fileRef.current?.click()}
            >
              {form.imagePreview ? (
                <img
                  src={form.imagePreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                  📷
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
            <div className="flex-1 space-y-3">
              <input
                type="text"
                placeholder="Product Name (AZ)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Product Name (RU)"
                value={form.nameRu}
                onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Product Name (EN)"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Old Price"
              value={form.oldPrice}
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Rating"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border rounded-lg bg-white"
            >
              <option value="">Select Category</option>
              {Array.isArray(categories) &&
                categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.labelAz}
                  </option>
                ))}
            </select>
          </div>

          {/* Descriptions */}
          <textarea
            placeholder="Description (AZ)"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Description (RU)"
            rows={2}
            value={form.descriptionRu}
            onChange={(e) =>
              setForm({ ...form, descriptionRu: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Description (EN)"
            rows={2}
            value={form.descriptionEn}
            onChange={(e) =>
              setForm({ ...form, descriptionEn: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Gallery images
            </label>
            <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm font-medium text-gray-600 hover:border-[#0080e8] hover:text-[#0080e8]">
              Upload gallery images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGallerySelect}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            {form.galleryImages.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {form.galleryImages.map((image) => (
                  <div
                    key={image}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
                  >
                    <img
                      src={mediaUrl(image)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(image)}
                      className="absolute right-1 top-1 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">In Stock</span>
          </label>
        </div>

        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-4 py-2 bg-[#0080e8] text-white rounded-lg hover:bg-[#0080e8]/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : isNew ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
