/** The Doubt mark with "Doubt Docs", as on doubtbot.eu. */
export function BrandLockup() {
  return (
    <span className="brand-lockup">
      {/* biome-ignore lint/performance/noImgElement: static export, the SVG needs no optimisation */}
      <img
        src="/brand/doubt-logo.svg"
        alt=""
        width={32}
        height={32}
        className="brand-lockup__mark"
      />
      <span className="brand-lockup__text">
        <span className="grad-text">Doubt</span>
        <span className="brand-lockup__tag">Docs</span>
      </span>
    </span>
  );
}
