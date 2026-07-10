import { useState, useEffect } from 'react'
import './App.css'
import Board from './components/Board'
import BoardMenu from './components/BoardMenu'

function App() {
  const [boards, setBoards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState(null)

  useEffect(() => {
    async function getBoards() {
      const response = await fetch('/api/boards');
      if (!response.ok) {
        throw new Error(`Failed to fetch boards: ${response.status}`);
      }
      const data = await response.json()
      setBoards(data.boards)
      setSelectedBoardId(data.boards[0].id)
    }
    getBoards()
  }, [])

  return (
    boards.length > 0 && (
      <div className="app">
        <BoardMenu
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
        />
        <main className="app-main">
          <Board boardId={selectedBoardId} />
        </main>
      </div>
    )
  )
}
export default App