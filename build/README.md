# build/

Icon assets for electron-builder packaging.

Required files:

| File | Platform | Size |
|---|---|---|
| `icon.ico` | Windows | 256×256 (multi-size ICO) |
| `icon.icns` | macOS | 512×512 + Retina |
| `icon.png` | Linux | 512×512 PNG |

## How to generate

Start from a single 1024×1024 PNG source image, then convert:

```bash
# macOS (using electron-icon-builder)
npx electron-icon-builder --input=icon-source.png --output=build/

# Windows only — use https://www.icoconverter.com
# Upload icon-source.png → download icon.ico → place here
```

Until real icons are added, electron-builder will use its default Electron icon.
