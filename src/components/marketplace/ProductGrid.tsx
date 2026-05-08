import type { Product } from "@/types/product";
import ProductCard from "@/components/marketplace/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-500">
          No hay productos disponibles por ahora.
        </p>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="h-full">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
