import { useState, useEffect } from 'react'
import Column from './Column';
import { DragDropProvider } from '@dnd-kit/react';

export default function Board({ boardId }) {
  const [board, setBoard] = useState(null)
  const [isDropped, setIsDropped] = useState(false);

  useEffect(() => {
    if (!boardId) return
    let cancelled = false

    async function getBoard() {
      const response = await fetch(`/api/boards/${boardId}`)
      if (!response.ok) throw new Error(`Failed to fetch board: ${response.status}`)
      const data = await response.json()
      if (!cancelled) setBoard(data.board)
    }
    getBoard()

    return () => { cancelled = true }
  }, [boardId])

  if (!board) return <p>Loading board...</p>

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const { target } = event.operation;
        setIsDropped(target?.id);
      }}>
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