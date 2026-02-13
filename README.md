# 🏒 NHL StatScope

A player career stat explorer built with React + Vite, using the free NHL public API.

## Features
- 🔍 Live player search with debounced input
- 📊 Career stats chart (line or bar) via Recharts
- 📋 Full season-by-season stats table
- 🏒 Supports both skaters and goalies
- 🎨 Dark hockey-themed UI

## Stack
- **React 18** + **Vite**
- **Recharts** for data visualization
- **NHL Public API** (no key needed)
- CSS custom properties (no Tailwind dependency)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Build for production
npm run build
```

## Project Structure

```
src/
  components/
    SearchBar.jsx     ← Debounced search with dropdown
    PlayerCard.jsx    ← Player bio + current season stats
    StatChart.jsx     ← Career stat chart (Recharts)
    StatsTable.jsx    ← Full season-by-season table
  hooks/
    usePlayer.js      ← Data fetching + state management
  utils/
    nhlApi.js         ← All NHL API calls in one place
  App.jsx             ← Root component
  App.css             ← All styles
```

## NHL API Endpoints Used

```
# Player search (suggest API)
GET https://suggest.nhl.com/svc/suggest/v1/minplayers/{query}/10

# Player details + career stats
GET https://api-web.nhle.com/v1/player/{playerId}/landing
```

## Stretch Goals

Once the core is working, here are great features to add:
- **Compare mode** — search two players and show side-by-side stats
- **Favorites** — save players with localStorage
- **Team filter** — browse all players on a roster
- **Playoff stats** — toggle between regular season and playoffs
- **Share link** — URL param for `?player=8478402` so links work

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deploys.
