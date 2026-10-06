# Saree UV Mapping / Training Pack

Offline pack for mapping saree regions in **UV space**. Generated from the production GLB.
Does not change the web app runtime.

## Purpose

Give this folder to a human labeler, 3D artist, or external training pipeline so they can produce
deterministic region masks for:

- BODY
- PALLU
- BORDER
- ZARI
- BLOUSE
- SKIN (protected — do not recolor)

## Source of truth

| File | Meaning |
|------|---------|
| `source/albedo.png` | Exact embedded atlas from the GLB |
| `uv/saree-uv-wireframe.png` | Real triangle edges in UV space |
| `uv/saree-uv-albedo.png` | Albedo + wireframe — best canvas to paint on |
| `config/segmentation.json` | Region IDs + mask contract |

UV ↔ 3D mapping: a pixel at (u,v) in these images corresponds to the mesh triangles that use that UV.
Orientation matches glTF / Three.js with `flipY=false` (V=0 at **top** of the PNG).

## How to label (manual)

1. Open `uv/saree-uv-albedo.png` in an image editor (Photoshop, Krita, GIMP).
2. For each region, paint **white (255)** on the matching template under `templates/`:
   - `body-mask.png`, `pallu-mask.png`, `border-mask.png`, `zari-mask.png`, `blouse-mask.png`, `skin-mask.png`
3. Keep masks exclusive where possible (one primary region per UV texel on fabric).
4. Optionally pack BODY/PALLU/BORDER/ZARI into `templates/saree-segmentation.png`:
   - R = BODY, G = PALLU, B = BORDER, A = ZARI
5. See `docs/LABEL_GUIDE.md` for rules.

## How to use for training

1. Input image: `source/albedo.png` and/or `uv/saree-uv-albedo.png`
2. Optional weak init: `seeds/` (NOT ground truth)
3. Target labels: grayscale masks or a class-ID map using `config/label_legend.json`
4. Output must stay in the **same atlas resolution and UV orientation**

## Seeds warning

Files under `seeds/` are heuristic bakes from albedo color + world-Y. They are **not** ground truth.
Do not train as if they are perfect labels without human correction.

## Regenerating this pack

```bash
python scripts/export_uv_training_pack.py
```
