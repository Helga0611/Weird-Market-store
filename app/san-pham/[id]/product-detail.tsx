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
  const [shareOpen, setShareOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [shareNote, setShareNote] = useState(`Vừa săn được món này ở Chợ Kỳ Kỳ, độc lạ lắm xem thử đi!`);
  const [selectedAura, setSelectedAura] = useState("Tím tinh vân");
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

  const copyShare = async () => {
    await navigator.clipboard.writeText(`${shareNote}\n${location.href}`);
    setNotice("Đã chép lời mời và đường link");
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(`Một món kỳ lạ dành cho bạn: ${product.name}`);
    const body = encodeURIComponent(`${shareNote}\n\n${product.name}\n${location.href}`);
    window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="detail-page">
      <header className="detail-nav">
        <Link className="detail-brand" href="/"><img src="/products/ky-la-coin-purple-v2.png" alt="" /><span>Chợ Kỳ Kỳ</span></Link>
        <div><Link className="continue-market" href="/#san-pham"><span>←</span> Tiếp tục đi chợ</Link><Link className="detail-cart" href="/thanh-toan">Giỏ phép thuật <b>{cartCount}</b></Link></div>
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
          <div className="aura-picker">
            <span>Chọn hào quang</span>
            <div>{["Tím tinh vân", "Hồng cực quang", "Xanh đá mặt trăng"].map((aura) => <button key={aura} className={selectedAura === aura ? "active" : ""} onClick={() => setSelectedAura(aura)}>{aura}</button>)}</div>
          </div>
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
          <button className="share-detail" onClick={() => setShareOpen(true)}>Gửi món này cho bạn bè ↗</button>
          <div className="commerce-notes">
            <span>Giao trước khi phép hết tác dụng</span>
            <span>Đổi trả trong 7 đêm trăng</span>
            <span>Thanh toán an toàn bằng Xu Kỳ Lạ</span>
          </div>
          <section className="seller-card">
            <div className="seller-orb">✦</div>
            <div><small>Được bán bởi</small><h3>Tiệm Phù Thuỷ Có Hoá Đơn</h3><p>98% phản hồi tích cực · trả lời trong 3 nhịp đũa</p></div>
            <button>Ghé gian hàng</button>
          </section>
          <div className="product-facts">
            <details open><summary>Mô tả độ kỳ lạ</summary><p>{product.longDescription} Mỗi món được niêm phong bằng một lớp bụi sao có mã truy vết riêng.</p></details>
            <details><summary>Vận chuyển & đổi trả</summary><p>Miễn phí giao bằng chổi. Được kiểm tra hào quang khi nhận và đổi trong 7 đêm trăng nếu phép không tương thích.</p></details>
            <details><summary>Bảo chứng Chợ Kỳ Kỳ</summary><p>Xu chỉ được chuyển cho người bán sau khi bạn xác nhận món đồ đã đến đúng chiều không gian.</p></details>
          </div>
        </div>
      </section>
      {shareOpen && (
        <div className="share-modal-layer" onMouseDown={() => setShareOpen(false)}>
          <section className="share-modal liquid-glass" onMouseDown={(event) => event.stopPropagation()}>
            <button className="share-close" onClick={() => setShareOpen(false)} aria-label="Đóng">×</button>
            <span className="share-sigil">✦</span>
            <p>Gửi một lời mời kỳ lạ</p>
            <h2>Cho bạn bè xem<br />món đồ này.</h2>
            <label>Email người nhận<input value={recipient} onChange={(event) => setRecipient(event.target.value)} type="email" placeholder="banthan@thegioi.vn" /></label>
            <label>Lời nhắn<textarea value={shareNote} onChange={(event) => setShareNote(event.target.value)} /></label>
            <label>Đường link<input readOnly value={typeof window === "undefined" ? "" : window.location.href} /></label>
            <div className="share-actions"><button onClick={copyShare}>Sao chép link</button><button disabled={!recipient} onClick={sendEmail}>Mở email để gửi ↗</button></div>
            <small>Email sẽ được gửi bằng ứng dụng mail của bạn. Chợ Kỳ Kỳ không lưu địa chỉ người nhận.</small>
          </section>
        </div>
      )}
      {notice && <div className="detail-toast">{notice}</div>}
    </main>
  );
}
