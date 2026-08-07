# Convert

A modern, minimal unit conversion web app.

## Features

- **18 conversion types**: Length, Weight, Temperature, Volume, Area, Speed, Time, Energy, Power, Pressure, Data, Angle, Frequency, Force, Fuel economy, Density, Cooking, Illuminance
- Clean, minimal UI with light/dark system theme support
- Swap units in one click
- Bidirectional input
- Works fully offline in the browser

## Live site

**https://eggx917.github.io/Convert/**

### One-time GitHub Pages setup (required once)

The deploy workflow cannot create the Pages site by itself on this account. Enable it once:

1. Open **https://github.com/eggx917/Convert/settings/pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Save
4. Open **Actions** → re-run **Deploy to GitHub Pages**, or push any commit to `main`

After that, every push to `main` deploys automatically.

### Alternative (no Actions)

On the same Pages settings page, choose **Deploy from a branch**, branch **main**, folder **/ (root)**. Then you can disable the Actions workflow if you prefer.

## Run locally

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080
