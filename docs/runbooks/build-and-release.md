# Runbook: Build & Release

## 前置準備

1. Node.js 20+ 已安裝
2. 執行 `npm ci` 安裝所有相依套件
3. 確認 `.env` 在專案根目錄（打包時會自動帶入）
4. 確認 `build/` 目錄有 icon 檔案（若無執行 `npm run gen:icons`）

---

## 本機建置

### Windows（在 Windows 機器上執行）

```bash
npm run build:win
```

輸出：`dist/DeskatopApp Setup x.y.z.exe`（NSIS 安裝程式）

> ⚠️ **首次執行**需預先解壓 winCodeSign cache（Windows 無 Developer Mode 時）：
> ```powershell
> $7za = ".\node_modules\7zip-bin\win\x64\7za.exe"
> $url = "https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.6.0/winCodeSign-2.6.0.7z"
> $dest = "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign\winCodeSign-2.6.0"
> New-Item -Force -ItemType Directory $dest | Out-Null
> Invoke-WebRequest $url -OutFile "$env:TEMP\wcs.7z" -UseBasicParsing
> & $7za x -y "$env:TEMP\wcs.7z" "-o$dest"
> ```

### macOS（在 macOS 機器上執行）

```bash
npm run build:mac
```

輸出：`dist/DeskatopApp-x.y.z.dmg`（x64 + arm64 通用）

### Linux（在 Linux 機器上執行）

```bash
npm run build:linux
```

輸出：
- `dist/DeskatopApp-x.y.z.AppImage`
- `dist/DeskatopApp_x.y.z_amd64.deb`

---

## GitHub Actions 自動建置（推薦）

推送 tag 即自動觸發三平台建置：

```bash
git tag v1.0.0
git push origin v1.0.0
```

完成後在 GitHub → Actions → Build → Artifacts 下載：
- `dist-windows-latest` → Windows 安裝程式
- `dist-macos-latest` → macOS DMG
- `dist-ubuntu-latest` → Linux AppImage / deb

---

## .env 處理

`.env` 透過 `extraResources` 自動打包進安裝檔，安裝後位於：

| 平台 | 路徑 |
|---|---|
| Windows | `C:\Users\<USER>\AppData\Local\Programs\DeskatopApp\resources\.env` |
| macOS | `/Applications/DeskatopApp.app/Contents/Resources/.env` |
| Linux | `/opt/DeskatopApp/resources/.env` |

重新安裝時安裝檔會自動覆蓋 `.env`，無需手動複製。
若要更換資料庫設定，修改專案根目錄的 `.env` 後重新執行 `npm run build:win`。

---

## 安全警告說明（未簽章）

- **Windows**：SmartScreen 警告 → 點「其他資訊」→「仍要執行」
- **macOS**：Gatekeeper 警告 → 系統設定 → 隱私權與安全性 → 「仍要開啟」
- **Linux**：AppImage 需先 `chmod +x *.AppImage` 再執行

---

## 版本號更新

```bash
# 修改 package.json 中的 "version"，然後：
git add package.json
git commit -m "chore: release v1.0.1"
git tag v1.0.1
git push origin main --tags
```

---

## Smoke Test

```bash
npm run build          # 先建置
node scripts/verify.mjs  # 截圖輸出至 tmp/shots/
```

確認 `tmp/shots/03-dashboard.png` 顯示 Dashboard 頁面即為成功。
