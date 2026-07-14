export default function BoardToolbar({
  canUndo,
  canRedo,
  activeCount,
  isMutating,
  onUndo,
  onRedo,
}) {
  return (
    <div className="board-toolbar">
      <button
        type="button"
        className="board-toolbar-btn"
        onClick={onUndo}
        disabled={!canUndo || isMutating}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        Undo
      </button>
      <button
        type="button"
        className="board-toolbar-btn"
        onClick={onRedo}
        disabled={!canRedo || isMutating}
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo"
      >
        Redo
      </button>
      {activeCount > 0 && (
        <span className="board-toolbar-badge" title="Undoable actions">
          {activeCount}
        </span>
      )}
    </div>
  );
}
