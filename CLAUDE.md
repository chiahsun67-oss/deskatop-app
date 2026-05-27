# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev mode — hot reload for renderer, restarts main on changes
npm run build        # compile all three targets (main, preload, renderer) to out/
npm run build:win    # build + package to Windows NSIS installer in dist/
node scripts/verify.mjs  # headless Playwright smoke test: screenshots to tmp/shots/
```

## Environment

Copy `.env.example` to `.env` before running. Required variables:

```
DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD  — PostgreSQL connection
PORT                                                  — app port (currently unused by renderer)
```

## Architecture

Electron app with three separate build targets via `electron-vite`:

| Target | Source | Output |
|---|---|---|
| Main process | `src/main/index.js` | `out/main/index.js` |
| Preload | `src/preload/index.js` | `out/preload/index.js` |
| Renderer (React + Vite) | `src/renderer/` | `out/renderer/` |

The renderer is a standard React 18 SPA. `src/renderer/index.html` is the Vite entry; `src/renderer/src/main.jsx` bootstraps React.

### Auth flow

1. `Login.jsx` calls `window.electronAPI.login(username, password)`
2. Preload bridges it via IPC `auth:login` to the main process
3. Main process queries `wmsm.users WHERE username=$1 AND password=$2` (plain-text comparison)
4. Returns `{ success: true }` or `{ success: false, error?: string }`
5. `App.jsx` switches from `<Login>` to `<Dashboard>` on success

> **Note:** passwords in `users` table must be stored as plain text for current comparison logic. If the DB uses bcrypt hashes, install `bcryptjs` and replace the SQL query with `SELECT password FROM users WHERE username=$1` + `bcrypt.compare(input, hash)`.

### Styling

No CSS framework. Two files:
- `src/renderer/src/styles/global.css` — reset + soft gradient background (`#e8eaf6 → #fce4ec → #e3f2fd`)
- `src/renderer/src/styles/login.css` — frosted glass card (`backdrop-filter: blur(24px) saturate(180%)`)

macOS system font stack: `'SF Pro Display', system-ui, -apple-system, ...`

### IPC

`src/preload/index.js` exposes `window.electronAPI.login()` via `contextBridge`. Add new IPC channels here when needed.

## Known config

- `electron.vite.config.js` marks `pg-native` as external — this prevents a Rollup bundling error since `pg` optionally imports it but it's not installed.
- Window: `frame: false`, `resizable: false`, `1100×700`. Inputs have `-webkit-app-region: no-drag` so they're clickable inside the frameless window.
