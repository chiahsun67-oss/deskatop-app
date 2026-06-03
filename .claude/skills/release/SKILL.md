# Skill: Release

Package and publish a new version of the desktop app.

## Usage

```
/release [patch|minor|major]
```

## Steps

1. Ensure working tree is clean (`git status`)
2. Run full build: `npm run build`
3. Run smoke test: `node scripts/verify.mjs`
4. Bump version in `package.json`
5. Commit: `git commit -m "chore: release vX.Y.Z"`
6. Tag: `git tag vX.Y.Z`
7. Package installer: `npm run build:win`
8. Confirm artifact exists in `dist/`

## Notes

- Installer output: `dist/*.exe` (NSIS)
- Place `.env` alongside the executable for production DB config
