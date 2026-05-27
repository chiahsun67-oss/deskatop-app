import { _electron as electron } from 'playwright-core'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const APP_DIR = join(__dirname, '..')
const SHOTS = join(APP_DIR, 'tmp/shots')
mkdirSync(SHOTS, { recursive: true })

const electronBin = join(APP_DIR, 'node_modules/electron/dist/electron.exe')

console.log('Launching Electron app...')
const app = await electron.launch({
  executablePath: electronBin,
  args: [join(APP_DIR, 'out/main/index.js')],
  env: { ...process.env, NODE_ENV: 'production' },
  timeout: 30_000
})

await new Promise(r => setTimeout(r, 3000))
const page = app.windows().find(w => !w.url().startsWith('devtools://'))
  ?? await app.firstWindow()

console.log('Window:', page.url())

// Screenshot 1: initial login page
await page.screenshot({ path: join(SHOTS, '01-login.png') })
console.log('✓ Screenshot: 01-login.png')

// Test wrong credentials — use locator.fill() to properly trigger React state
await page.locator('input[placeholder="帳號"]').fill('wrong')
await page.locator('input[placeholder="密碼"]').fill('wrong')
await page.locator('.login-btn').click()
await new Promise(r => setTimeout(r, 700))

await page.screenshot({ path: join(SHOTS, '02-error.png') })
console.log('✓ Screenshot: 02-error.png')

// Test correct credentials
await page.locator('input[placeholder="帳號"]').fill('admin')
await page.locator('input[placeholder="密碼"]').fill('admin123')
await page.locator('.login-btn').click()
await new Promise(r => setTimeout(r, 800))

await page.screenshot({ path: join(SHOTS, '03-dashboard.png') })
console.log('✓ Screenshot: 03-dashboard.png')

await app.close()
console.log('Done.')
