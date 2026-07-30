import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const sheets = [
  { start: 11, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-74c93b00-fd53-4927-bd2e-e124ef3c3860.png" },
  { start: 20, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-37e3358f-6c9e-4877-897f-f511a38c22f6.png" },
  { start: 29, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-7174be61-12e8-4521-8755-d7dee8b18c95.png" },
  { start: 38, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-c10c24e5-4de6-4967-a1fb-fe18cc4ceb6e.png" },
  { start: 47, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-294b2f47-2711-4596-bd8c-bfd539ae867d.png" },
  { start: 56, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-2faae33f-1653-4188-be0c-6a5485444036.png" },
  { start: 65, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-abacffd8-5546-452f-8911-3242462ee0fc.png" },
  { start: 74, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-61c1b3b1-164e-47c2-bfce-fb184d09e26c.png" },
  { start: 83, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-5f2b9756-5c2f-4ac1-a799-53fc43a177da.png" },
  { start: 92, file: "/Users/mac/.codex/generated_images/019fb19f-ec72-7502-8b89-bd33b08329ca/exec-81004aa6-0995-4e4f-9851-18148cdf24fb.png" },
];

const output = path.resolve("public/catalog-real");
fs.mkdirSync(output, { recursive: true });

for (const sheet of sheets) {
  const metadata = await sharp(sheet.file).metadata();
  const cellWidth = Math.floor(metadata.width / 3);
  const cellHeight = Math.floor(metadata.height / 3);
  for (let index = 0; index < 9; index += 1) {
    const id = sheet.start + index;
    const left = (index % 3) * cellWidth;
    const top = Math.floor(index / 3) * cellHeight;
    const cell = await sharp(sheet.file)
      .extract({ left, top, width: cellWidth, height: cellHeight })
      .png()
      .toBuffer();
    const background = await sharp(cell).resize(1280, 720, { fit: "cover" }).blur(24).modulate({ brightness: .56, saturation: 1.2 }).toBuffer();
    for (let variant = 1; variant <= 4; variant += 1) {
      const hue = [0, 28, 96, 205][variant - 1];
      const softMask = Buffer.from(`<svg width="760" height="660"><defs><filter id="b"><feGaussianBlur stdDeviation="22"/></filter></defs><rect x="24" y="24" width="712" height="612" rx="44" fill="white" filter="url(#b)"/></svg>`);
      const foreground = await sharp(cell)
        .resize(760, 660, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .modulate({ hue, saturation: variant === 1 ? 1 : 1.08, brightness: variant === 3 ? 1.06 : 1 })
        .composite([{ input: softMask, blend: "dest-in" }])
        .png()
        .toBuffer();
      await sharp(background)
        .composite([
          { input: foreground, gravity: "center" },
          { input: Buffer.from(`<svg width="1280" height="720"><defs><radialGradient id="v"><stop offset="45%" stop-color="transparent"/><stop offset="100%" stop-color="#050309" stop-opacity=".72"/></radialGradient></defs><rect width="1280" height="720" fill="url(#v)"/></svg>`) },
        ])
        .webp({ quality: 88 })
        .toFile(path.join(output, `product-${id}-${variant}.webp`));
    }
  }
}

const catalogPath = path.resolve("app/catalog-data.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
for (const product of catalog) {
  if (product.id <= 10) {
    product.image = `/products/wide-${product.id}-1.webp`;
    product.gallery = [1, 2, 3, 4].map((variant) => `/products/wide-${product.id}-${variant}.webp`);
  } else {
    product.image = `/catalog-real/product-${product.id}-1.webp`;
    product.gallery = [1, 2, 3, 4].map((variant) => `/catalog-real/product-${product.id}-${variant}.webp`);
  }
}
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log("Processed 90 AI contact-sheet products into 360 uncropped 16:9 gallery images.");
