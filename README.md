# CelerFast

A minimal personal activity tracker built with React Native (Expo) + Supabase. Record runs/walks, view history, and generate beautiful shareable PNG images.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Set environment variables
Edit `.env` at the project root:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Start the app
```bash
npx expo start
```

---

## Project Structure

```
src/
├── types/          # Shared TypeScript types (Activity, RoutePoint, etc.)
├── lib/            # Supabase client
├── stores/         # Zustand stores (auth, activity)
├── utils/          # Formatting helpers
├── navigation/     # React Navigation stack + tabs
├── screens/
│   ├── auth/       # Login / Sign up
│   ├── record/     # GPS recording screen
│   ├── activities/ # Activity history list
│   ├── detail/     # Activity detail + map
│   └── share/      # Share image generator (6 templates)
└── components/
    ├── RoutePolyline.tsx   # SVG route renderer
    └── templates/          # Template1–6
```

---

## Share Image Templates

| # | Name | Description |
|---|------|-------------|
| 1 | Route Only | Large transparent route SVG |
| 2 | Route + Distance | Route with big distance overlay |
| 3 | Full Stats | Route + distance/time/pace |
| 4 | Minimal Stats | Clean stats, no map |
| 5 | Poster Style | Branded poster layout |
| 6 | Dark Aesthetic | Dark with orange accents |

All templates export as transparent PNG via `react-native-view-shot`.

---

## Tech Stack

- **React Native** (Expo ~51)
- **TypeScript**
- **Supabase** — auth + database (no custom backend)
- **Zustand** — local state
- **React Navigation** — stack + bottom tabs
- **react-native-maps** — live GPS map
- **expo-location** — GPS tracking
- **react-native-svg** — route rendering in share images
- **react-native-view-shot** — PNG export
