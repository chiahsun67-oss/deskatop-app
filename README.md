# DeskatopApp

Windows 桌面應用程式，以 Electron + React 開發，登入頁面採 macOS Big Sur 毛玻璃淺色風格，驗證串接 PostgreSQL 資料庫。

## 畫面預覽

| 登入頁面 | 錯誤提示 | 登入成功 |
|---|---|---|
| ![login](assets/screenshots/01-login.png) | ![error](assets/screenshots/02-error.png) | ![dashboard](assets/screenshots/03-dashboard.png) |

## 技術棧

| 層級 | 選擇 |
|---|---|
| 桌面運行時 | Electron 33 |
| 建置工具 | electron-vite 3 |
| 前端框架 | React 18 + Vite |
| 樣式 | 純 CSS（backdrop-filter 毛玻璃） |
| 資料庫 | PostgreSQL（node-postgres） |
| 打包工具 | electron-builder（NSIS 安裝檔） |

## 快速開始

```bash
# 安裝依賴
npm install

# 設定環境變數（複製並修改）
cp .env.example .env

# 開發模式（熱重載）
npm run dev

# 建置
npm run build

# 打包 Windows 安裝檔（輸出至 dist/）
npm run build:win
```

## 環境變數設定

複製 `.env.example` 為 `.env` 並填入資料庫資訊：

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=wmsm
DB_USER=postgres
DB_PASSWORD=your_password
```

## 專案結構

```
├── src/
│   ├── main/
│   │   └── index.js          # Electron 主程序、資料庫連線、IPC 處理
│   ├── preload/
│   │   └── index.js          # contextBridge IPC 橋接
│   └── renderer/
│       ├── index.html
│       └── src/
│           ├── main.jsx       # React 入口
│           ├── App.jsx        # 路由：登入 / Dashboard
│           ├── pages/
│           │   └── Login.jsx  # 登入頁面元件
│           └── styles/
│               ├── global.css # 全域重置 + 背景漸層
│               └── login.css  # 毛玻璃卡片樣式
├── scripts/
│   └── verify.mjs             # Playwright 自動化截圖驗證
├── .env.example               # 環境變數範本
├── electron.vite.config.js
└── package.json
```

## 資料庫

需要 PostgreSQL 資料庫 `wmsm`，內含 `users` 表格：

```sql
CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

## UI 驗證

```bash
# 需先執行 npm run build
node scripts/verify.mjs
# 截圖輸出至 tmp/shots/
```
