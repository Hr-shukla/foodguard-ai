export default function Topbar({ searchValue, onSearchChange }) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="topbar__title">Welcome, Harsh</div>
        <div className="topbar__subtitle">Food Safety Data Dashboard</div>
      </div>

      <div className="topbar__right">
        <div className="search">
          <span className="search__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            className="search__input"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search state / category…"
            aria-label="Search"
          />
        </div>

        <button className="iconBtn" type="button" aria-label="Notifications">
          ⏺
        </button>

        <div className="profile">
          <div className="profile__avatar" aria-hidden="true">
            HR
          </div>
          <div className="profile__meta">
            <div className="profile__name">HARSH RAJ SHUKLA</div>
            <div className="profile__role">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

