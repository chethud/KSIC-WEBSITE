import Image from "next/image";
import { MODEL_VIEWS } from "../../data/catalog";
import { useCustomizerStore } from "../../store/customizerStore";
import type { CameraView } from "../../types/customization";

const VIEW_IMAGES: Record<string, string> = {
  front: "/atelier/views/front-face.jpg?v=6",
  side: "/atelier/views/side-face.jpg?v=6",
  back: "/atelier/views/front-face.jpg?v=6",
  detail: "/atelier/views/detail.jpg?v=6",
};

export function ModelViewSelector() {
  const cameraView = useCustomizerStore((s) => s.cameraView);
  const setCameraView = useCustomizerStore((s) => s.setCameraView);
  const active = cameraView === "three-quarter" ? "front" : cameraView;

  return (
    <div className="view-rail" role="toolbar" aria-label="Model views">
      {MODEL_VIEWS.map((view) => {
        const selected = active === view.id;
        const src = VIEW_IMAGES[view.id];
        return (
          <button
            key={view.id}
            type="button"
            className={`view-thumb${selected ? " is-selected" : ""}`}
            aria-pressed={selected}
            aria-label={`${view.label} view`}
            onClick={() => setCameraView(view.id as CameraView)}
          >
            <span className={`view-thumb-preview view-thumb-preview--${view.id}`}>
              {src ? (
                <Image src={src} alt="" fill sizes="90px" className="view-thumb-img" />
              ) : null}
            </span>
            <span className="view-thumb-label">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}
