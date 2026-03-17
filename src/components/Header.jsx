export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <div className="header-logo">🌍</div>
          <div className="header-titles">
            <h1 className="header-title-ar">طقس سوريا</h1>
            <p className="header-title-en">Syria Weather</p>
          </div>
        </div>
        <div className="header-badge">
          <span className="live-dot"></span>
          <span className="live-label">مباشر</span>
        </div>
      </div>
    </header>
  );
}
