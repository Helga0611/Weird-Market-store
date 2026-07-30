import fs from "node:fs";
import path from "node:path";

const sources = process.argv.slice(2);
if (!sources.length) throw new Error("Truyền ít nhất một file danh sách sản phẩm.");

const text = sources.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const pattern = /(\d+)\.\s+(.+?)\s+\(([^)]+)\)\s+-\s+([\d.]+)\s+Xu\s+-\s+(.+?)\s+-\s+Status:\s+(.+?)(?=\n\d+\.|$)/gs;
const parsed = [...text.matchAll(pattern)].map((match) => ({
  id: Number(match[1]),
  name: match[2].trim(),
  category: match[3].trim(),
  price: Number(match[4].replaceAll(".", "")),
  description: match[5].trim(),
  status: match[6].trim(),
}));
const sourceProducts = [...new Map(parsed.map((product) => [product.id, product])).values()].sort((a, b) => a.id - b.id);
if (sourceProducts.length !== 100) throw new Error(`Cần 100 sản phẩm, chỉ đọc được ${sourceProducts.length}.`);

const stores = {
  "Gia dụng tâm linh": { slug: "nha-co-phep", name: "Nhà Có Phép", blurb: "Đồ gia dụng biết nghe lời, đôi lúc còn biết cãi." },
  "Phương tiện dịch chuyển": { slug: "tram-may-so-9", name: "Trạm Mây Số 9", blurb: "Đi xa bằng những phương tiện không có trong luật vật lý." },
  "Mỹ phẩm phòng thân": { slug: "phu-thuy-co-gu", name: "Phù Thuỷ Có Gu", blurb: "Khí chất, phòng thân và một chút hào quang mang theo." },
  "Ẩm thực thần kỳ": { slug: "bep-trang-khuyet", name: "Bếp Trăng Khuyết", blurb: "Món ăn ngon đến mức khoa học xin phép không bình luận." },
  "Đồ chơi cứu sinh": { slug: "hoc-vien-tron-bai", name: "Học Viện Trốn Bài", blurb: "Đồ chơi cho những ngày não muốn nghỉ nhưng deadline không cho." },
};

const palettes = [
  ["#ff5b8d", "#ffb347", "#1b0d2a"],
  ["#21d4c2", "#4b7bff", "#081d31"],
  ["#ff7357", "#ffda55", "#321027"],
  ["#9d5cff", "#ff63c3", "#160b31"],
  ["#32d17d", "#d7ff62", "#09271b"],
  ["#20bfea", "#ff62a5", "#151538"],
  ["#ff944d", "#7c4dff", "#281128"],
  ["#e7ff4f", "#43d6ff", "#10223d"],
];

const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const wrapName = (name) => {
  const words = name.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > 27 && line) { lines.push(line); line = word; }
    else line = `${line} ${word}`.trim();
  }
  lines.push(line);
  return lines.slice(0, 2);
};
const objectMarkup = (kind, accent, secondary) => {
  const shapes = [
    `<g transform="translate(580 120)"><path d="M90 40h170l35 210-120 70L55 250z" fill="url(#metal)"/><circle cx="175" cy="165" r="72" fill="${accent}" opacity=".92"/><circle cx="175" cy="165" r="42" fill="${secondary}"/></g>`,
    `<g transform="translate(620 105)"><ellipse cx="130" cy="275" rx="155" ry="35" fill="#000" opacity=".24"/><rect x="45" y="35" width="170" height="245" rx="58" fill="url(#metal)"/><rect x="72" y="82" width="116" height="126" rx="25" fill="${accent}"/><path d="M95 35V8h70v27" stroke="${secondary}" stroke-width="20" fill="none"/></g>`,
    `<g transform="translate(570 110)"><path d="M30 235 145 25l125 210-120 80z" fill="url(#metal)"/><path d="M85 220 150 98l66 122-64 41z" fill="${accent}"/><circle cx="150" cy="176" r="26" fill="${secondary}"/></g>`,
    `<g transform="translate(560 110)"><ellipse cx="170" cy="270" rx="155" ry="36" fill="#000" opacity=".23"/><path d="M30 210c80-8 88-126 144-150 50 62 68 136 166 147-35 68-270 86-310 3z" fill="url(#metal)"/><path d="M76 202c75-22 82-84 103-99 34 43 62 81 108 96-55 22-155 32-211 3z" fill="${accent}"/></g>`,
    `<g transform="translate(560 95)"><path d="M55 30h238v260H55z" rx="20" fill="url(#metal)"/><path d="M82 58h184v202H82z" fill="${accent}"/><path d="M115 98h118M115 135h85M115 172h118" stroke="${secondary}" stroke-width="14" stroke-linecap="round"/></g>`,
    `<g transform="translate(570 100)"><ellipse cx="155" cy="282" rx="150" ry="34" fill="#000" opacity=".23"/><path d="M45 80h220l-25 195H70z" fill="url(#metal)"/><path d="M80 112h150l-18 128H98z" fill="${accent}"/><path d="M265 120c100 0 92 118-18 106" fill="none" stroke="${secondary}" stroke-width="28" stroke-linecap="round"/></g>`,
  ];
  return shapes[kind % shapes.length];
};

const outDir = path.resolve("public/catalog");
fs.mkdirSync(outDir, { recursive: true });
const products = sourceProducts.map((item) => {
  const statusMatch = item.status.match(/^([\d,.\s]+)\s+(.+)$/);
  const users = statusMatch ? Number(statusMatch[1].replace(/[,\.\s]/g, "")) : 0;
  const usage = statusMatch ? statusMatch[2] : item.status;
  const store = stores[item.category];
  const gallery = [];
  for (let variant = 0; variant < 4; variant += 1) {
    const palette = palettes[(item.id + variant * 2) % palettes.length];
    const [accent, secondary, dark] = palette;
    const lines = wrapName(item.name);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
<defs>
<radialGradient id="bg"><stop stop-color="${secondary}" stop-opacity=".48"/><stop offset=".52" stop-color="${dark}"/><stop offset="1" stop-color="#05050b"/></radialGradient>
<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".18" stop-color="${secondary}"/><stop offset=".5" stop-color="${accent}"/><stop offset=".82" stop-color="#44266b"/><stop offset="1" stop-color="#fff"/></linearGradient>
<filter id="glow"><feGaussianBlur stdDeviation="16" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="1280" height="720" fill="url(#bg)"/>
<circle cx="${890 - variant * 30}" cy="${105 + variant * 20}" r="250" fill="${accent}" opacity=".16" filter="url(#glow)"/>
<path d="M0 555C260 470 410 650 690 550s390-40 590-120v290H0z" fill="${secondary}" opacity=".12"/>
<g fill="#fff" opacity=".85" filter="url(#glow)"><circle cx="1100" cy="130" r="5"/><circle cx="1030" cy="265" r="3"/><circle cx="740" cy="90" r="4"/><path d="m1130 350 8 20 20 8-20 8-8 20-8-20-20-8 20-8z"/></g>
${objectMarkup(item.id + variant, accent, secondary)}
<text x="72" y="92" fill="${secondary}" font-family="Inter,Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="3">${escapeXml(item.category.toUpperCase())}</text>
${lines.map((line, index) => `<text x="72" y="${175 + index * 72}" fill="#fff" font-family="Inter,Arial,sans-serif" font-size="58" font-weight="800">${escapeXml(line)}</text>`).join("")}
<text x="74" y="600" fill="#fff" opacity=".68" font-family="Inter,Arial,sans-serif" font-size="24">Vật phẩm 3D · Hào quang ${variant + 1}</text>
<text x="1110" y="635" fill="#fff" font-family="Inter,Arial,sans-serif" font-size="54" font-weight="800">#${String(item.id).padStart(3, "0")}</text>
</svg>`;
    const filename = `product-${item.id}-${variant + 1}.svg`;
    fs.writeFileSync(path.join(outDir, filename), svg);
    gallery.push(`/catalog/${filename}`);
  }
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    description: item.description,
    longDescription: `${item.description}. Vật phẩm được kiểm định tại Chợ Kỳ Kỳ, niêm phong bằng bụi sao và kèm hướng dẫn sử dụng an toàn trong đúng chiều không gian.`,
    users,
    usage,
    image: gallery[0],
    gallery,
    tags: [item.category, item.id % 5 === 0 ? "Bán chạy" : "Có bảo chứng", item.price > 1000 ? "Cực hiếm" : "Sẵn hàng"],
    rating: Number((4.6 + (item.id % 5) * 0.1).toFixed(1)),
    stock: 18 + (item.id * 17) % 180,
    vendorSlug: store.slug,
    vendorName: store.name,
    colors: ["San hô sao", "Lam cực quang", "Tím trăng khuyết", "Lục đom đóm"],
  };
});

fs.writeFileSync(path.resolve("app/catalog-data.json"), `${JSON.stringify(products, null, 2)}\n`);
fs.writeFileSync(path.resolve("app/stores-data.json"), `${JSON.stringify(Object.entries(stores).map(([category, store]) => ({ ...store, category })), null, 2)}\n`);
console.log(`Generated ${products.length} products, ${products.length * 4} gallery images and ${Object.keys(stores).length} stores.`);
