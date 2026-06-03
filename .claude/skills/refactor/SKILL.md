# Skill: Refactor

Improve code structure without changing external behavior.

## Usage

```
/refactor [target file or module]
```

## Guidelines

- Extract repeated logic into named helpers
- Prefer `ipcMain.handle` + `ipcRenderer.invoke` over send/on
- Keep components under 150 lines; split if larger
- Move DB queries out of IPC handlers into a persistence layer (`src/persistence/`)
- Move API surface definitions into `src/api/`

## Constraints

- Do not change public API signatures without updating callers
- Run `npm run build` and smoke test after each refactor step
- Commit each logical change separately
