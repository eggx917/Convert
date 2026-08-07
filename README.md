# Convert

A modern, minimal unit conversion web app with **18 conversion types**.

## Open the app

- **Code:** https://github.com/eggx917/Convert
- **Live (after the one step below):** https://eggx917.github.io/Convert/

## Publish the live site (one time — do this on github.com)

GitHub will not let Actions create Pages for this repo automatically. Use **branch deploy**:

1. Open: https://github.com/eggx917/Convert/settings/pages
2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
3. Click **Save**
4. Wait ~30–60 seconds, then open: https://eggx917.github.io/Convert/

No GitHub Actions workflow is required. Every push to `main` updates the site.

### If you previously chose “GitHub Actions”

Either switch Source to **Deploy from a branch** as above, or keep Actions and set Source to **GitHub Actions** — but branch deploy is simpler for this static app.

## Features

Length, Weight, Temperature, Volume, Area, Speed, Time, Energy, Power, Pressure, Data, Angle, Frequency, Force, Fuel economy, Density, Cooking, Illuminance.

## Local

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
```
