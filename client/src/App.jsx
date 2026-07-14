import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import BoardMenu from "./components/BoardMenu";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  useEffect(() => {
    async function getBoards() {
      const response = await fetch("/api/boards");
      if (!response.ok) {
        throw new Error(`Failed to fetch boards: ${response.status}`);
      }
      const data = await response.json();
      setBoards(data.boards);
      setSelectedBoardId(data.boards[0]?.id ?? null);
    }
    getBoards();
  }, []);

  async function handleAddBoard(name) {
    const response = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create board: ${response.status}`);
    }
    const { board } = await response.json();
    setBoards((prev) => [...prev, board]);
    setSelectedBoardId(board.id);
  }

  async function handleDeleteBoard(boardId) {
    const response = await fetch(`/api/boards/${boardId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete board: ${response.status}`);
    }

    setBoards((prev) => {
      const next = prev.filter((board) => board.id !== boardId);
      if (selectedBoardId === boardId) {
        setSelectedBoardId(next[0]?.id ?? null);
      }
      return next;
    });
  }

  return (
    <div className="app">
      <BoardMenu
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelectBoard={setSelectedBoardId}
        onAddBoard={handleAddBoard}
        onDeleteBoard={handleDeleteBoard}
      />
      <main className="app-main">
        {selectedBoardId ? (
          <Board boardId={selectedBoardId} />
        ) : (
          <p className="app-empty">Create a board to get started.</p>
        )}
      </main>
    </div>
  );
}

export default App;
