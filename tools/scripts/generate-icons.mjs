import sharp from 'sharp'
import png2icons from 'png2icons'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const buildDir = resolve(__dirname, '../../build')
mkdirSync(buildDir, { recursive: true })

// Cute monitor-face icon matching app's lavender/pink/blue theme
const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#c5cae9"/>
      <stop offset="50%"  stop-color="#f8bbd0"/>
      <stop offset="100%" stop-color="#bbdefb"/>
    </linearGradient>
    <linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#e8eaf6"/>
      <stop offset="100%" stop-color="#fce4ec"/>
    </linearGradient>
  </defs>

  <!-- Background rounded square -->
  <rect width="512" height="512" rx="110" fill="url(#bg)"/>

  <!-- Monitor body -->
  <rect x="80" y="108" width="352" height="246" rx="28" fill="white" opacity="0.88"/>

  <!-- Screen bezel -->
  <rect x="104" y="130" width="304" height="196" rx="16" fill="url(#screen)"/>

  <!-- Left eye (big, shiny) -->
  <circle cx="200" cy="216" r="36" fill="#7986cb"/>
  <circle cx="200" cy="216" r="24" fill="#5c6bc0"/>
  <circle cx="212" cy="204" r="9"  fill="white"/>
  <circle cx="205" cy="210" r="4"  fill="white" opacity="0.6"/>

  <!-- Right eye (big, shiny) -->
  <circle cx="312" cy="216" r="36" fill="#7986cb"/>
  <circle cx="312" cy="216" r="24" fill="#5c6bc0"/>
  <circle cx="324" cy="204" r="9"  fill="white"/>
  <circle cx="317" cy="210" r="4"  fill="white" opacity="0.6"/>

  <!-- Rosy cheeks -->
  <circle cx="168" cy="264" r="22" fill="#f48fb1" opacity="0.45"/>
  <circle cx="344" cy="264" r="22" fill="#f48fb1" opacity="0.45"/>

  <!-- Smile -->
  <path d="M 196 268 Q 256 312 316 268"
        stroke="#7986cb" stroke-width="10"
        fill="none" stroke-linecap="round"/>

  <!-- Monitor stand neck -->
  <rect x="234" y="354" width="44" height="38" rx="8" fill="white" opacity="0.82"/>

  <!-- Monitor stand base -->
  <rect x="174" y="386" width="164" height="22" rx="11" fill="white" opacity="0.82"/>

  <!-- Tiny star sparkle top-right -->
  <g transform="translate(390,140)" fill="#fff9c4" opacity="0.9">
    <polygon points="0,-14 3,-5 13,-5 5,2 8,12 0,6 -8,12 -5,2 -13,-5 -3,-5" />
  </g>
</svg>`

console.log('Rendering SVG → PNG 512×512 …')
const pngBuffer = await sharp(Buffer.from(svg))
  .resize(512, 512)
  .png()
  .toBuffer()

writeFileSync(resolve(buildDir, 'icon.png'), pngBuffer)
console.log('  ✓ build/icon.png')

console.log('Converting PNG → ICO (Windows) …')
const icoBuffer = png2icons.createICO(pngBuffer, png2icons.BILINEAR, 0, false, true)
writeFileSync(resolve(buildDir, 'icon.ico'), icoBuffer)
console.log('  ✓ build/icon.ico')

console.log('Converting PNG → ICNS (macOS) …')
const icnsBuffer = png2icons.createICNS(pngBuffer, png2icons.BILINEAR, 0)
writeFileSync(resolve(buildDir, 'icon.icns'), icnsBuffer)
console.log('  ✓ build/icon.icns')

console.log('\nAll icons generated in build/')
