import { notFound } from "next/navigation";
import { PRODUCTS } from "../../products";
import ProductDetail from "./product-detail";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: String(product.id) }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = PRODUCTS.find((item) => item.id === Number(id));
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
