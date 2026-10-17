# Flux — Multi-Currency Converter PWA

Responsive, animated installable PWA converting one amount into all 12 supported currencies: USD, EUR, GBP, INR, JPY, AUD, CAD, CHF, CNY, AED, SGD and NZD.

## Test locally
In this folder, run:
```bash
python -m http.server 8000
```
Open http://localhost:8000. Live conversion requires internet.

## Publish a public HTTPS link with GitHub Pages
1. Create a public GitHub repository (example: `flux-currency-converter`).
2. Upload all files from this folder into the repository root, not the ZIP file itself.
3. Open **Settings → Pages**.
4. Under Build and deployment, select **Deploy from a branch**, choose `main` and `/(root)`, then Save.
5. Wait for deployment to finish. GitHub displays your public URL, usually `https://YOUR-USERNAME.github.io/flux-currency-converter/`.
6. Open that HTTPS link on your devices. On Android, use the browser menu → Install app/Add to Home screen. On iPhone, open in Safari → Share → Add to Home Screen. On desktop, use the browser's Install option if available.

## Notes
- The public repository contains all source code; do not commit secrets or private information.
- The app shell can be cached for repeat visits, but exchange-rate lookups need internet.
- PWA installation differs by browser and OS. Not every device offers the same install prompt.
- This browser version calls open.er-api.com directly. If a browser/network blocks the request, inspect the browser console or use a backend proxy/API that supports browser calls.
