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
          aria-label="WhatsApp"
          onClick={() => shareCurrentDesign()}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.04 3C7.31 3 3.5 6.7 3.5 11.3c0 1.46.4 2.88 1.16 4.12L3.4 21l5.72-1.48a8.7 8.7 0 0 0 2.92.5c4.73 0 8.54-3.7 8.54-8.3S16.77 3 12.04 3zm4.96 11.72c-.2.57-1.18 1.05-1.64 1.12-.42.06-.96.08-1.55-.1-.36-.1-.82-.26-1.41-.51-2.48-1.07-4.1-3.57-4.22-3.74-.12-.16-1-1.33-1-2.54s.63-1.8.86-2.05c.22-.24.48-.3.64-.3h.46c.15 0 .35-.06.54.41.2.48.68 1.66.74 1.78.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.47.14.24.62 1.02 1.33 1.66.92.82 1.69 1.07 1.93 1.19.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.15z" />
          </svg>
        </a>
        <button
          type="button"
          className="share-btn"
          aria-label="Instagram"
          onClick={() => {
            shareCurrentDesign();
            window.open('https://www.instagram.com/', '_blank');
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <rect x="4" y="4" width="16" height="16" rx="4.5" />
            <circle cx="12" cy="12" r="3.4" />
            <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <button type="button" className="share-btn" aria-label="Copy link" onClick={() => shareCurrentDesign()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <path d="M10 13.5a4.2 4.2 0 0 0 6.3.4l2.2-2.2a4.2 4.2 0 0 0-6-6L11.2 7" strokeLinecap="round" />
            <path d="M14 10.5a4.2 4.2 0 0 0-6.3-.4l-2.2 2.2a4.2 4.2 0 0 0 6 6L12.8 17" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
