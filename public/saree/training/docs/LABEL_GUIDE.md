# Label Guide — Saree UV Regions

## Regions

| Name | ID | Template | Packed channel | Notes |
|------|----|----------|----------------|-------|
| SKIN | 0 | skin-mask.png | — | Face, hands, arms, legs — protected |
| BODY | 1 | body-mask.png | R | Main saree field / silk body |
| PALLU | 2 | pallu-mask.png | G | Decorative end / pallu field |
| BORDER | 3 | border-mask.png | B | Running border / hem bands |
| ZARI | 4 | zari-mask.png | A | Metallic gold/silver weave accents |
| BLOUSE | 5 | blouse-mask.png | separate | Blouse garment on torso |

## Rules

1. Masks define **region identity**, not final color.
2. Paint in UV atlas space aligned to `source/albedo.png`.
3. White (255) = belongs to region; black (0) = does not.
4. Prefer exclusivity on fabric: BODY vs PALLU vs BORDER vs ZARI should not heavily overlap.
5. SKIN always wins for protection (never tint skin as silk).
6. Do not invent regions from camera screenshots — only UV atlas pixels that belong to mesh UVs.
7. UV islands are fragmented; use the wireframe overlay to see triangle boundaries.

## Packed RGBA (`saree-segmentation.png`)

- R → BODY
- G → PALLU
- B → BORDER
- A → ZARI
- BLOUSE / SKIN stay as separate grayscale files

## Validation checklist

- [ ] Changing BODY would only affect main silk (not pallu/border/zari/blouse/skin)
- [ ] PALLU islands match the draped pallu end in 3D
- [ ] BORDER follows hem/border strips, not body fill
- [ ] ZARI covers metallic accents only
- [ ] BLOUSE covers blouse only
- [ ] SKIN covers all exposed skin
