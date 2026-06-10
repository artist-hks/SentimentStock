# SentimentStock — NSE Hinglish Sentiment Analyzer

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-success?style=for-the-badge&logo=vercel)](https://sentiment-stock-hks.vercel.app)

A portfolio-grade **React + Vite** single-page application that simulates a Bloomberg-Terminal-style dashboard for **NSE/BSE stock movement prediction** powered by a **Hinglish (Hindi + English mixed) financial sentiment** NLP engine.

**🌐 Live Application:** [https://sentiment-stock-hks.vercel.app](https://sentiment-stock-hks.vercel.app)

> Screenshot: SentimentStock Dashboard

---

## 🎯 What this project demonstrates

A full data-science product surface built on top of (simulated) ML pipelines:

1. **Hinglish NLP sentiment scoring** of news + social mentions
2. **Lag correlation analysis** between sentiment and price movement
3. **LSTM-style next-day prediction** with confidence and feature importance
4. **Live trading-terminal UI** with real-time price ticks, sentiment gauge, and market overview

All data is **mocked / simulated on the client** — no API keys required.

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5** (instant HMR, zero config)
- **Tailwind CSS 3** for utility styling
- **Recharts 2** for all charts (composed price + sentiment, lag-correlation bars, mini sparklines)
- **lucide-react** for icons
- **Inter** font (Google Fonts)
- Pure **SVG** for the custom semicircular sentiment gauge with animated needle

---

## 🚀 Setup & Run

```bash
npm install
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

---

## ✨ Features Implemented

| Area | Feature |
|---|---|
| **Header** | Logo, fixed top bar, real-time IST clock (updates every 1s), NSE OPEN/CLOSED status based on actual IST hours, animated LIVE pulse dot |
| **Search** | Autocomplete with all 15 companies, sector-colored badges, live prices, change %, click-outside to close |
| **Live ticks** | Every 5 seconds: ±0.12% price moves, ±0.015 sentiment shifts, green/red price flash animation on the live price card |
| **Metric Cards** | 4-card row: Live Price + mini sparkline, Sentiment 0-100 score, LSTM Prediction (UP/DOWN), 24h Mentions split |
| **Price Chart** | Recharts ComposedChart with dual Y-axis: purple price line + teal sentiment area, range toggle 1W/1M/3M, custom dark tooltip |
| **Sentiment Gauge** | Hand-crafted SVG semicircle with 3 colored zones (red/amber/green), smoothly animated needle (CSS rotate w/ 0.8s ease), Hindi/English mention split |
| **News Panel** | Filtered by company, language filter chips (All/Hindi/English/Hinglish), expandable summaries, sentiment + language badges, custom scrollbar |
| **Lag Correlation** | Recharts BarChart showing correlation at 0–48h lags, positive bars purple / negative red, insight callout under chart |
| **Prediction Panel** | LSTM direction icon, confidence bar, feature importance bars (Sentiment / Momentum / Volume), accuracy vs random-baseline, disclaimer |
| **Market Overview** | All 15 NSE companies as clickable cards with mini sentiment bar + UP/DOWN tag — click to switch the selected stock |
| **Responsiveness** | Layout reflows on viewports < 1100px and < 900px |

---

## 🌐 Functional Entry URI

This is a single-page app, so all functionality lives at the root:

- **`/`** — full dashboard
  - **State parameters** (held in React state, not URL):
    - `selectedSymbol` — currently selected NSE ticker (default `RELIANCE`)
    - `activeTimeRange` — 1W / 1M / 3M for the price chart (default `1M`)
    - `newsFilter` — All / Hindi / English / Hinglish (default `All`)

No backend routes — everything is rendered client-side.

---

## 🧬 Architecture

The app is structured as a four-layer pipeline (simulated end-to-end):

```
┌────────────────────────┐    ┌──────────────────────┐    ┌────────────────────┐    ┌──────────────────┐
│ 1. Data Ingestion      │ →  │ 2. Sentiment Engine  │ →  │ 3. Lag Analysis    │ →  │ 4. Prediction    │
│                        │    │                      │    │                    │    │                  │
│ • NSE prices (15)      │    │ • Hinglish NLP       │    │ • Sentiment ↔ price│    │ • LSTM + sent.   │
│ • News (ET, MC, Mint)  │    │ • Hindi / English /  │    │   correlation at   │    │   features       │
│ • Social (Reddit, ST)  │    │   Hinglish classify  │    │   lags 0h–48h      │    │ • UP/DOWN + conf │
└────────────────────────┘    └──────────────────────┘    └────────────────────┘    └──────────────────┘
```

### Source layout

```
src/
├── App.jsx                       # Layout & state
├── main.jsx                      # React 18 root
├── index.css                     # Tailwind + dark scrollbars + flash animations
├── data/
│   ├── companies.js              # 15 NSE companies (RELIANCE, TCS, HDFCBANK …)
│   ├── mockNews.js               # 25 Hinglish/Hindi/English news items
│   └── generateData.js           # 90-day OHLC walk, lag data, sparklines
├── components/                   # All 9 components
├── hooks/
│   └── useRealTimeData.js        # 5s tick simulator + flash detection
└── utils/
    └── sentimentCalc.js          # Formatters, color maps, label mapping
```

---

## 💾 Data Models

### Company
```js
{ symbol, name, sector, basePrice, price, change, changeAmount,
  volume, marketCap, sentiment (0-1), sentimentLabel, sentimentColor,
  prediction ("UP"|"DOWN"), confidence, mentions24h, mentionsChange }
```

### News Item
```js
{ id, company, headline, summary, source, timeAgo,
  sentiment (0-1), sentimentLabel, sentimentColor,
  language ("hindi"|"english"|"hinglish"), type ("news"|"social") }
```

### Historical Point
```js
{ date: "DD MMM", price, sentiment (0-1), volume }
```

### Lag Point
```js
{ lag (hours), corr (-1..1) }
```

### Storage

All data lives in-memory in React state. **No external storage service is used** — the project is fully client-side with mocked data, suitable for a portfolio / demo deployment to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## 🧪 Not Yet Implemented (Future work)

- Real NSE/BSE WebSocket integration (currently simulated 5s tick)
- True backend Hinglish NLP model (currently labels are pre-computed in mock data)
- Persistent watchlists / user accounts
- Backtesting visualizer with historical predictions vs realized outcomes
- Email / Telegram alerts on sentiment-driven triggers
- Export-to-CSV for chart data
- More NSE stocks (currently 15) and sectoral / index-level views

---

## 🗺️ Recommended Next Steps

1. **Replace mock ingestion** with a small Node/Express or FastAPI proxy that fetches NSE bhavcopy + news RSS and pushes via WebSocket.
2. **Train a small Hinglish FinBERT** on the 847-sample corpus referenced in the model card and serve via an inference endpoint.
3. **Add a backtest tab** that replays the last 6 months and overlays predictions on realized prices.
4. **Persist user preferences** (selected symbol, theme, watchlist) via `localStorage`.
5. **Wire a real LSTM** in TensorFlow.js client-side for the prediction layer once the proxy provides clean OHLCV + sentiment series.

---

## ⚠️ Disclaimer

**Educational / portfolio project. Not financial advice.** All numbers shown — prices, sentiment scores, predictions, model accuracy — are simulated for demonstration purposes only. Past performance does not guarantee future results.
