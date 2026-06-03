# src/api

IPC client layer — abstracts all `window.electronAPI` calls made by the renderer.

## Purpose

Centralise renderer-side IPC so components never call `window.electronAPI` directly.
Each function here maps 1:1 to an IPC channel exposed in `src/preload/index.js`.

## Example

```js
// src/api/auth.js
export async function login(username, password) {
  return window.electronAPI?.login(username, password)
}
```

## Rules

- Always guard with `?.` in case preload is unavailable
- Return shape must match what the main process sends (`{ success, error? }`)
- No UI logic here — pure data calls only
