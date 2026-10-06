import { CAMERA_VIEWS } from '../data/catalog';
import { useCustomizerStore } from '../store/customizerStore';
import type { CameraView } from '../types/customization';

export function CameraControls() {
  const cameraView = useCustomizerStore((s) => s.cameraView);
  const setCameraView = useCustomizerStore((s) => s.setCameraView);

  return (
    <div className="camera-controls" role="toolbar" aria-label="Camera views">
      {CAMERA_VIEWS.map((b) => (
        <button
          key={b.id}
          type="button"
          className={`cam-btn ${cameraView === b.id ? 'active' : ''}`}
          onClick={() => setCameraView(b.id as CameraView)}
        >
          {b.label}
        </button>
      ))}
      <button
        type="button"
        className="cam-btn"
        onClick={() => setCameraView('three-quarter')}
      >
        Reset
      </button>
    </div>
  );
}
