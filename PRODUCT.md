# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Pinned in the brief (PROMPT.md): Vite + React + TypeScript, Tailwind CSS, React Three Fiber + drei, Motion, GSAP ScrollTrigger + Lenis, Zustand. Static deploy (Vercel/Netlify), no backend. React Bits components restyled to the brand.

## Users

Pakistani shoppers, split roughly equally between people who discover the brand on Instagram/WhatsApp and families or repeat customers who arrive by word of mouth and trust the maker personally. Most shop on phones. Their job: find a gentle, herbal alternative for hair and skin care for themselves and their family, and order it with Cash on Delivery without friction.

## Product Purpose

The online shop for Nana Herbiotics, a small herbal personal-care brand established in 2026. It presents the range, builds trust in the herbal formulations, and turns a visit into a COD order sent through WhatsApp. Success is a completed order message reaching 0330-7072774.

## Positioning

Small-batch herbal formulations with a heritage apothecary identity: the products' own illustrated forest-green-and-gold labels (NH monogram crest, "ESTD 2024" printed on the current labels; the brand was founded in 2026, "Rooted in Nature") are the brand. Claims printed on labels: paraben free, sulfate free, 100% herbal, safe for all hair types; Herbal Shampoo "infused with 27+ herbs"; Hibiscus Shampoo with hibiscus flowers, Vitamin B12 and Vitamin E.

## Operating Context

Orders are Cash on Delivery across Pakistan. No payment gateway: checkout composes a WhatsApp message to +92 330 7072774, saves the order to Supabase, and (when EmailJS is configured) emails the customer and the admin a confirmation. Delivery is a flat Rs 250, free on orders over Rs 3,000. Contact: nanaherbiotics@gmail.com, phone/WhatsApp 0330-7072774.

An admin dashboard (Google sign-in, restricted to saifullahwasim1@gmail.com and nanaherbiotics@gmail.com) lets the owner add or remove products, delete reviews, and view every order placed, exportable to Excel on demand. See supabase/admin-setup.md.

## Capabilities and Constraints

- Catalogue of 8 products (see PROMPT.md §4) with PKR prices; Brightening Soap has design variants.
- Cart persists in the browser; checkout fields: name, phone (03XX format), address, city, notes.
- Undecided: Instagram/Facebook URLs, Formspree ID, confirmed ingredient lists for face wash, body wash, serum and soaps, and soap design names (suggested names are placeholders).

## Brand Commitments

- Name: **Nana Herbiotics** (label spelling). Taglines "Botanical Care, Naturally" and "Rooted in Nature". Est. 2026.
- Visual identity: the label world come to life. Deep forest green and antique gold dominate; product images sit on pure white wells. Chosen by the user over a lighter treatment.
- Voice: warm, trustworthy, simple; natural ingredients and gentle care.

## Evidence on Hand

- Product photos: `assets/raw/1.jpg`–`5.jpg` (with hands, fabric and furniture in the shots; backgrounds need removing).
- No testimonials, reviews, customer counts, certifications or press exist. Do not invent them.

## Product Principles

1. Ordering is the point: every beautiful moment must sit on a path to a WhatsApp/COD order.
2. Say only what the labels say; never add medical or certification claims.
3. Phones first: the visitor is on mobile data, often on WhatsApp in another tab.
4. Warmth over clinical polish: this is a family maker, not a lab.

## Accessibility & Inclusion

WCAG AA contrast, keyboard-operable cart and dialogs, reduced-motion support, 44px touch targets.
