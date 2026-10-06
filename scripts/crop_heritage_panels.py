from PIL import Image
from pathlib import Path

src = Path(r"C:\Users\HARSHITH V MALIPATIL\.cursor\projects\c-Users-HARSHITH-V-MALIPATIL-OneDrive-Desktop-chethu-workspace-KSIC-MYSURE\assets\c__Users_HARSHITH_V_MALIPATIL_AppData_Roaming_Cursor_User_workspaceStorage_e98cc9b19ab5e9dba7d8bdd838c16bc7_images_WhatsApp_Image_2026-10-04_at_9.22.11_PM-8a43557c-def3-4959-9bf5-7a69f1006741.jpg")
out_dir = Path(r"C:\Users\HARSHITH V MALIPATIL\OneDrive\Desktop\chethu workspace\KSIC MYSURE\public\heritage")
out_dir.mkdir(parents=True, exist_ok=True)

im = Image.open(src).convert("RGB")
w, h = im.size
print("source", w, h)

# Panel strip under the title block
strip_top = int(h * 0.205)
strip_bottom = int(h * 0.985)
strip = im.crop((0, strip_top, w, strip_bottom))
sw, sh = strip.size
print("strip", sw, sh)

# Within each panel, crop photo band (exclude top titles + bottom captions)
photo_top = int(sh * 0.165)
photo_bottom = int(sh * 0.78)

for i in range(7):
    x0 = int(sw * i / 7)
    x1 = int(sw * (i + 1) / 7)
    # slight inset to avoid gold divider bleed
    inset = max(1, sw // 700)
    panel = strip.crop((x0 + inset, photo_top, x1 - inset, photo_bottom))
    # Upscale a bit for retina quality
    panel = panel.resize((panel.width * 2, panel.height * 2), Image.Resampling.LANCZOS)
    dest = out_dir / f"{i+1:02d}.jpg"
    panel.save(dest, quality=92, optimize=True)
    print("wrote", dest.name, panel.size)

# Also copy generated 04/07 if better? Prefer reference crops for consistency.
print("done")
