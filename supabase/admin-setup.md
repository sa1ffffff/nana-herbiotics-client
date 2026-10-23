# Setting up admin features

This covers the admin dashboard (products, reviews, orders), Google sign-in, and order
confirmation emails. Do these once.

## 1. Run the database migration

**SQL Editor → New query**, paste all of `admin-schema.sql`, **Run**.

This adds:
- a `products` table (public read; only the two admin accounts can add/remove)
- an `orders` table (checkout can insert; only admins can read or delete)
- a public `product-images` storage bucket for admin-uploaded photos
- permission to delete reviews, restricted to the same two admin accounts

The two admin emails are hard-coded in the SQL's `is_admin()` function:
`saifullahwasim1@gmail.com` and `nanaherbiotics@gmail.com`. To change who is an admin,
edit that function and re-run just that part of the file.

## 2. Turn on Google sign-in

1. **Authentication → Providers → Google** → toggle it on.
2. You need a Google OAuth Client ID and Secret. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Create (or reuse) a project → **Create Credentials → OAuth client ID** → Application type **Web application**.
   - Under **Authorized redirect URIs**, add the callback URL Supabase shows on that same
     Google provider page (it looks like `https://<project-ref>.supabase.co/auth/v1/callback`).
   - Copy the **Client ID** and **Client Secret** into Supabase's Google provider fields, then **Save**.
3. **Authentication → URL Configuration**:
   - **Site URL**: your production URL (e.g. `https://nana-herbiotics.vercel.app`).
   - **Redirect URLs**: add that same production URL *and* `http://localhost:4173` (and
     `http://localhost:5173` if you test with `npm run dev`), so sign-in works in both places.

Anyone can sign in with Google. Only the two admin emails see the admin dashboard —
everyone else just stays on the ordinary site, signed in or not.

## 3. Order confirmation emails (optional)

Needs an [EmailJS](https://www.emailjs.com) account (free tier is enough).

1. **Email Services** → add your Gmail (or any provider) → note the **Service ID**.
2. **Email Templates** → create one for the **customer**, with these fields available to use in the template body (`{{field}}`):
   `to_email, to_name, customer_name, order_id, products, subtotal, delivery, total, city, address, date`.
   Example body:
   ```
   Hi {{customer_name}},

   Thank you for your order {{order_id}} from Nana Herbiotics!

   {{products}}

   Subtotal: {{subtotal}}
   Delivery: {{delivery}}
   Total: {{total}}

   Delivering to: {{address}}, {{city}}
   Placed: {{date}}

   We'll call to confirm before delivery. Cash on Delivery.
   ```
   Set the template's **To email** field to `{{to_email}}`. Note the **Template ID**.
3. Create a second template for **you** (the admin notification), with these fields:
   `to_email, customer_name, customer_email, customer_phone, whatsapp_link, order_id, products, subtotal, delivery, total, city, address, notes, date`.
   Set **To email** to `nanaherbiotics@gmail.com` directly (or to `{{to_email}}`, which is
   already that address). Include `{{whatsapp_link}}` as a clickable link to message the
   customer directly. Note this **Template ID** too.
4. **Account → General** → copy your **Public Key**.
5. Add all four values to `.env.local` (see `.env.example`) and, when you deploy, to the
   same environment variables in Vercel/Netlify. Rebuild/redeploy.

Without these, checkout still works exactly as before: the order saves and opens in
WhatsApp, it just doesn't send an email.

## Using the dashboard

Sign in with Google using one of the two admin emails (the header has a small login
icon). You're taken straight to `/#admin`.

- **Products**: add a product with its own photo, price and details — it appears on the
  live site for everyone within moments. Remove one the same way.
- **Reviews**: delete a review that's spam or abusive.
- **Orders**: every order placed on the site, from any visitor, any device. **Export to
  Excel** downloads the current list as a spreadsheet whenever you need one — it isn't a
  file that updates itself, since the site has no server to keep a file on; the Orders
  table in Supabase is the live record, and this button turns it into a spreadsheet on
  demand.
