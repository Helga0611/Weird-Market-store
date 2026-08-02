import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { money, PRODUCTS, STORES } from "../../products";
import "./store.css";

export function generateStaticParams() {
  return STORES.map((store) => ({ slug: store.slug }));
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = STORES.find((item) => item.slug === slug);
  if (!store) notFound();
  const products = PRODUCTS.filter((product) => product.vendorSlug === slug);

  return (
    <main className="store-page">
      <header className="store-nav"><Link href="/"><img src="/products/cho-ky-ky-logo.png" alt="" /><span>Chợ Kỳ Kỳ</span></Link><Link href="/#san-pham">← Tiếp tục đi chợ</Link></header>
      <section className="store-hero">
        <div className="store-moon">☾<i>✦</i></div>
        <div><p>Gian hàng được bảo chứng</p><h1>{store.name}</h1><span>{store.blurb}</span></div>
        <aside><b>4.9</b><span>★★★★★</span><small>98% phản hồi tích cực<br />{products.length} vật phẩm đang bán</small></aside>
      </section>
      <section className="store-toolbar"><div><span>✦</span><p><b>Chủ tiệm đang online</b>Trả lời trong khoảng 3 nhịp đũa</p></div><Button color="primary" size="md">Theo dõi gian hàng</Button></section>
      <section className="store-catalog"><div className="store-title"><p>Bộ sưu tập của tiệm</p><h2>Món lạ đang lên kệ.</h2><span>{products.length} sản phẩm</span></div>
        <div className="store-grid">{products.map((product) => <article key={product.id}><Link href={`/san-pham/${product.id}`}><img src={product.image} alt={product.name} /></Link><small>{product.category}</small><h3><Link href={`/san-pham/${product.id}`}>{product.name}</Link></h3><p>{product.description}</p><footer><b>{money(product.price)} Xu</b><Link href={`/san-pham/${product.id}`}>Xem món <span>→</span></Link></footer></article>)}</div>
      </section>
    </main>
  );
}
