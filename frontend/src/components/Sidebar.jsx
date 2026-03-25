const items = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "data", label: "Data Explorer" },
];

export default function Sidebar({ activeId, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">FS</div>
        <div>
          <div className="sidebar__name">Foodie Kitchen</div>
          <div className="sidebar__sub">Food Safety</div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        {items.map((it) => (
          <button
            key={it.label}
            type="button"
            className={`sidebar__item ${activeId === it.id ? "isActive" : ""}`}
            onClick={() => onNavigate?.(it.id)}
          >
            <span className="sidebar__dot" aria-hidden="true" />
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

