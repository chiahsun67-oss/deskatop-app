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
  password: process.env.DB_PASSWORD || ''
})

ipcMain.handle('auth:login', async (_event, username, password) => {
  try {
    const { rows } = await pool.query(
      'SELECT id FROM users WHERE username = $1 AND password = $2 LIMIT 1',
      [username, password]
    )
    return { success: rows.length > 0 }
  } catch (err) {
    console.error('[auth:login]', err.message)
    return { success: false, error: '資料庫連線失敗：' + err.message }
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
