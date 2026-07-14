import { useState, useEffect, useRef } from "react";
import Column from "./Column";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import AddColumn from "./AddColumn";
import Modal from "./Modal";

function toItems(board) {
  return Object.fromEntries(
    board.columns.map((column) => [
      String(column.id),
      column.cards.map((card) => card.id),
    ])
  );
}

function applyItems(board, items) {
  const cardsById = new Map();
  for (const column of board.columns) {
    for (const card of column.cards) {
      cardsById.set(card.id, card);
    }
  }

  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: (items[String(column.id)] ?? [])
        .map((id) => cardsById.get(id))
        .filter(Boolean),
    })),
  };
}

export default function Board({ boardId }) {
  const [board, setBoard] = useState(null);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const dragSnapshot = useRef(null);

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

  function handleDragStart() {
    dragSnapshot.current = board;
  }

  function handleDragOver(event) {
    setBoard((prev) => applyItems(prev, move(toItems(prev), event)));
    // Keep React as the source of truth — do not let OptimisticSortingPlugin
    // reparent DOM nodes (that causes removeChild errors on cross-column moves).
    event.preventDefault();
  }

  async function handleDragEnd(event) {
    if (event.canceled) {
      if (dragSnapshot.current) setBoard(dragSnapshot.current);
      dragSnapshot.current = null;
      return;
    }

    const { source } = event.operation;
    if (!source || !isSortable(source)) {
      dragSnapshot.current = null;
      return;
    }

    const toColumnId = source.group;
    const toPosition = source.index;

    if (
      toColumnId == null ||
      toPosition == null ||
      (String(source.initialGroup) === String(toColumnId) &&
        source.initialIndex === toPosition)
    ) {
      dragSnapshot.current = null;
      return;
    }

    try {
      await sendCommand("MOVE_CARD", {
        cardId: Number(source.id),
        toColumnId: Number(toColumnId),
        toPosition,
      });
    } catch (error) {
      if (dragSnapshot.current) setBoard(dragSnapshot.current);
      throw error;
    } finally {
      dragSnapshot.current = null;
    }
  }

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
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
