"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import "./cho-ky-ky.css";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  users: number;
  usage: string;
  position: string;
};

type CartItem = Product & { quantity: number };

const PRODUCTS: Product[] = [
  { id: 1, name: "Băng dính hàn gắn tình bạn", category: "Đồ gia dụng tâm linh", price: 50, description: "Dán một đường, hết giận một đời. Không áp dụng cho hội bạn quên trả tiền.", users: 12300, usage: "người đã dùng", position: "0% 0%" },
  { id: 2, name: "Chong chóng tre bay", category: "Phương tiện giao thông", price: 250, description: "Lên trời trong ba vòng quay. Tóc rối là một phần của trải nghiệm.", users: 8100, usage: "người đang bay", position: "25% 0%" },
  { id: 3, name: "Cánh cửa thần kỳ", category: "Bất động sản dịch chuyển", price: 9999, description: "Mở ra bất cứ đâu, trừ nơi bạn thật sự cần đến đúng giờ.", users: 150, usage: "người sở hữu", position: "50% 0%" },
  { id: 4, name: "Kính lúp nhìn thấu lòng người", category: "Thiết bị y tế tình cảm", price: 500, description: "Phóng đại tín hiệu thả tim và soi rõ những lần xem mà không trả lời.", users: 3400, usage: "người đã soi", position: "75% 0%" },
  { id: 5, name: "Thuốc xịt tàng hình gặp người yêu cũ", category: "Mỹ phẩm phòng thân", price: 120, description: "Một lần xịt, biến mất vừa đủ lâu để rẽ sang lối khác.", users: 25000, usage: "người đã thoát", position: "100% 0%" },
  { id: 6, name: "Gối ôm kể chuyện nói xấu sếp", category: "Nội thất văn phòng", price: 180, description: "Thì thầm đúng chuyện bạn muốn nghe. Có chế độ im lặng khi sếp đi qua.", users: 14200, usage: "người đang nghe", position: "0% 100%" },
  { id: 7, name: "Đôi dép vấp ngã vào định mệnh", category: "Thời trang xu hướng", price: 90, description: "Mỗi cú vấp là một cơ hội gặp đúng người, sai thời điểm.", users: 19800, usage: "người đã vấp", position: "25% 100%" },
  { id: 8, name: "Trà sữa không bao giờ béo", category: "Ẩm thực thần kỳ", price: 35, description: "Trân châu gấp đôi, cảm giác tội lỗi bằng không. Khoa học xin phép đứng ngoài.", users: 85000, usage: "người đã uống", position: "50% 100%" },
  { id: 9, name: "Vé xe buýt đi thẳng đến tương lai", category: "Du lịch tâm linh", price: 1500, description: "Một chiều tới ngày mai. Không hoàn vé nếu tương lai hơi thất vọng.", users: 600, usage: "người đã đi", position: "75% 100%" },
  { id: 10, name: "Cây bút tự động làm bài tập", category: "Văn phòng phẩm cứu sinh", price: 300, description: "Viết nhanh, chữ đẹp, đôi lúc tự thêm lời nhắn xin cô thông cảm.", users: 45000, usage: "học sinh tin dùng", position: "100% 100%" },
];

const money = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

export default function Home() {
  const [products, setProducts] = useState(PRODUCTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả danh mục");
  const [sort, setSort] = useState("Nổi bật");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const seen = localStorage.getItem("kyky-account");
    if (seen) {
      setLoggedIn(true);
      setBalance(Number(localStorage.getItem("kyky-balance") || 5000));
    }
  }, []);

  useEffect(() => {
    if (loggedIn) localStorage.setItem("kyky-balance", String(balance));
  }, [balance, loggedIn]);

  const categories = useMemo(() => ["Tất cả danh mục", ...new Set(products.map((p) => p.category))], [products]);
  const visible = useMemo(() => {
    const result = products.filter((p) =>
      (category === "Tất cả danh mục" || p.category === category) &&
      `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "Giá thấp trước") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "Phổ biến nhất") return [...result].sort((a, b) => b.users - a.users);
    return result;
  }, [products, query, category, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const addToCart = (product: Product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    toast(`Đã bỏ “${product.name}” vào giỏ`);
  };

  const updateQuantity = (id: number, amount: number) => {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  };

  const register = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoggedIn(true);
    setBalance(5000);
    localStorage.setItem("kyky-account", "true");
    setAuthOpen(false);
    toast("Chào mừng! 5.000 Xu Kỳ Lạ đã vào ví.");
  };

  const checkout = () => {
    if (!loggedIn) {
      setCartOpen(false);
      setAuthOpen(true);
      toast("Đăng nhập để thanh toán bằng Xu Kỳ Lạ");
      return;
    }
    if (total > balance) {
      toast(`Bạn còn thiếu ${money(total - balance)} Xu`);
      return;
    }
    setBalance((value) => value - total);
    setCart([]);
    setCartOpen(false);
    toast("Thanh toán thành công. Đồ kỳ lạ đang lên đường!");
  };

  const share = async (product: Product) => {
    const text = `Vừa săn được “${product.name}” ở Chợ Kỳ Kỳ, độc lạ lắm xem thử đi! ${location.href}#san-pham`;
    const canShare = typeof navigator.share === "function";
    try {
      if (canShare) await navigator.share({ title: product.name, text, url: location.href });
      else await navigator.clipboard.writeText(text);
      toast(canShare ? "Đã mở bảng chia sẻ" : "Đã chép lời mời vào bộ nhớ");
    } catch {
      toast("Lời mời vẫn nằm đây, thử lại nhé");
    }
  };

  const submitProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Product = {
      id: Date.now(),
      name: String(data.get("name")),
      category: String(data.get("category")),
      price: Number(data.get("price")),
      description: String(data.get("description")),
      users: 0,
      usage: "người vừa khám phá",
      position: "100% 100%",
    };
    setProducts((current) => [next, ...current]);
    setVendorOpen(false);
    toast("Đã gửi duyệt. Bản demo cho sản phẩm lên kệ ngay!");
  };

  return (
    <main className="kyky">
      <header className="nav-wrap">
        <nav className="liquid-glass nav">
          <a className="brand" href="#"><span className="brand-mark">K</span><span>Chợ Kỳ Kỳ</span></a>
          <div className="nav-links"><a href="#san-pham">Khám phá</a><a href="#cach-cho-chay">Chợ vận hành</a></div>
          <div className="nav-actions">
            {loggedIn && <span className="balance"><i>◉</i> {money(balance)} Xu</span>}
            <button className="text-button vendor-nav" onClick={() => setVendorOpen(true)}>Mở gian hàng</button>
            <button className="text-button login" onClick={() => setAuthOpen(true)}>{loggedIn ? "Tài khoản" : "Đăng nhập"}</button>
            <button className="icon-button cart-button" onClick={() => setCartOpen(true)} aria-label="Mở giỏ hàng">⌁<b>{cartCount}</b></button>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-copy">
          <p className="eyebrow">Sàn thương mại điện tử không bình thường</p>
          <h1>Chợ không thiếu thứ gì,<br /><em>chỉ thiếu đồ bình thường.</em></h1>
          <p className="hero-sub">Mua chuyện lạ bằng Xu Kỳ Lạ. Giao hàng thật, công dụng thì chưa chắc.</p>
          <div className="hero-actions">
            <a href="#san-pham" className="primary-button">Đi chợ ngay <span>↘</span></a>
            <button className="glass-button" onClick={() => setVendorOpen(true)}>Bán đồ kỳ lạ</button>
          </div>
        </div>
        <div className="hero-visual" aria-label="Bộ sưu tập sản phẩm kỳ lạ">
          <div className="orb orb-one"><div className="sprite" style={{ backgroundPosition: "0% 0%" }} /></div>
          <div className="orb orb-two"><div className="sprite" style={{ backgroundPosition: "50% 100%" }} /></div>
          <div className="orb orb-three"><div className="sprite" style={{ backgroundPosition: "50% 0%" }} /></div>
          <div className="hero-sticker">10+<small>món lạ<br />đã lên kệ</small></div>
        </div>
      </section>

      <section className="ticker" aria-label="Cam kết của Chợ Kỳ Kỳ">
        <div>Độc lạ có bảo chứng <span>✦</span> 5.000 Xu cho người mới <span>✦</span> Giao nhanh trước khi bạn đổi ý <span>✦</span> Độc lạ có bảo chứng <span>✦</span></div>
      </section>

      <section className="market" id="san-pham">
        <div className="section-heading">
          <div><p>Gian hàng kỳ tuyển</p><h2>Hôm nay bạn cần<br />kỳ lạ đến mức nào?</h2></div>
          <strong>{visible.length.toString().padStart(2, "0")} món đang chờ chủ</strong>
        </div>

        <div className="filters liquid-glass">
          <label className="search"><span>⌕</span><input aria-label="Tìm sản phẩm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm một thứ không bình thường..." /></label>
          <label><span className="sr-only">Danh mục</span><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Sắp xếp</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Nổi bật</option><option>Giá thấp trước</option><option>Phổ biến nhất</option></select></label>
        </div>

        {visible.length ? (
          <div className="product-grid">
            {visible.map((product, index) => (
              <article className={`product-card card-${index % 3}`} key={product.id}>
                <div className="product-image">
                  <div className="sprite" style={{ backgroundPosition: product.position }} role="img" aria-label={`Ảnh AI minh họa ${product.name}`} />
                  <button className="share-button" onClick={() => share(product)} aria-label={`Gửi ${product.name} cho bạn bè`}>↗</button>
                </div>
                <div className="product-meta"><span>{product.category}</span><span>{money(product.users)} {product.usage}</span></div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-bottom"><strong>{money(product.price)} <small>Xu</small></strong><button onClick={() => addToCart(product)}>Thêm vào giỏ <span>+</span></button></div>
              </article>
            ))}
          </div>
        ) : <div className="empty"><h3>Chưa tìm thấy món nào kỳ đến vậy.</h3><button onClick={() => { setQuery(""); setCategory("Tất cả danh mục"); }}>Xem tất cả sản phẩm</button></div>}
      </section>

      <section className="how" id="cach-cho-chay">
        <div className="how-visual"><div className="sprite" style={{ backgroundPosition: "75% 100%" }} /><span>5000</span></div>
        <div className="how-copy">
          <p>Xu Kỳ Lạ dùng thế nào?</p>
          <h2>Đăng ký một lần.<br />Kỳ lạ cả đời.</h2>
          <div className="steps">
            <div><b>Nhận Xu</b><span>Tài khoản mới có ngay 5.000 Xu để mở màn.</span></div>
            <div><b>Săn món lạ</b><span>Thêm vào giỏ và thanh toán trực tiếp bằng số dư.</span></div>
            <div><b>Tự mở chợ</b><span>Đăng món của bạn, chờ duyệt rồi lên kệ.</span></div>
          </div>
          <button className="primary-button" onClick={() => setAuthOpen(true)}>Nhận 5.000 Xu</button>
        </div>
      </section>

      <footer><a className="brand" href="#"><span className="brand-mark">K</span><span>Chợ Kỳ Kỳ</span></a><p>Chợ không thiếu thứ gì, chỉ thiếu đồ bình thường.</p><a href="#san-pham">Quay lại gian hàng ↑</a></footer>

      {notice && <div className="toast" role="status">{notice}</div>}

      {cartOpen && <div className="modal-layer" onMouseDown={() => setCartOpen(false)}>
        <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
          <div className="modal-head"><div><small>GIỎ ĐỒ KỲ LẠ</small><h2>{cartCount} món đang đợi</h2></div><button onClick={() => setCartOpen(false)}>×</button></div>
          <div className="cart-list">
            {cart.length === 0 ? <div className="cart-empty"><span>⌁</span><h3>Giỏ đang bình thường quá.</h3><p>Thêm vài món lạ rồi quay lại nhé.</p></div> : cart.map((item) => (
              <div className="cart-item" key={item.id}><div className="mini-sprite sprite" style={{ backgroundPosition: item.position }} /><div><h3>{item.name}</h3><span>{money(item.price)} Xu</span></div><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)}>−</button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.id, 1)}>+</button></div></div>
            ))}
          </div>
          <div className="checkout"><div><span>Tổng cộng</span><strong>{money(total)} Xu</strong></div><button disabled={!cart.length} onClick={checkout}>Thanh toán bằng Xu</button></div>
        </aside>
      </div>}

      {authOpen && <div className="modal-layer" onMouseDown={() => setAuthOpen(false)}>
        <div className="modal auth-modal" onMouseDown={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setAuthOpen(false)}>×</button>
          <span className="coin">K</span><p>HỘ CHIẾU VÀO CHỢ</p><h2>{loggedIn ? "Bạn đã là dân chợ." : "Tạo tài khoản, nhận ngay 5.000 Xu."}</h2>
          {loggedIn ? <><div className="account-balance">{money(balance)} <small>Xu Kỳ Lạ</small></div><button className="primary-button" onClick={() => setAuthOpen(false)}>Tiếp tục đi chợ</button></> :
          <form onSubmit={register}>
            <label>Họ và tên<input required placeholder="Nguyễn Kỳ Lạ" /></label>
            <label>Email<input type="email" required placeholder="ban@kyky.vn" /></label>
            <label>Mật khẩu<input type="password" required minLength={6} placeholder="Ít nhất 6 ký tự" /></label>
            <button type="submit">Đăng ký và nhận Xu</button>
            <small>Bằng cách tham gia, bạn đồng ý rằng đồ ở đây hơi kỳ.</small>
          </form>}
        </div>
      </div>}

      {vendorOpen && <div className="modal-layer" onMouseDown={() => setVendorOpen(false)}>
        <div className="modal vendor-modal" onMouseDown={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setVendorOpen(false)}>×</button><p>MỞ GIAN HÀNG</p><h2>Bạn có gì lạ?</h2>
          <form onSubmit={submitProduct}>
            <div className="form-grid">
              <label>Tên sản phẩm<input name="name" required placeholder="Ví dụ: Mũ nghe được suy nghĩ" /></label>
              <label>Danh mục<input name="category" required placeholder="Đồ công nghệ tâm linh" /></label>
              <label>Giá Xu<input name="price" type="number" min="1" required placeholder="250" /></label>
              <label>Ảnh minh họa<input name="image" type="file" accept="image/*" /></label>
            </div>
            <label>Mô tả độ kỳ lạ<textarea name="description" required placeholder="Nói rõ món này kỳ ở đâu và dùng để làm gì..." /></label>
            <button type="submit">Gửi duyệt sản phẩm</button>
          </form>
        </div>
      </div>}
    </main>
  );
}
