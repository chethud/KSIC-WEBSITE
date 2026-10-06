# Saree UV zone masks

## Open the editor

```bash
npm run dev:segmentation
```

Or: [http://localhost:5173/saree-segmentation.html](http://localhost:5173/saree-segmentation.html)

## What you do (once)

1. You see the **UV atlas** (flat fabric texture) with current masks loaded as color overlays.
2. Choose a zone: **Main Saree / Pallu / Border / Pallu Border / Zari / Blouse**.
3. **Paint / Erase / Fill** until the zone matches the fabric on the atlas.
4. Click **EXPORT MASKS**.
5. Copy downloaded `region_*.png` into **`public/models/`** (overwrite).
6. Optionally also copy into this folder (`public/saree/segmentation/`).
7. Reload the **main customizer** — change color / border / zari; only that zone updates.

## Customer flow (not this page)

Shoppers pick colors and designs in the main app. They never paint.
The app tints/stamps patterns **only inside these mask PNGs**.

## Files

| Export | Customizer key |
|--------|----------------|
| `region_saree_main.png` / `body-mask.png` | mainSaree |
| `region_pallu.png` / `pallu-mask.png` | pallu |
| `region_border.png` / `border-mask.png` | border |
| `region_pallu_border.png` / `pallu-border-mask.png` | palluBorder |
| `region_zari.png` / `zari-mask.png` | zari |
| `region_blouse.png` / `blouse-mask.png` | blouse |

Atlas underlay: `/saree/training/uv/saree-uv-albedo.png`

Do not overwrite `public/models/MASTER_SAREE.glb`.
