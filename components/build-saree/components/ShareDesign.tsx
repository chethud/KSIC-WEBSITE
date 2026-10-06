import { useCustomizerStore } from '../store/customizerStore';
import { buildShareUrl } from '../engine/designStorage';

export function ShareDesign() {
  const shareCurrentDesign = useCustomizerStore((s) => s.shareCurrentDesign);
  const state = useCustomizerStore();

  const text = encodeURIComponent(
    `I designed my own saree${state.designName ? `: ${state.designName}` : ''}${state.designId ? ` (${state.designId})` : ''}`,
  );

  return (
    <div className="share-design">
      <h3 className="field-label">Share</h3>
      <div className="share-row">
        <a
          className="share-btn"
          href={`https://wa.me/?text=${text}%20${encodeURIComponent(buildShareUrl(state))}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => shareCurrentDesign()}
        >
          WhatsApp
        </a>
        <button
          type="button"
          className="share-btn"
          onClick={() => {
            shareCurrentDesign();
            window.open('https://www.instagram.com/', '_blank');
          }}
        >
          Instagram
        </button>
        <button type="button" className="share-btn" onClick={() => shareCurrentDesign()}>
          Copy Link
        </button>
      </div>
    </div>
  );
}
