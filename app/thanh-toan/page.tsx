"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { CartItem, money } from "../products";
import "./checkout.css";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("kyky-cart") || "[]"));
    const account = Boolean(localStorage.getItem("kyky-account"));
    setLoggedIn(account);
    setBalance(Number(localStorage.getItem("kyky-balance") || 0));
  }, []);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const update = (id: number, amount: number) => {
    const updated = cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0);
    setCart(updated);
    localStorage.setItem("kyky-cart", JSON.stringify(updated));
  };

  const authenticate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem("kyky-account", "true");
    localStorage.setItem("kyky-balance", "5000");
    setLoggedIn(true);
    setBalance(5000);
    setMessage("Tài khoản đã sẵn sàng. Ví được tặng 5.000 Xu Kỳ Lạ.");
  };

  const pay = () => {
    if (total > balance) {
      setMessage(`Bạn còn thiếu ${money(total - balance)} Xu. Hãy bỏ bớt một món hoặc quay lại sau.`);
      return;
    }
    const nextBalance = balance - total;
    const order = {
      id: `KK-${Date.now().toString().slice(-8)}`,
      createdAt: Date.now(),
      items: cart,
      total,
      status: "confirmed"
    };
    localStorage.setItem("kyky-last-order", JSON.stringify(order));
    localStorage.setItem("kyky-balance", String(nextBalance));
    localStorage.setItem("kyky-cart", "[]");
    setBalance(nextBalance);
    setCart([]);
    setComplete(true);
  };

  return (
    <main className="checkout-page">
      <header className="checkout-nav"><Link href="/"><img src="/products/ky-la-coin-purple-v2.png" alt="" />Chợ Kỳ Kỳ</Link><Link href="/#san-pham">Tiếp tục đi chợ</Link></header>
      <section className="checkout-shell">
        <div className="checkout-title"><p>Thanh toán bằng phép màu</p><h1>Giỏ đồ kỳ lạ<br />của bạn.</h1></div>
        {complete ? (
          <div className="checkout-success"><img src="/products/ky-la-coin-purple-v2.png" alt="" /><h2>Phép thanh toán đã hoàn tất.</h2><p>Số Xu còn lại: <strong>{money(balance)}</strong>. Cây chổi giao hàng đã đánh hơi thấy địa chỉ của bạn.</p><div><Link className="track-order-link" href="/don-hang">Theo dõi cây chổi giao hàng ✦</Link><Link href="/">Về lại Chợ Kỳ Kỳ</Link></div></div>
        ) : (
          <div className="checkout-grid">
            <div className="checkout-items">
              {cart.length ? cart.map((item) => (
                <article key={item.id}><img src={item.image} alt="" /><div><span>{item.category}</span><h2>{item.name}</h2><strong>{money(item.price)} Xu</strong></div><div className="checkout-qty"><Button color="ghost" size="xs" onClick={() => update(item.id,-1)} aria-label={`Giảm số lượng ${item.name}`}>−</Button><b>{item.quantity}</b><Button color="ghost" size="xs" onClick={() => update(item.id,1)} aria-label={`Tăng số lượng ${item.name}`}>+</Button></div></article>
              )) : <div className="checkout-empty"><h2>Giỏ hàng đang rất bình thường.</h2><p>Chưa có món kỳ lạ nào chờ thanh toán.</p><Link href="/#san-pham">Đi chọn một món</Link></div>}
            </div>
            <aside className="order-card">
              <div className="wallet"><img src="/products/ky-la-coin-purple-v2.png" alt="" /><div><span>Số dư hiện tại</span><strong>{loggedIn ? money(balance) : "Chưa đăng nhập"} <small>{loggedIn ? "Xu" : ""}</small></strong></div></div>
              <div className="order-lines"><span>Tạm tính <b>{money(total)} Xu</b></span><span>Phí vận chuyển bằng chổi <b>0 Xu</b></span><span className="order-total">Tổng cộng <b>{money(total)} Xu</b></span></div>
              {!loggedIn ? <form onSubmit={authenticate}><h3>Đăng ký hoặc đăng nhập</h3><p>Tài khoản mới nhận ngay 5.000 Xu.</p><label>Email<input required type="email" placeholder="ban@kyky.vn" /></label><label>Mật khẩu<input required type="password" minLength={6} placeholder="Ít nhất 6 ký tự" /></label><Button color="primary" size="lg" type="submit">Tiếp tục và nhận Xu</Button></form> : <Button color="primary" size="lg" className="pay-button" disabled={!cart.length} onClick={pay}>Xác nhận thanh toán ✦</Button>}
              {message && <p className="checkout-message">{message}</p>}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
