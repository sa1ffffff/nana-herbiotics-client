# Connecting reviews to Supabase

Until these steps are done, reviews work in "preview mode": they save only in the visitor's own browser.

1. Create a project at https://supabase.com (free tier is fine).
2. Open **SQL Editor → New query**, paste the contents of `reviews.sql`, and run it.
   This creates the `reviews` table with row-level security:
   - anyone can **read approved** reviews
   - anyone can **submit** a review, and it is published straight away
   - nobody can edit or delete from the website
3. In **Project Settings → API**, copy the **Project URL** and the **anon public** key.
4. Create `.env.local` in the project root (it is git-ignored):

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

   On Vercel/Netlify, add the same two variables in the site's environment settings.
5. Rebuild (`npm run build`). The "Preview mode" note disappears once it's connected.

## Hiding reviews

Reviews publish instantly. To hide one (spam, abuse), go to **Table Editor → reviews** and untick **approved**.
To remove it completely, delete the row. The site shows the latest 200 approved reviews.

If you set up the table before instant publishing, run `auto-publish.sql` once to switch over.
