function BoardIcon() {
  return (
    <svg className="board-menu-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.75 2h12.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75V2.75A.75.75 0 0 1 1.75 2ZM2.5 3.5v9h11v-9h-11Zm2.25 1.5h6.5a.25.25 0 0 1 0 .5h-6.5a.25.25 0 0 1 0-.5Zm0 2.5h6.5a.25.25 0 0 1 0 .5h-6.5a.25.25 0 0 1 0-.5Zm0 2.5h4a.25.25 0 0 1 0 .5h-4a.25.25 0 0 1 0-.5Z" />
    </svg>
  );
}

export default function BoardMenu({ boards, selectedBoardId, onSelectBoard }) {
  return (
    <nav className="board-menu" aria-label="Boards">
      <div className="board-menu-header">
        <h2 className="board-menu-title">Boards</h2>
      </div>
      <ul className="board-menu-list">
        {boards.map((board) => {
          const isSelected = board.id === selectedBoardId;
          return (
            <li key={board.id}>
              <button
                type="button"
                className={`board-menu-item${isSelected ? ' board-menu-item--selected' : ''}`}
                onClick={() => onSelectBoard(board.id)}
                aria-current={isSelected ? 'page' : undefined}
              >
                <BoardIcon />
                <span className="board-menu-item-name">{board.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
