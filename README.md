# Andrew's Taxi Lebanon - Website

A modern, high-conversion web application for Andrew's Taxi, a premium transportation service in Lebanon. This site is designed to drive bookings via WhatsApp and provide users with transparent fare estimates.

## 🚀 Features

- **Fare Estimator**: Fixed prices per route, taken from a price list in `constants.ts`. No external API, no API key, nothing metered.
- **WhatsApp Integration**: One-click booking with pre-filled messages for seamless user experience.
- **Conversion Focused Design**: High-impact Hero section, professional services overview, and trust signals (Google Reviews).
- **Responsive Branding**: Fully themed with Andrew's Taxi signature **Navy & Gold** color palette.
- **Optimized for Performance**: Built with React 19, Tailwind CSS, and Lucide icons.

## 🛠️ Tech Stack

- **Framework**: React 19 (ES Modules)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter (via Google Fonts)

## 📁 Project Structure

```text
├── components/          # React components (Hero, Header, Estimator, etc.)
├── public/              # Brand assets (Favicon, Logos) - MUST BE CREATED MANUALLY
├── constants.ts         # Areas, route prices, contact info
├── pricing.ts           # Fare lookup — the one place a price is produced
├── types.ts             # TypeScript interfaces
├── App.tsx              # Main application entry point
├── index.html           # HTML template and Tailwind config
└── index.tsx            # DOM mounting
```

## ⚙️ Setup & Configuration

### 1. Route Prices

Prices live in `constants.ts`:

- `ZONES` — the areas customers can pick from in the dropdowns.
- `ROUTE_PRICES` — one line per route, e.g. `{ from: 'bey-airport', to: 'jounieh', oneWay: 35 },`

Direction does not matter: write each route once. Any route **not** listed shows
"Price on request" and sends the customer to WhatsApp with their trip details already
filled in — nothing breaks, you just quote that one by hand.

`ROUTE_PRICES` ships **empty on purpose**, so every route quotes on request until real
prices are agreed. Once they are, set `FARE_RULES.PRICES_CONFIRMED` to `true` and the
site changes "Indicative Price" to "Fixed Price".

### 2. Pricing Rules
`FARE_RULES` in `constants.ts` holds the minimum fare, the round-trip multiplier, and the
free waiting time. All fare logic lives in `pricing.ts` — both the fare estimator and the
booking chatbot read from it, so a price only ever has to be changed in one place.

### 3. WhatsApp Integration
Update `PHONE_NUMBER_CLEAN` in `constants.ts` with the target phone number (international format without `+`).

## 🎨 Asset Management (IMPORTANT)

To ensure the branding displays correctly, create a `public/` folder in the root directory and add these files:

- `logo.png`: The primary brand logo (Navy text) for the sticky header.
- `logo-white.png`: The inverted brand logo (White text) for the dark footer.
- `favicon.png`: The "A" mark for the browser tab.

*If these files are missing, the app will automatically fall back to a high-quality SVG vector logo.*

## 🌐 Deployment

Deployed on Vercel. Pushing to `main` triggers a production deploy.

The live site is **https://www.andrewstaxi.com**. The bare `andrewstaxi.com` 308-redirects
to it, so the canonical URL, JSON-LD, sitemap and robots.txt all name the `www.` form — the
address that actually resolves.

`andrewstaxilb.com` is a legacy domain: it no longer resolves (NXDOMAIN) and should be
detached from the Vercel project. `andrewtaxi.com` was a typo and has never existed.

**This project requires no environment variables and no API keys.** The fare estimator,
the booking chatbot and the support chat all run entirely in the browser with no paid
service behind them. The only outbound requests are Google Fonts and Open-Meteo (the
free, keyless weather badge in the hero).

---
*Developed by Andrew's Taxi Tech Team.*