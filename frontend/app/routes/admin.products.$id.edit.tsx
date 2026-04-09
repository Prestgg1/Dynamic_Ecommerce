// routes/admin/products.$id.edit.tsx
import { useParams, useNavigate } from "react-router";
import { trpc } from "~/lib/trpc";
import { ProductForm } from "~/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const { data: product, isLoading } = trpc.useQuery("get", "/products", {
    enabled: !isNew,
    select: (data) => Array.isArray(data) ? data.find((p: any) => p.id.toString() === id) : null,
  });

  if (isLoading && !isNew) return <div className="p-8 text-center"><Spinner /></div>;

  return (
    <ProductForm
      product={isNew ? null : product}
      onClose={() => navigate("/admin/products")}
      onSuccess={() => navigate("/admin/products")}
    />
  );
}

function Spinner() {
  return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />;
}
