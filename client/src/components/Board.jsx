import { useState, useEffect } from "react";
import Column from "./Column";
import { DragDropProvider } from "@dnd-kit/react";

export default function Board({ boardId }) {
  const [board, setBoard] = useState(null);

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
            />
          ))}
        </div>
      </div>
    </DragDropProvider>
  );
}
