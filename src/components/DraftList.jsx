export default function DraftList({ drafts, activeId, onSelect, onNew, onDelete }) {
  return (
    <div className="draft-list">
      <button className="btn-new" onClick={onNew}>
        + New Event
      </button>
      <h4>Saved Drafts</h4>
      {drafts.length === 0 && <p className="hint">No saved drafts yet.</p>}
      <ul>
        {drafts.map((d) => (
          <li key={d.id} className={d.id === activeId ? "active" : ""}>
            <button className="draft-item" onClick={() => onSelect(d.id)}>
              <strong>{d.answers?.eventName || "Untitled Event"}</strong>
              <span>{new Date(d.updatedAt).toLocaleString()}</span>
            </button>
            <button className="draft-delete" title="Delete draft" onClick={() => onDelete(d.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
