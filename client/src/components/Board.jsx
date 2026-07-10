import { useState, useEffect } from 'react'
import Column from './Column';

export default function Board({ boardId }) {
  const [board, setBoard] = useState(null)

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
    <div className="board">
      <header className="board-header">
        <h1 className="board-title">{board.name}</h1>
      </header>
      <div className="board-columns">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            cards={column.cards}
          />
        ))}
      </div>
    </div>
  );
}