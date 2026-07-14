import { useState, useEffect } from "react";
import Column from "./Column";
import { DragDropProvider } from "@dnd-kit/react";
import AddColumn from "./AddColumn";
import Modal from "./Modal";

export default function Board({ boardId }) {
  const [board, setBoard] = useState(null);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");


  useEffect(() => {
    if (!boardId) return;
    let cancelled = false;

    async function getBoard() {
      const response = await fetch(`/api/boards/${boardId}`);
      if (!response.ok)
        throw new Error(`Failed to fetch board: ${response.status}`);
      const data = await response.json();
      if (!cancelled) setBoard(data.board);
    }
    getBoard();

    return () => {
      cancelled = true;
    };
  }, [boardId]);

  if (!board) return <p>Loading board...</p>;

  const closeAddColumn = () => {
    setIsAddColumnOpen(false);
    setColumnTitle("");
  };

  const handleAddColumn = async () => {
    const title = columnTitle.trim();
    if (!title) return;

    const response = await fetch(`/api/boards/${boardId}/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ADD_COLUMN",
        payload: { title, position: board.columns.length },
      }),
    });
    const { board: updatedBoard } = await response.json();

    setBoard(updatedBoard);
    closeAddColumn();
  };

  async function sendCommand(type, payload) {
    const response = await fetch(`/api/boards/${boardId}/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload }),
    });
    const { board: updatedBoard } = await response.json();
    setBoard(updatedBoard);
  }

  return (
    <DragDropProvider
      onDragEnd={async (event) => {
        if (event.canceled) return;

        const { target, source } = event.operation;
        const toColumnId = target?.id;
        const cardId = source.id;

        const targetColumn = board.columns.find((c) => c.id === toColumnId);
        const toPosition = targetColumn.cards.length; // basically drop the card at the end

        const request = {
          type: "MOVE_CARD",
          payload: { cardId, toColumnId, toPosition },
        };

        const response = await fetch(`/api/boards/${boardId}/commands`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });
        const { board: updatedBoard } = await response.json();

        setBoard(updatedBoard);
      }}
    >
      <div className="board">
        <header className="board-header">
          <h1 className="board-title">{board.name}</h1>
        </header>
        <div className="board-columns">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
              sendCommand={sendCommand}
            />
          ))}
          <AddColumn onAddColumn={() => setIsAddColumnOpen(true)} />
        </div>
      </div>
      <Modal
        isOpen={isAddColumnOpen}
        onClose={closeAddColumn}
        title="Add column"
        confirmLabel="Add column"
        onConfirm={handleAddColumn}
        isConfirmDisabled={!columnTitle.trim()}
      >
        <label className="modal-label" htmlFor="column-title">
          Title
        </label>
        <input
          id="column-title"
          className="modal-input"
          type="text"
          placeholder="e.g. In Progress"
          value={columnTitle}
          onChange={(event) => setColumnTitle(event.target.value)}
          autoFocus
        />
      </Modal>
    </DragDropProvider>
  );
}
