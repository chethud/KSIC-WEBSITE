# MASTER_SAREE.glb — production asset contract

The customizer loads `public/models/saree-hero.glb` (aliases: `MASTER_SAREE.glb`, `MASTER_SAREE_OPTIMIZED.glb`).

## What the web app expects

Hierarchy (names matter):

```
SareeModel
├── FemaleBody          → MATERIAL_07_SKIN
├── Blouse              → MATERIAL_06_BLOUSE
├── Hair / Hair_Bun     → MATERIAL_08_HAIR
└── SareeCloth          → multi-material slots:
    ├── MATERIAL_01_BODY
    ├── MATERIAL_02_BORDER
    ├── MATERIAL_03_PALLU
    ├── MATERIAL_04_PALLU_BORDER
    └── MATERIAL_05_ZARI
```

Geometry requirements (non-negotiable for the KSIC customizer):

- One female figure **already wearing** the saree (no floating parts)
- Continuous cloth wrap: waist → hips → legs, with real front pleats
- Pallu continuous over the shoulder
- Fitted blouse as a separate mesh
- Border as material regions on the cloth edge (not separate gold blocks)
- Drape frozen (no live cloth sim in the browser)
- Draco-compressed GLB, ~1.7 m tall, feet on Y=0

## Current generator

```bash
npm run generate:saree
```

Runs Blender `scripts/build_realistic_saree.py` (body-conforming wrap).  
This is a **technical placeholder** until a DCC-authored garment replaces it.

## Replace with a real artist / Sketchfab asset

1. Download a CC-licensed woman-in-saree GLB (e.g. Sketchfab — requires free login).
2. Drop it at `assets/base/imported/artist_saree.glb`
3. Run:

```bash
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --python scripts/ingest_artist_glb.py
```

4. Hard-refresh the app (`?v=` bumps automatically when you re-export).

Attribution: if using Sketchfab CC-BY models, credit the author in the product footer.
