"use client";

import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import "./cho-ky-ky.css";
import { CartItem, money, Product, PRODUCTS } from "./products";
import MagicVideo from "./components/magic-video";
import { Button } from "@/components/base/buttons/button";

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setCount(100);
      const timeout = window.setTimeout(onComplete, 120);
      return () => window.clearTimeout(timeout);
    }

    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 1800, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else window.setTimeout(onComplete, 280);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete, reduceMotion]);

  const words = ["Tìm đồ lạ", "Gom phép màu", "Mở cửa chợ"];
  const wordIndex = Math.min(Math.floor(count / 34), 2);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-4%" }}
      transition={{ duration: .55, ease: [0.76, 0, 0.24, 1] }}
    >
      <span className="loading-brand">CHỢ KỲ KỲ</span>
      <AnimatePresence mode="wait">
        <motion.strong
          key={wordIndex}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: .35 }}
        >
          {words[wordIndex]}
        </motion.strong>
      </AnimatePresence>
      <b>{String(count).padStart(3, "0")}</b>
      <i><span style={{ transform: `scaleX(${count / 100})` }} /></i>
    </motion.div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState(PRODUCTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả danh mục");
  const [sort, setSort] = useState("Nổi bật");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [vendorOpen, setVendorOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");
  const [shownCount, setShownCount] = useState(24);
  const [fireball, setFireball] = useState<{ key: number; x: number; y: number; tx: number; ty: number; image: string } | null>(null);
  const [cartBurst, setCartBurst] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isLoading || reduceMotion || !pageRef.current) return;
    const context = gsap.context(() => {
      gsap.to(".ticker > div", { xPercent: -50, duration: 22.4, ease: "none", repeat: -1 });
    }, pageRef);
    return () => context.revert();
  }, [isLoading, reduceMotion]);

  useEffect(() => {
    const seen = localStorage.getItem("kyky-account");
    const savedCart = localStorage.getItem("kyky-cart");
    const savedProducts = localStorage.getItem("kyky-vendor-products");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedProducts) setProducts([...JSON.parse(savedProducts), ...PRODUCTS]);
    if (seen) {
      setLoggedIn(true);
      setBalance(Number(localStorage.getItem("kyky-balance") || 5000));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (loggedIn) localStorage.setItem("kyky-balance", String(balance));
  }, [balance, loggedIn]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("kyky-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

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

  const addToCart = (product: Product, event?: MouseEvent<HTMLButtonElement>) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    if (event) {
      const origin = event.currentTarget.getBoundingClientRect();
      const target = document.querySelector(".cart-button")?.getBoundingClientRect();
      if (target) {
        setFireball({ key: Date.now(), x: origin.left + origin.width / 2, y: origin.top + origin.height / 2, tx: target.left + target.width / 2, ty: target.top + target.height / 2, image: product.image });
        window.setTimeout(() => { setFireball(null); setCartBurst(true); }, 620);
        window.setTimeout(() => setCartBurst(false), 1280);
      }
    }
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
    const existingBalance = Number(localStorage.getItem("kyky-balance") || 0);
    const nextBalance = authMode === "register" ? 5000 : existingBalance || 5000;
    setBalance(nextBalance);
    localStorage.setItem("kyky-account", "true");
    localStorage.setItem("kyky-balance", String(nextBalance));
    setAuthOpen(false);
    toast(authMode === "register" ? "Chào mừng! 5.000 Xu Kỳ Lạ đã vào ví." : "Đăng nhập thành công. Chào mừng bạn quay lại!");
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

  const submitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const upload = data.get("image");
    let uploadedImage = "/products/wide-10-1.webp";
    if (upload instanceof File && upload.size) {
      uploadedImage = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(upload);
      });
    }
    const next: Product = {
      id: Date.now(),
      name: String(data.get("name")),
      category: String(data.get("category")),
      price: Number(data.get("price")),
      description: String(data.get("description")),
      longDescription: String(data.get("description")),
      users: 0,
      usage: "người vừa khám phá",
      image: uploadedImage,
      gallery: [uploadedImage, uploadedImage, uploadedImage, uploadedImage],
      tags: ["Mới lên kệ", "Đồ của dân chợ"],
      rating: 5,
      stock: 1,
      vendorSlug: "gian-hang-cua-ban",
      vendorName: "Gian Hàng Của Bạn",
      colors: ["Tím trăng khuyết", "Hồng sao băng", "Lam cực quang", "Lục đom đóm"],
    };
    setProducts((current) => {
      const updated = [next, ...current];
      const vendorItems = updated.filter((item) => item.id > 100);
      try { localStorage.setItem("kyky-vendor-products", JSON.stringify(vendorItems)); } catch {}
      return updated;
    });
    setVendorOpen(false);
    toast("Đã gửi duyệt. Bản demo cho sản phẩm lên kệ ngay!");
  };

  return (
    <>
    <AnimatePresence>{isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}</AnimatePresence>
    <main className={isLoading ? "kyky" : "kyky page-ready"} ref={pageRef}>
      <header className="nav-wrap">
        <nav className="liquid-glass nav">
          <a className="brand" href="#"><span className="brand-mark"><img src="/products/cho-ky-ky-logo.png" alt="" /></span><span>Chợ Kỳ Kỳ</span></a>
          <div className="nav-links"><a href="#san-pham">Sản phẩm</a><a href="#san-pham">Danh mục</a><a href="#cach-cho-chay">Cách hoạt động</a><Button color="ghost" size="xs" onClick={() => setVendorOpen(true)}>Bán đồ</Button></div>
          <div className="nav-actions">
            {loggedIn && <span className="balance"><img src="/products/ky-la-coin-purple-v2.png" alt="" /> {money(balance)} Xu</span>}
            <Button color="ghost" size="xs" className="text-button vendor-nav" onClick={() => setVendorOpen(true)}>Mở gian hàng</Button>
            <Button color="ghost" size="sm" className="text-button login account-button" onClick={() => setAuthOpen(true)}><img src="/products/witch-avatar.png" alt="" />{loggedIn ? "Tài khoản" : "Đăng nhập"}</Button>
            <Button color="ghost" size="sm" className={`icon-button cart-button ${cartBurst ? "burst" : ""}`} onClick={() => setCartOpen(true)} aria-label="Mở giỏ hàng">
              <img className="magic-cart-icon" src="/products/magic-cart-v2.png" alt="" />
              <span className="cart-flames" aria-hidden="true"><i /><i /><i /></span>
              <b>{cartCount}</b>
            </Button>
            <Button color="ghost" size="sm" className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(true)} aria-label="Mở menu"><i /><i /><i /></Button>
          </div>
        </nav>
        <AnimatePresence>
          {mobileMenuOpen && <motion.div className="mobile-menu-layer" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onMouseDown={() => setMobileMenuOpen(false)}>
            <motion.aside className="mobile-menu" initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }} transition={{ type:"spring",stiffness:260,damping:28 }} onMouseDown={(event) => event.stopPropagation()}>
              <div><a className="brand" href="#" onClick={() => setMobileMenuOpen(false)}><span className="brand-mark"><img src="/products/cho-ky-ky-logo.png" alt="" /></span><span>Chợ Kỳ Kỳ</span></a><Button color="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} aria-label="Đóng menu">×</Button></div>
              <nav aria-label="Menu di động"><a href="#san-pham" onClick={() => setMobileMenuOpen(false)}>Sản phẩm</a><a href="#san-pham" onClick={() => setMobileMenuOpen(false)}>Danh mục</a><a href="#cach-cho-chay" onClick={() => setMobileMenuOpen(false)}>Cách hoạt động</a></nav>
              <Button color="primary" size="lg" className="primary-button" onClick={() => { setMobileMenuOpen(false);setVendorOpen(true); }}>Mở gian hàng</Button>
              <Button color="secondary" size="lg" className="mobile-login" onClick={() => { setMobileMenuOpen(false);setAuthOpen(true); }}>{loggedIn ? `Tài khoản · ${money(balance)} Xu` : "Đăng nhập →"}</Button>
            </motion.aside>
          </motion.div>}
        </AnimatePresence>
      </header>

      <section className="hero">
        <MagicVideo />
        <div className="hero-video-overlay" />
        <div className="hero-shell">
          <div className="hero-copy anim-stagger" style={{ animationDelay: ".5s" }}>
            <h1>Chợ không thiếu thứ gì, <em>chỉ thiếu đồ bình thường.</em></h1>
            <p>Mua chuyện lạ bằng Xu Kỳ Lạ. Giao hàng thật, công dụng thì chưa chắc.</p>
          </div>
          <div className="hero-bottom">
            <div className="hero-bottom-cta anim-stagger" style={{ animationDelay: ".85s" }}>
              <a href="#san-pham" className="primary-button btn-cut"><b>Đi chợ ngay</b><span className="cta-arrow">→</span><i className="cta-spark">✦</i></a>
              <Button color="secondary" size="lg" className="secondary-hero-button btn-cut" onClick={() => setVendorOpen(true)}>Bán đồ <span aria-hidden="true">→</span></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Cam kết của Chợ Kỳ Kỳ">
        <div>+5.000 Xu cho dân chợ mới <span>✦</span> Đồ lạ có bảo chứng <span>✦</span> Giao nhanh bằng chổi phép <span>✦</span> Đổi trả trong 7 đêm trăng <span>✦</span> 100 món kỳ tuyển đang mở cửa <span>✦</span> +5.000 Xu cho dân chợ mới <span>✦</span> Đồ lạ có bảo chứng <span>✦</span> Giao nhanh bằng chổi phép <span>✦</span> Đổi trả trong 7 đêm trăng <span>✦</span> 100 món kỳ tuyển đang mở cửa <span>✦</span></div>
      </section>

      <section className="market" id="san-pham">
        <motion.div className="section-heading" initial={reduceMotion ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .8, ease: [0.25, 0.1, 0.25, 1] }}>
          <div><p>Gian hàng kỳ tuyển</p><h2>Hôm nay bạn cần<br />kỳ lạ đến mức nào?</h2></div>
          <strong>{visible.length.toString().padStart(2, "0")} món đang chờ chủ</strong>
        </motion.div>

        <div className="filters liquid-glass">
          <label className="search"><span>⌕</span><input aria-label="Tìm sản phẩm" value={query} onChange={(e) => { setQuery(e.target.value); setShownCount(24); }} placeholder="Tìm một thứ không bình thường..." /></label>
          <label><span className="sr-only">Danh mục</span><select value={category} onChange={(e) => { setCategory(e.target.value); setShownCount(24); }}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Sắp xếp</span><select value={sort} onChange={(e) => { setSort(e.target.value); setShownCount(24); }}><option>Nổi bật</option><option>Giá thấp trước</option><option>Phổ biến nhất</option></select></label>
        </div>

        {visible.length ? (
          <div className="product-grid">
            {visible.slice(0, shownCount).map((product, index) => (
              <motion.article
                className={`product-card card-${index % 3}`}
                data-category={product.category}
                key={product.id}
                initial={reduceMotion ? false : { opacity: 0, y: 38 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: .65, delay: (index % 3) * .07, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={reduceMotion ? undefined : { y: -8 }}
              >
                <Link className="product-image" href={`/san-pham/${product.id}`} aria-label={`Xem chi tiết ${product.name}`}>
                  <img className="product-art" src={product.image} alt={`Ảnh 3D kỳ ảo của ${product.name}`} />
                  <span className="product-shine" />
                  <span className="magic-particles" aria-hidden="true"><i>✦</i><i>♡</i><i>✧</i><i>♡</i><i>✦</i></span>
                </Link>
                <Button color="ghost" size="xs" className="share-button" onClick={() => share(product)} aria-label={`Gửi ${product.name} cho bạn bè`}>↗</Button>
                <div className="product-meta"><span>{product.category}</span><span>{money(product.users)} {product.usage}</span></div>
                <h3><Link href={`/san-pham/${product.id}`}><span>{product.name}</span><b aria-hidden="true">↗</b></Link></h3>
                <p>{product.description}</p>
                <div className="product-tags">{product.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="product-bottom"><strong>{money(product.price)} <small>Xu</small></strong><Button color="primary" size="sm" className="round-magic-button" onClick={(event) => addToCart(product, event)}>Thêm vào giỏ <span>+</span><i className="heart-float">♥ ♥ ♥</i></Button></div>
              </motion.article>
            ))}
            {shownCount < visible.length && <Button color="secondary" size="lg" className="load-more" onClick={() => setShownCount((count) => count + 24)}>Mở thêm 24 món kỳ lạ <span>↓</span></Button>}
          </div>
        ) : <div className="empty"><h3>Chưa tìm thấy món nào kỳ đến vậy.</h3><Button color="primary" size="md" onClick={() => { setQuery(""); setCategory("Tất cả danh mục"); }}>Xem tất cả sản phẩm</Button></div>}
      </section>

      <motion.section className="how" id="cach-cho-chay" initial={reduceMotion ? false : { opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-90px" }} transition={{ duration: .9 }}>
        <div className="how-visual">
          <motion.img src="/products/ky-la-coin-purple-v2.png" alt="Đồng Xu Kỳ Lạ 3D realistic" whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: -2 }} transition={{ type: "spring", stiffness: 130, damping: 16 }} />
          <span>+5.000 Xu</span>
        </div>
        <div className="how-copy">
          <p>Xu Kỳ Lạ dùng thế nào?</p>
          <h2>Đăng ký một lần.<br />Kỳ lạ cả đời.</h2>
          <div className="steps">
            <div><b>Nhận Xu</b><span>Tài khoản mới có ngay 5.000 Xu để mở màn.</span></div>
            <div><b>Săn món lạ</b><span>Thêm vào giỏ và thanh toán trực tiếp bằng số dư.</span></div>
            <div><b>Tự mở chợ</b><span>Đăng món của bạn, chờ duyệt rồi lên kệ.</span></div>
          </div>
          <Button color="primary" size="lg" className="primary-button" onClick={() => setAuthOpen(true)}>Nhận 5.000 Xu</Button>
        </div>
      </motion.section>

      <footer><a className="brand" href="#"><span className="brand-mark"><img src="/products/cho-ky-ky-logo.png" alt="" /></span><span>Chợ Kỳ Kỳ</span></a><p>Chợ không thiếu thứ gì, chỉ thiếu đồ bình thường.</p><a href="#san-pham">Quay lại gian hàng ↑</a></footer>

      {notice && <div className="toast" role="status">{notice}</div>}
      <AnimatePresence>{fireball && <motion.span key={fireball.key} className="cart-fireball" initial={{ left: fireball.x, top: fireball.y, scale: .3, opacity: 0 }} animate={{ left: fireball.tx, top: fireball.ty, scale: [1, 1.35, .35], rotate: [0, -12, 24], opacity: [0, 1, 1] }} exit={{ scale: 2.8, opacity: 0 }} transition={{ duration: .62, ease: [0.34, 1.2, .4, 1] }}><img src={fireball.image} alt="" /><i>✦</i></motion.span>}</AnimatePresence>

      {cartOpen && <div className="modal-layer" onMouseDown={() => setCartOpen(false)}>
        <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
          <div className="modal-head"><div><small>GIỎ ĐỒ KỲ LẠ</small><h2>{cartCount} món đang đợi</h2></div><Button color="ghost" size="sm" onClick={() => setCartOpen(false)}>×</Button></div>
          <div className="cart-list">
            {cart.length === 0 ? <div className="cart-empty"><span>⌁</span><h3>Giỏ đang bình thường quá.</h3><p>Thêm vài món lạ rồi quay lại nhé.</p></div> : cart.map((item) => (
              <div className="cart-item" key={item.id}><img className="mini-sprite" src={item.image} alt="" /><div><h3>{item.name}</h3><span>{money(item.price)} Xu</span></div><div className="quantity"><Button color="ghost" size="xs" onClick={() => updateQuantity(item.id, -1)}>−</Button><b>{item.quantity}</b><Button color="ghost" size="xs" onClick={() => updateQuantity(item.id, 1)}>+</Button></div></div>
            ))}
          </div>
          <div className="checkout"><div><span>Tổng cộng</span><strong>{money(total)} Xu</strong></div>{cart.length ? <Link href="/thanh-toan" onClick={() => setCartOpen(false)}>Đến trang thanh toán</Link> : <Button color="primary" size="lg" disabled>Chưa có món để thanh toán</Button>}</div>
        </aside>
      </div>}

      {authOpen && <div className="modal-layer" onMouseDown={() => setAuthOpen(false)}>
        <div className="modal auth-modal" onMouseDown={(e) => e.stopPropagation()}>
          <Button color="ghost" size="sm" className="modal-close" onClick={() => setAuthOpen(false)}>×</Button>
          <div className="account-coin"><img src="/products/ky-la-coin-purple-v2.png" alt="Xu Kỳ Lạ" /><span>{loggedIn ? money(balance) : "5.000"}<small> Xu Kỳ Lạ</small></span></div><p>VÍ XU KỲ LẠ</p><h2>{loggedIn ? "Kho phép màu của bạn." : authMode === "register" ? "Tạo tài khoản, nhận ngay 5.000 Xu." : "Đăng nhập để xem ví Xu Kỳ Lạ."}</h2>
          {loggedIn ? <><div className="account-balance">{money(balance)} <small>Xu Kỳ Lạ</small></div><Button color="primary" size="lg" className="primary-button" onClick={() => setAuthOpen(false)}>Tiếp tục đi chợ</Button></> :
          <form onSubmit={register}>
            <label>Họ và tên<input required placeholder="Nguyễn Kỳ Lạ" /></label>
            <label>Email<input type="email" required placeholder="ban@kyky.vn" /></label>
            <label>Mật khẩu<input type="password" required minLength={6} placeholder="Ít nhất 6 ký tự" /></label>
            <Button color="primary" size="lg" type="submit">{authMode === "register" ? "Đăng ký và nhận Xu" : "Đăng nhập"}</Button>
            <Button color="secondary" size="lg" className="auth-switch" onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}>{authMode === "register" ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}</Button>
            <small>Bằng cách tham gia, bạn đồng ý rằng đồ ở đây hơi kỳ.</small>
          </form>}
        </div>
      </div>}

      {vendorOpen && <div className="modal-layer" onMouseDown={() => setVendorOpen(false)}>
        <div className="modal vendor-modal" onMouseDown={(e) => e.stopPropagation()}>
          <Button color="ghost" size="sm" className="modal-close" onClick={() => setVendorOpen(false)}>×</Button><p>MỞ GIAN HÀNG</p><h2>Bạn có gì lạ?</h2>
          <form onSubmit={submitProduct}>
            <div className="form-grid">
              <label>Tên sản phẩm<input name="name" required placeholder="Ví dụ: Mũ nghe được suy nghĩ" /></label>
              <label>Danh mục<input name="category" required placeholder="Đồ công nghệ tâm linh" /></label>
              <label>Giá Xu<input name="price" type="number" min="1" required placeholder="250" /></label>
              <label>Ảnh minh họa<input name="image" type="file" accept="image/*" /></label>
            </div>
            <label>Mô tả độ kỳ lạ<textarea name="description" required placeholder="Nói rõ món này kỳ ở đâu và dùng để làm gì..." /></label>
            <Button color="primary" size="lg" type="submit">Gửi duyệt sản phẩm</Button>
          </form>
        </div>
      </div>}
    </main>
    </>
  );
}
