# Ring Vault — Blue Nile 3D Ring Catalog

A 3D ring catalog (380 designs) built with React + Vite + React Three Fiber. Browse settings on the catalog page, then open the 3D studio to view a ring in real time, change metal / diamond shape / size, and inspect the auto-fitted side stones and center stone.

## Stack
- Vite 5 + React 18 + TypeScript
- React Three Fiber + Drei (WebGL, GLTF, contact shadows, refraction)
- Tailwind CSS (Blue Nile palette)
- React Router (SPA)

## Local development
```bash
npm install
npm run dev        # http://localhost:8090
```

## Build
```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploy to Cloudflare Pages (Git integration)

1. Push this repo to GitHub / GitLab.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick this repo. Set:
   - **Project name:** `ring-vault`
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variables:** `NODE_VERSION = 20`
4. Click **Save and Deploy**. The first build takes ~2 min; subsequent deploys are ~1 min.
5. Live at `https://ring-vault.pages.dev`.

### SPA routing
`public/_redirects` is set to `/*  /index.html  200` so deep links like `/secret-vault?sku=501410` load the React app instead of 404-ing.

### Custom domain
In the Cloudflare Pages project → **Custom domains** → **Set up a custom domain** → add your domain (Cloudflare will auto-issue the cert).

## Heavy 3D assets — Cloudflare R2

The 1.5 GB of ring + stone GLTFs (`public/models/jewelry/`) is too large to ship inside a Pages deploy. We host it in **Cloudflare R2** instead, and the React app loads each model on demand via a public bucket URL.

### One-time setup (in Cloudflare dashboard)

1. **R2 → Create bucket** → name it `jewelry-assets` (or any name).
2. **Settings → Public access** → either:
   - Enable the `*.r2.dev` subdomain (instant, gives you `https://pub-xxxxx.r2.dev`), or
   - Connect a custom domain like `models.your-domain.com` (auto TLS).
3. **Settings → CORS** → add the Pages origin so the browser can load GLTFs cross-origin:
   ```json
   [
     {
       "AllowedOrigins": ["https://ring-vault.pages.dev", "https://your-custom-domain.com"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["Content-Length", "Content-Type", "ETag"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

### Upload the models

The repo ships with a wrangler-based upload script. One-time setup:

```bash
npx wrangler login                                       # OAuth with Cloudflare
npm run upload:r2 -- jewelry-assets ring380models 8      # 1.5 GB / ~3,000 files
```

That uploads to bucket `jewelry-assets` with key prefix `ring380models/` — the full key for a ring will be `ring380models/Blue_Nile/Rings/SKU/501410/JV/100_CT/Ring_501410_JV_RND_100.gltf`.

The script:
- Walks `public/models/jewelry/` and uploads each file with `wrangler r2 object put`
- Preserves directory structure under the `ring380models/` prefix
- Sets `Content-Type` and `Cache-Control: public, max-age=31536000, immutable` on each object
- Skips files that already exist in R2 with the same size (safe to re-run)
- Runs N files in parallel (default 8) with progress + ETA

Re-run anytime you add new SKUs or stones. It only uploads what's changed.

### Wire it into the app

Add the bucket URL to the Pages project as an env var (INCLUDE the `ring380models/` prefix):
- Pages project → **Settings** → **Environment variables** → **Add**
- Name: `VITE_R2_BASE_URL`
- Value: `https://pub-xxxxx.r2.dev/ring380models` (or your custom domain with the same path)

The value is baked into the bundle at build time. Re-deploy once after setting it.

For local dev, leave the env var unset — the loader falls back to `public/models/jewelry` from your local filesystem.

## Deploy to Cloudflare Pages (CLI alternative)
```bash
npm install -D wrangler
npx wrangler login
npm run build
npx wrangler pages deploy dist --project-name=ring-vault
```

## Repo structure
```
public/
  _redirects             ← SPA fallback
  fonts/                 ← icomoon.ttf (icon pack)
  shapes/                ← diamond-shape .webp icons
  models/jewelry/        ← 380 ring GLTFs + stone GLTFs (large)
  images/jewelry/        ← matcap textures
  env/                   ← HDR environment
src/
  pages/                 ← CatalogListing, StudioViewer, HiddenDesignsCatalog
  components/
    catalog/             ← ProductCard, FilterRail, ShapeGrid, …
    studio/              ← ConfigPanel, ShapePicker, Viewport, …
    ui/                  ← Skeleton, Toast, StarRating, …
  lib/                   ← shape-icons, blue-nile-names, icomoon-map, …
  data/                  ← sku_available_shapes.json, shipping-dates.ts
  styles/                ← icomoon.css, index.css
```
