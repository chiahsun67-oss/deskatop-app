import 'dotenv/config'
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'wmsm',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD   // must remain a truthy string; '' causes pg SASL to receive null
})

pool.on('error', (err) => console.error('[pool]', err))

ipcMain.handle('auth:login', async (_event, username, password) => {
  if (typeof username !== 'string' || username.length > 255 ||
      typeof password !== 'string' || password.length > 255) {
    return { success: false, error: '輸入格式錯誤' }
  }
  if (!process.env.DB_PASSWORD) {
    return { success: false, error: '找不到資料庫設定，請確認 .env 檔案已放置在應用程式目錄中' }
  }
  try {
    const { rows } = await pool.query(
      'SELECT id FROM wmsm.users WHERE username = $1 AND password = $2 LIMIT 1',
      [username, password]
    )
    return { success: rows.length > 0 }
  } catch (err) {
    console.error('[auth:login]', err.message)
    return { success: false, error: '資料庫連線失敗，請檢查設定' }
  }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    resizable: false,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#f0f2f8',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    pool.end()
    app.quit()
  }
})
