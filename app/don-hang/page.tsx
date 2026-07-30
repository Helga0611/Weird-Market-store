"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartItem, money } from "../products";
import "./tracking.css";

type Order = { id: string; createdAt: number; items: CartItem[]; total: number; status: string };

const steps = [
  { icon: "✦", title: "Đã niêm phong đơn", copy: "Xu đã được giữ an toàn trong két pha lê." },
  { icon: "⌁", title: "Tiệm đang đóng gói", copy: "Sản phẩm được quấn ba lớp bùa chống thất lạc." },
  { icon: "➶", title: "Cây chổi đang bay", copy: "Đơn hàng đã qua cổng mây và đang tiến về phía bạn." },
  { icon: "⌂", title: "Giao thành công", copy: "Kiện hàng đã đáp xuống đúng chiều không gian." }
];

export default function TrackingPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const raw = localStorage.getItem("kyky-last-order");
    if (raw) setOrder(JSON.parse(raw));
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const active = useMemo(() => order ? Math.min(3, Math.floor((now - order.createdAt) / 8000)) : 0, [now, order]);
  const eta = Math.max(0, 24 - Math.floor(((order ? now - order.createdAt : 0) / 1000)));

  if (!order) return <main className="tracking-page"><div className="tracking-empty"><span>⌁</span><h1>Chưa thấy cây chổi nào.</h1><p>Hãy đặt một món kỳ lạ trước, phép theo dõi sẽ tự xuất hiện ở đây.</p><Link href="/#san-pham">Đi tới khu chợ</Link></div></main>;

  return (
    <main className="tracking-page">
      <header className="tracking-nav"><Link href="/"><img src="/products/ky-la-coin-purple-v2.png" alt="" />Chợ Kỳ Kỳ</Link><Link href="/#san-pham">← Tiếp tục đi chợ</Link></header>
      <section className="tracking-shell">
        <div className="tracking-heading"><p>Phép truy vết đơn hàng</p><h1>{active === 3 ? "Cây chổi đã đáp." : "Món đồ đang bay tới."}</h1><div><span>Mã đơn <b>{order.id}</b></span><span>{active === 3 ? "Đã giao" : `Dự kiến tới sau ${eta} giây`}</span></div></div>
        <div className="tracking-grid">
          <section className="flight-card">
            <div className="moon">☾</div><div className={`flying-broom stage-${active}`}>➶<i>✦</i><i>✧</i></div>
            <div className="route"><span>Tiệm phép</span><b /><span>Nhà bạn</span></div>
          </section>
          <aside className="order-summary"><small>Trong kiện hàng</small>{order.items.map((item) => <article key={item.id}><img src={item.image} alt="" /><div><h3>{item.name}</h3><span>{item.quantity} × {money(item.price)} Xu</span></div></article>)}<footer><span>Tổng phép phí</span><b>{money(order.total)} Xu</b></footer></aside>
        </div>
        <section className="tracking-timeline">{steps.map((step, index) => <article key={step.title} className={index <= active ? "done" : ""}><div>{step.icon}</div><span /><section><small>{index < active ? "Hoàn tất" : index === active ? "Đang diễn ra" : "Chờ phép"}</small><h2>{step.title}</h2><p>{step.copy}</p></section></article>)}</section>
        {active === 3 && <section className="weird-success"><div>✦</div><p>Giao thành công</p><h2>Đừng lo nếu kiện hàng<br />đang thì thầm tên bạn.</h2><span>Đó là cách món đồ xác nhận đúng chủ nhân. Nếu nó bắt đầu hát lúc 3 giờ sáng, hãy cho nó một ít ánh trăng.</span><Link href="/#san-pham">Săn thêm một món kỳ lạ</Link></section>}
      </section>
    </main>
  );
}
