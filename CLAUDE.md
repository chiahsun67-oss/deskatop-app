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
PORT                                                  — reserved (currently unused)
```

## Architecture

Electron app with three separate build targets via `electron-vite`:

| Target | Source | Output |
|---|---|---|
| Main process | `src/main/index.js` | `out/main/index.js` |
| Preload | `src/preload/index.js` | `out/preload/index.js` |
| Renderer (React + Vite) | `src/renderer/` | `out/renderer/` |

### Auth flow

1. `Login.jsx` calls `window.electronAPI.login(username, password)`
2. Preload bridges via IPC channel `auth:login` to the main process
3. Main process queries `wmsm.users WHERE username=$1 AND password=$2` (plain-text comparison — see Known Issues)
4. Returns `{ success: true }` or `{ success: false, error?: string }`
5. `App.jsx` switches from `<Login>` to `<Dashboard>` on success

### Styling

No CSS framework. Two files:
- `src/renderer/src/styles/global.css` — reset + soft gradient background (`#e8eaf6 → #fce4ec → #e3f2fd`)
- `src/renderer/src/styles/login.css` — frosted glass card (`backdrop-filter: blur(24px) saturate(180%)`)

macOS system font stack: `'SF Pro Display', system-ui, -apple-system, ...`

### IPC

`src/preload/index.js` exposes `window.electronAPI.login()` via `contextBridge`. Add new IPC channels here when needed (always use `ipcMain.handle` + `ipcRenderer.invoke` pattern).

## Known Issues (from code review)

These are confirmed issues to fix before production:

| Severity | File | Issue | Fix |
|---|---|---|---|
| 🔴 HIGH | `src/main/index.js:19` | Passwords compared as plaintext | Install `bcryptjs`, use `bcrypt.compare(input, hash)` |
| 🔴 HIGH | `src/main/index.js:8` | `pg.Pool` has no `error` event listener; DB disconnect crashes main process | Add `pool.on('error', err => console.error('[pool]', err))` |
| 🟠 MED | `src/main/index.js:25` | DB error message returned directly to renderer (info leak) | Return generic string; log details server-side only |
| 🟠 MED | `src/renderer/src/App.jsx:21` | `authed` state lives only in renderer memory; bypassable via DevTools | Issue a session token from main process; validate on each IPC call |
| 🟡 LOW | `src/main/index.js:38` | `sandbox: false` disables Chromium renderer sandbox | Enable sandbox and adjust preload to use only IPC (no direct Node imports) |
| 🟡 LOW | `src/renderer/src/pages/Login.jsx:26` | `window.electronAPI` called without null-check | Change to `window.electronAPI?.login(...)` |
| 🟡 LOW | `src/main/index.js:16` | No type/length validation on IPC username/password | Add guard: `if (typeof username !== 'string' \|\| username.length > 255)` |

## Known Config Quirks

- `electron.vite.config.js` marks `pg-native` as Rollup external — prevents a bundling error since `pg` optionally imports it but it is not installed.
- Window is `frame: false`, `resizable: false`, `1100×700`. Inputs have `-webkit-app-region: no-drag` to remain clickable inside the frameless window.
- `dotenv/config` is imported at the top of `src/main/index.js` so `.env` is loaded before the `pg.Pool` is constructed. In production (packaged build), place `.env` alongside the executable or set system environment variables.
