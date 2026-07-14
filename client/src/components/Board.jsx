import { useState, useEffect, useRef } from "react";
import Column from "./Column";
import BoardToolbar from "./BoardToolbar";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import AddColumn from "./AddColumn";
import Modal from "./Modal";
import useBoard from "../hooks/useBoard";

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
  const {
    board,
    setBoard,
    canUndo,
    canRedo,
    activeCount,
    isMutating,
    sendCommand,
    undo,
    redo,
  } = useBoard(boardId);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const dragSnapshot = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, [contenteditable=true]")
      ) {
        return;
      }

      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;

      if (event.key === "z" || event.key === "Z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (event.key === "y" || event.key === "Y") {
        event.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  if (!board) return <p>Loading board...</p>;

  const closeAddColumn = () => {
    setIsAddColumnOpen(false);
    setColumnTitle("");
  };

  const handleAddColumn = async () => {
    const title = columnTitle.trim();
    if (!title) return;

    await sendCommand("ADD_COLUMN", {
      title,
      position: board.columns.length,
    });
    closeAddColumn();
  };

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
          <BoardToolbar
            canUndo={canUndo}
            canRedo={canRedo}
            activeCount={activeCount}
            isMutating={isMutating}
            onUndo={undo}
            onRedo={redo}
          />
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
