# Architecture

## Overview

Electron desktop app with three build targets via `electron-vite`:

- **Main process** (`src/main/`) — Node.js, handles IPC, DB, system APIs
- **Preload** (`src/preload/`) — bridges renderer ↔ main via `contextBridge`
- **Renderer** (`src/renderer/`) — React + Vite, UI only

## Module Layout

```
src/
├── main/        # Electron main process, IPC handlers, DB queries
├── preload/     # contextBridge surface exposed to renderer
├── renderer/    # React app (pages, components, styles)
├── api/         # (planned) abstracted IPC / API client layer
└── persistence/ # (planned) DB access layer
```

## Auth Flow

1. `Login.jsx` → `window.electronAPI.login(user, pass)`
2. Preload forwards via IPC channel `auth:login`
3. Main queries PostgreSQL `wmsm.users`
4. Returns `{ success: true/false }`
5. `App.jsx` swaps `<Login>` → `<Dashboard>`

## Key Decisions

See `decisions/` for Architecture Decision Records (ADRs).

## Styling

No CSS framework — two global files:
- `src/renderer/src/styles/global.css` — gradient background
- `src/renderer/src/styles/login.css` — frosted glass card
