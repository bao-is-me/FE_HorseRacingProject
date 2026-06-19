import React from "react";
import { Search, X } from "lucide-react";

export function FilterToolbar({ search, onSearch, placeholder = "Search...", children, actions }) {
  return (
    <div className="workspace-toolbar">
      <label className="workspace-search">
        <Search size={18} />
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} />
      </label>
      <div className="workspace-filters">{children}</div>
      {actions && <div className="workspace-toolbar-actions">{actions}</div>}
    </div>
  );
}

export function WorkspaceNotice({ children, tone = "success", onClose }) {
  if (!children) return null;
  return (
    <div className={`workspace-notice ${tone}`}>
      <span>{children}</span>
      {onClose && <button type="button" onClick={onClose}>Dismiss</button>}
    </div>
  );
}

export function DetailDrawer({ open, kicker, title, subtitle, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="workspace-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="workspace-drawer" role="dialog" aria-modal="true">
        <header>
          <div>
            <span>{kicker}</span>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close details"><X size={19} /></button>
        </header>
        <div className="workspace-drawer-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </aside>
    </div>
  );
}

export function InfoGrid({ items }) {
  return (
    <dl className="workspace-info-grid">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyPanel({ title = "No records found", description }) {
  return (
    <div className="workspace-empty">
      <strong>{title}</strong>
      {description && <span>{description}</span>}
    </div>
  );
}
