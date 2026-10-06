# UV outline guide layers

These outlines are **traced from this project’s** `public/models/region_*.png` masks in the same 1024 UV space as the hero GLB.

They are **not** a generic saree UV from the internet — a downloaded template would not line up with this mesh.

Regenerate after mask changes:

```bash
npm run export:uv-guides
```

- `uv-region-outlines.json` / `.svg` — per-zone filled outlines (Main, Pallu, Border, …)
- `uv-fabric-outline.json` — outer fabric islands from the albedo
