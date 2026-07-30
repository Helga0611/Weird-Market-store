"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CartItem, money, Product } from "../../products";
import "./product-detail.css";

export default function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.gallery[0]);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [notice, setNotice] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("kyky-cart") || "[]");
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const addToCart = () => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("kyky-cart") || "[]");
    const found = cart.find((item) => item.id === product.id);
    const updated = found
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cart, { ...product, quantity }];
    localStorage.setItem("kyky-cart", JSON.stringify(updated));
    setCartCount(updated.reduce((sum, item) => sum + item.quantity, 0));
    setNotice(`Đã thêm ${quantity} món vào giỏ phép thuật`);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const share = async () => {
    const text = `Vừa săn được “${product.name}” ở Chợ Kỳ Kỳ, độc lạ lắm xem thử đi! ${location.href}`;
    const canShare = typeof navigator.share === "function";
    try {
      if (canShare) await navigator.share({ title: product.name, text, url: location.href });
      else await navigator.clipboard.writeText(text);
      setNotice(canShare ? "Đã mở bảng chia sẻ" : "Đã chép lời mời");
    } catch {}
  };

  return (
    <main className="detail-page">
      <header className="detail-nav">
        <Link className="detail-brand" href="/"><img src="/products/ky-la-coin-3d.png" alt="" /><span>Chợ Kỳ Kỳ</span></Link>
        <div><Link href="/#san-pham">Tiếp tục đi chợ</Link><Link className="detail-cart" href="/thanh-toan">Giỏ phép thuật <b>{cartCount}</b></Link></div>
      </header>

      <section className="detail-shell">
        <div className="gallery">
          <motion.div className="gallery-main" key={activeImage} initial={reduceMotion ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .4 }}>
            <img src={activeImage} alt={`${product.name}, góc nhìn đang chọn`} />
            <span className="gallery-aura" />
          </motion.div>
          <div className="gallery-thumbs">
            {product.gallery.map((image, index) => (
              <button key={image} className={image === activeImage ? "active" : ""} onClick={() => setActiveImage(image)} aria-label={`Xem hình ${index + 1}`}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-copy">
          <Link className="back-link" href="/#san-pham">← Trở về gian hàng</Link>
          <p className="detail-category">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="detail-rating"><strong>{product.rating}</strong><span>★★★★★</span><i>{money(product.users)} {product.usage}</i></div>
          <p className="detail-description">{product.longDescription}</p>
          <div className="detail-tags">{product.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="witch-stats">
            <div><b>{money(product.users)}</b><span>phù thủy đã chọn</span></div>
            <i>✦</i>
            <div><b>{product.stock}</b><span>món còn trong kho</span></div>
          </div>
          <div className="detail-buy">
            <div className="detail-price"><strong>{money(product.price)}</strong><span>Xu Kỳ Lạ</span></div>
            <div className="quantity-picker"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><b>{quantity}</b><button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button></div>
          </div>
          <button className="magic-add" onClick={addToCart}><span>Thêm vào giỏ phép thuật</span><b>✦</b></button>
          <button className="share-detail" onClick={share}>Gửi món này cho bạn bè ↗</button>
          <div className="commerce-notes">
            <span>Giao trước khi phép hết tác dụng</span>
            <span>Đổi trả trong 7 đêm trăng</span>
            <span>Thanh toán an toàn bằng Xu Kỳ Lạ</span>
          </div>
        </div>
      </section>
      {notice && <div className="detail-toast">{notice}</div>}
    </main>
  );
}
