export function Header() {
  return (
    <header className="local-site-header">
      <div className="local-site-header-inner">
        <span className="local-site-name">
          Git<span>Diagram</span>
        </span>
        <span className="local-site-label">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
          </svg>
          Local report viewer
        </span>
      </div>
    </header>
  );
}
