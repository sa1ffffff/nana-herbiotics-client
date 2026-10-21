# Build Brief: Nana Herbiotics, 3D Botanical E-commerce Site

## 0. How to work

Use these skills, in this order of authority:

1. **/impeccable**: owns art direction, layout, typography, color, hierarchy, UX copy, accessibility and the final polish/audit pass. Start by establishing a design direction (DESIGN.md + tokens) before writing components.
2. **/emil-design-eng**: owns every motion decision: whether something animates, easing, duration, interruptibility, press feedback, reduced motion. If it conflicts with anything else, Emil's rules win.
3. **/react-bits:react-bits**: the source for animated text, backgrounds and interaction components (listed in §6). Install them via the React Bits CLI/registry rather than rewriting them from memory, then restyle them to the brand tokens.

The bar is an Awwwards-level site: immersive, 3D and full of motion, but every animation must have a purpose. It also has to work as a shop. Fast checkout comes first and spectacle second.

---

## 1. Brand

| | |
|---|---|
| Brand name | **Nana Herbiotics** (use this exact spelling everywhere. It matches the product labels) |
| Taglines | "Botanical Care, Naturally" (primary) · "Rooted in Nature" (secondary) |
| Established | 2024 |
| Market | Pakistan. All prices in **PKR**, formatted `Rs 1,599` / `PKR 1,599` |
| Monogram | Interlocking serif "NH" inside a botanical crest, flanked by "ESTD · 2024" |
| Personality | Warm, trustworthy, heritage apothecary, gentle. Not clinical and not "spa-generic". |

### Visual language (take it from the real labels)
The labels use deep forest green with antique-gold line art, botanical corner flourishes, serif small caps and illustrated herbs. The site should feel like the label came to life.

Starting palette (impeccable may refine it):
- Forest green `#1E3A2B` (primary surface, dark sections)
- Deep ink green `#0F2119` (hero/3D backdrop)
- Antique gold `#C8A24A` (rules, icons, accents, never for body text)
- Ivory parchment `#F6F1E6` (light section background)
- Pure white `#FFFFFF` (product image wells only)
- Hibiscus `#D2456A` (single accent for the Hibiscus product and sale/notice moments)

Typography: a high-contrast classical serif for display (e.g. Cormorant Garamond / Cinzel-style small caps for eyebrows) paired with a clean, warm sans for UI and body. Use fluid type scale. No generic system-font look.

---

## 2. Tech stack

- **Vite + React + TypeScript**
- **Tailwind CSS** with design tokens as CSS variables
- **React Three Fiber + @react-three/drei** for 3D
- **Motion (Framer Motion)** for UI transitions (drawer, modal, cards, layout)
- **GSAP + ScrollTrigger** for scroll-driven sequences, **Lenis** for smooth scrolling (disabled when `prefers-reduced-motion`)
- **Zustand** for cart state, persisted to `localStorage` (wrapped in try/catch)
- No backend. Orders go out through WhatsApp (see §8)
- Output must build with `npm run build` and deploy as a static site (Vercel/Netlify)

---

## 3. Product images

Source photos are in `assets/raw/` (copy them in from the uploads). They contain hands, fabric, furniture and mixed lighting.

Processing pipeline (run it locally with a script, e.g. Python `rembg` + Pillow):
1. Remove the background from every product
2. Crop to the product, then place it centered on **pure white `#FFFFFF`**, square **1600×1600**, product height ≈ 78% of the canvas, consistent baseline
3. Add a soft, realistic contact shadow beneath each product (blurred ellipse, ~12% opacity), the same for all of them
4. Remove fingers or fabric remnants left on the bottle edges. Lightly correct white balance and color so the greens match across shots
5. Export `webp` (plus `png` fallback) at 1600 / 800 / 400 for `srcset`
6. Also export **transparent PNG cutouts** of each bottle for use in the 3D/parallax hero
7. Split the soap group photo into **individual soap cutouts** (8 soaps)

File mapping:
| Photo | Products |
|---|---|
| 1 | Herbal Conditioner (clear bottle), Herbal Shampoo (white bottle), Hibiscus Shampoo (black bottle) |
| 2 | Herbal Face Wash |
| 3 | Herbal Body Wash |
| 4 | Handmade soaps (dark-green leaf-stamped round = Acne Soap; all others = Brightening Soaps) |
| 5 | Brightening Serum |

Product cards: square, white image well, subtle image zoom (scale 1.04, ~400ms ease-out) on hover. Hover only on devices with `(hover: hover)`.

---

## 4. Catalogue

| # | Product | Size | Price | Category | Copy |
|---|---|---|---|---|---|
| 1 | Herbal Shampoo | 200 ml | PKR 1,599 | Shampoos | Infused with 27+ herbs. Natural, gentle, effective. For healthier, stronger and shinier hair. |
| 2 | Hibiscus Shampoo | 200 ml | PKR 1,599 | Shampoos | Infused with hibiscus flowers, Vitamin B12 and Vitamin E. Natural, gentle, effective hair care. |
| 3 | Herbal Conditioner | 200 ml | PKR 1,499 | Hair Care | Enriched with natural botanical extracts to nourish and strengthen hair. |
| 4 | Herbal Face Wash | 150 ml | PKR 1,200 | Skin Care | Cleanse, brighten, nourish. A special formula for brightening skin. |
| 5 | Herbal Body Wash | 300 ml | PKR 899 | Skin Care | Cleanse, nourish, refresh. Made with natural botanical extracts such as chamomile, green tea and neem. Suitable for all skin types. |
| 6 | Acne Removal Brightening Serum | 50 ml | PKR 1,099 | Skin Care | A botanical serum with rose that helps calm breakouts and brings out an even tone and a healthy glow. |
| 7 | Herbal Acne Soap | 1 bar | PKR 549 | Handmade Soaps | Handmade herbal bar for acne-prone skin. Gently cleanses and helps keep skin clear. |
| 8 | Herbal Brightening Soap | 1 bar | PKR 499 | Handmade Soaps | Handmade botanical bars for a brighter, softer glow. Available in several designs. Each bar is unique. |

Notes:
- Brightening Soap is one product with a **design variant selector** (thumbnail swatches of the 7 designs, e.g. Honeybee, Lavender Bloom, Ocean Blossom, Oat & Herb, Golden Botanical, Mosaic, Sandalwood). The selected design shows in the cart line.
- Label badges available for hair care: Paraben Free · Sulfate Free · 100% Herbal · Safe for All Hair Types.
- Content to confirm against the real labels: body wash and face wash key ingredients, serum ingredients, soap ingredients/weights.

Store all products in one typed `products.ts` data file (id, slug, name, category, size, price, short, long, ingredients[], badges[], images, variants?).

---

## 5. Page structure (single page, smooth scroll, anchor nav)

1. **Header** (sticky): NH monogram + "Nana Herbiotics" wordmark · nav: Home, Shampoos, Hair Care, Skin Care, Soaps, About, Contact · cart icon with live count badge (count animates on change). Transparent over hero, then solidifies to blurred ivory/green with a hairline gold rule after scroll. Active section highlighted. Mobile: full-screen menu with staggered links.

2. **Hero (3D)**: full-viewport dark forest scene.
   - A React Three Fiber scene: a hero bottle (Hibiscus Shampoo or Herbal Shampoo) built as a procedural glass/plastic bottle (`LatheGeometry`) wrapped with the real label texture, gold pump cap, slowly rotating. Botanical elements (leaves, hibiscus petals, herb sprigs) drift around it in depth with soft bokeh. Cursor parallax tilts the scene gently.
   - Headline "Botanical Care, Naturally" revealed with a React Bits text effect. Sub-line: *Gentle, paraben-free care made from herbs, flowers and botanical extracts.* "Shop Now" primary button (magnetic on desktop) and a "Our Story" secondary link.
   - Rotating circular badge: "ROOTED IN NATURE • ESTD 2024 •".
   - On scroll, the bottle travels, scales down and hands off into the Shampoos section (GSAP ScrollTrigger pin).
   - Fallback: if WebGL is unavailable, on low-power devices, or with reduced motion, show a static layered parallax composition using the transparent cutouts.

3. **Marquee band**: slow, scroll-velocity-linked line: "Paraben Free ✦ Sulfate Free ✦ 100% Herbal ✦ Handmade in Pakistan ✦ Cash on Delivery ✦"

4. **Shampoos**: Herbal Shampoo, Hibiscus Shampoo (large two-up feature cards, each with its own accent tint)

5. **Hair Care**: Herbal Conditioner (feature card + "Pairs well with" the shampoos)

6. **Skin Care**: Face Wash, Body Wash, Brightening Serum

7. **Handmade Soaps**: Acne Soap + Brightening Soap with design selector. Optional: an R3F or 2.5D scattered-soap arrangement that settles into a grid on scroll.

8. **Why Nana Herbiotics**: 4 gold line icons drawn on scroll (SVG stroke animation): Paraben Free, Sulfate Free, 100% Herbal, Safe for All Hair Types, each with one short line.

9. **Ingredients story** (optional, recommended): a horizontal pinned scroll of key botanicals (hibiscus, neem, green tea, chamomile, aloe, rose), each with a one-line benefit.

10. **About**: warm short story: started in 2024 from family herbal recipes; small batches; plants over chemicals; gentle enough for the whole family. Pull-quote in large serif. Monogram crest.

11. **Contact + Footer**: WhatsApp button (`https://wa.me/923307072774`), phone `0330-7072774` (`tel:+923307072774`), email `hussainmahad786@gmail.com` (`mailto:`), Instagram and Facebook (placeholder links), email contact form (name, email, message), "Cash on Delivery available across Pakistan" note, quick links, © 2026 Nana Herbiotics.

Floating: back-to-top button (appears after 1 viewport, shows scroll progress ring) and a floating WhatsApp chat button on mobile.

---

## 6. Motion system

Follow `/emil-design-eng` rules. Concretely:
- UI transitions: 150–300ms, custom ease-out (e.g. `cubic-bezier(0.23, 1, 0.32, 1)`); never `ease-in` for entrances; nothing over 300ms for UI the user triggered.
- Buttons: `scale(0.97)` on press; no hover effects on touch devices.
- Cart drawer and modal: interruptible (Motion springs or CSS transitions, not keyframes), origin-aware; drawer slides from right, modal scales from 0.96 + fade, never from 0.
- Section reveals: once only, subtle (translateY 16–24px + opacity, short stagger). Don't animate content the user sees on every visit to the point of slowing them down.
- Add-to-cart: product image "flies" to the cart icon, badge count bumps, short toast (Sonner) with "View cart".
- Animate only `transform` / `opacity` / `filter`; 60fps target; pause 3D render when hero is off-screen (`frameloop="demand"` or visibility check).
- `prefers-reduced-motion`: disable Lenis, 3D motion, parallax and marquees; keep opacity fades only.

React Bits components to use (restyled to brand):
- **SplitText / BlurText**: hero headline and section titles
- **CircularText**: "Rooted in Nature • Estd 2024" badge
- **ScrollVelocity**: marquee band
- **Magnet**: Shop Now / checkout CTAs (desktop only)
- **TiltedCard** or **SpotlightCard**: product cards (subtle, max ~6° tilt)
- **Counter**: quantity selector digits
- **ScrollReveal / ScrollFloat**: About story text
- A soft background (e.g. **Particles** / **Silk** tinted green-gold) for dark sections, kept low-contrast

Don't stack effects. Each section gets one signature motion.

---

## 7. Functionality

- **Product card**: image, name, size, short description, price, quantity stepper, "Add to Cart", click image/name → Quick View.
- **Quick View modal**: large image (zoomable gallery if multiple), name, size, price, full description, ingredients, badges, variant selector (soaps), quantity, Add to Cart. Closes on Esc / backdrop; focus trapped; URL hash `#product/<slug>` so it's shareable.
- **Cart drawer**: line items with thumbnail, variant, qty stepper, remove, per-line total, subtotal, delivery note, grand total in PKR; empty state with "Start shopping"; persists across reloads.
- **Checkout** (in drawer step 2 or a modal): Full name, Phone (Pakistani format `03XX-XXXXXXX`, validated), Address, City (searchable list of major Pakistani cities + "Other"), optional notes. Payment: **Cash on Delivery** (only option, shown as selected).
- **Order on WhatsApp**: builds a pre-filled message and opens `https://wa.me/923307072774?text=<encoded>`:
  ```
  Assalam-o-Alaikum! New order from nanaherbiotics website:
  1) Herbal Shampoo 200ml × 2 = Rs 3,198
  2) Brightening Soap (Lavender Bloom) × 1 = Rs 499
  Subtotal: Rs 3,697
  Delivery: Rs ___
  Total: Rs ___
  Name: …  Phone: …  Address: …, City
  Payment: Cash on Delivery
  ```
- **Place Order (COD)** button: validates, then sends the same message via WhatsApp (no backend) and shows a thank-you confirmation with an order reference (`NH-YYMMDD-XXXX`); clears cart.
- **Contact form**: client-side validation; submits via a placeholder endpoint (Formspree-ready) with success/error states.

---

## 8. Quality bar

- **SEO**: `<title>Nana Herbiotics | Herbal Shampoo, Skin Care & Handmade Soaps in Pakistan</title>`, meta description, Open Graph/Twitter cards with a branded share image, `Product` + `Organization` JSON-LD with PKR prices, descriptive alt text on every image, semantic landmarks, one `h1`.
- **Performance**: Lighthouse ≥ 90 on mobile; lazy-load 3D (code-split, load after first paint); responsive `webp` images with `srcset`; fonts `display: swap` and preloaded; LCP < 2.5s.
- **Accessibility**: WCAG AA contrast (gold never carries small text on ivory), visible focus rings, keyboard-operable drawer/modal/steppers, `aria-live` for cart updates, 44px touch targets.
- **Responsive**: designed mobile-first (most customers will be on phones); 360px → 1920px; no horizontal scroll; safe-area insets; inputs ≥ 16px to prevent iOS zoom.
- **Edge cases**: long city/address text, 0 items, qty 99, WebGL failure, localStorage blocked.
- Finish with an `/impeccable` audit/polish pass and fix everything it flags.

---

## 9. Contact details

| | |
|---|---|
| Email | hussainmahad786@gmail.com |
| Phone | 0330-7072774 (`+92 330 7072774`) |
| WhatsApp | Same number: `https://wa.me/923307072774` (all "Order on WhatsApp" and chat buttons use this) |

## 10. Placeholders to fill before launch

- Instagram / Facebook URLs
- Formspree ID for the contact form (submissions go to hussainmahad786@gmail.com)
- Delivery charge (flat rate? free above a threshold?)
- Confirmed ingredients for face wash, body wash, serum, soaps
- Soap design names (or keep the suggested ones)
