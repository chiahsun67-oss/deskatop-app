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

1. `Login.jsx` → `window.electronAPI?.login(user, pass)`
2. Preload forwards via IPC channel `auth:login`
3. Main queries `users WHERE username = $1`, fetches hash
4. `bcrypt.compare(input, hash)` for bcrypt accounts; plain-text compare for legacy
5. Returns `{ success: true/false }`
6. `App.jsx` swaps `<Login>` → `<Dashboard>`

## Key Decisions

See `decisions/` for Architecture Decision Records (ADRs).

## Styling

No CSS framework — two global files:
- `src/renderer/src/styles/global.css` — gradient background
- `src/renderer/src/styles/login.css` — frosted glass card

## Packaging

Three-platform builds via `electron-builder`:

| Platform | Command | Output |
|---|---|---|
| Windows | `npm run build:win` | `dist/DeskatopApp Setup x.y.z.exe` |
| macOS | `npm run build:mac` | `dist/DeskatopApp-x.y.z.dmg` |
| Linux | `npm run build:linux` | `dist/*.AppImage`, `dist/*.deb` |

`.env` is bundled via `extraResources` → installed to `resources/.env` automatically.
