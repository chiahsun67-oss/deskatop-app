# Runbook: Build & Release

## 前置準備

1. Node.js 20+ 已安裝
2. 執行 `npm ci` 安裝所有相依套件
3. 確認 `build/` 目錄有對應平台的 icon 檔案（見 `build/README.md`）

---

## 本機建置

### Windows（在 Windows 機器上執行）

```bash
npm run build:win
```

輸出：`dist/DeskatopApp Setup x.y.z.exe`（NSIS 安裝程式）

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

也可在 GitHub → Actions → Build → Run workflow 手動觸發。

完成後在 Actions 頁面下載 Artifacts：
- `dist-windows-latest` → Windows 安裝程式
- `dist-macos-latest` → macOS DMG
- `dist-ubuntu-latest` → Linux AppImage / deb

---

## 安裝後 DB 連線設定

安裝完成後，使用者需手動放置 `.env` 檔案：

| 平台 | .env 放置路徑 |
|---|---|
| Windows | `C:\Users\<USER>\AppData\Local\Programs\DeskatopApp\resources\.env` |
| macOS | `/Applications/DeskatopApp.app/Contents/Resources/.env` |
| Linux | `/opt/DeskatopApp/resources/.env` |

`.env` 內容範例：

```env
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password
```

---

## 安全警告說明

本版本跳過程式碼簽章。使用者安裝時：
- **Windows**：SmartScreen 警告 → 點「其他資訊」→「仍要執行」
- **macOS**：Gatekeeper 警告 → 系統偏好設定 → 安全性 → 「仍要開啟」
- **Linux**：AppImage 需先 `chmod +x *.AppImage` 再執行

---

## 版本號更新

發布前更新 `package.json` 中的 `"version"` 欄位，再 commit + tag：

```bash
# 修改 package.json version 後
git add package.json
git commit -m "chore: release v1.0.1"
git tag v1.0.1
git push origin main --tags
```
