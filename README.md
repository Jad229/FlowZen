# FlowZen 

## A Collaborative Kanban Board — Persisted Multi-Level Undo/Redo

A Trello-style Kanban board (columns + draggable cards) where every action — move card, edit card, add column, delete card — is undoable and redoable, per board. Unlike a typical undo/redo implementation, history isn't held in memory: it's persisted as an append-only log table, so it survives a server restart and scales to many boards without keeping everything in process memory.

## Core Idea

Instead of maintaining two in-memory undo/redo stacks, all history lives in a single `action_log` table per board. This works because of one invariant:

> Active rows are always a contiguous prefix of `sequence_number`. Undone rows are always the remaining suffix.

Which means:
- **Undo** = find the active row with `MAX(sequence_number)`
- **Redo** = find the undone row with `MIN(sequence_number)`

No stack bookkeeping in application code — the table *is* the stack.

## Tech Stack

- **Frontend:** React (hooks) + drag-and-drop (`@dnd-kit` or hand-rolled HTML5 DnD)
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL (JSONB) or SQLite (TEXT storing JSON)
- **DB access:** Plain SQL driver (`pg` or `better-sqlite3`) — no ORM
- **Styling:** CSS for drag/drop visual feedback

## Schema

```sql
CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE columns (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  column_id INTEGER NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL
);

CREATE TABLE action_log (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  command_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  inverse_payload JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'undone')) DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (board_id, sequence_number)
);
```

> **SQLite:** swap `SERIAL` → `INTEGER PRIMARY KEY AUTOINCREMENT`, `JSONB` → `TEXT` (parse JSON app-side).

## API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/boards` | Create a board (with default columns) |
| `GET` | `/api/boards/:id` | Get board with nested columns + cards |
| `POST` | `/api/boards/:id/commands` | Apply a command (`{ type, payload }`) |
| `POST` | `/api/boards/:id/undo` | Undo the most recent active action |
| `POST` | `/api/boards/:id/redo` | Redo the earliest undone action |

## Command Types

| Command | Forward | Inverse |
|---|---|---|
| `AddCardCommand` | Insert card | Delete card |
| `DeleteCardCommand` | Delete card | Re-insert captured row at original position |
| `MoveCardCommand` | Update card's column/position | Restore prior column/position |
| `RenameColumnCommand` | Update column name | Restore prior name |
| `AddColumnCommand` | Insert column | Delete column |

## Project Structure

```
db.js                      — connection pool + query() + transaction() helpers

repositories/
  boardRepository.js       — createBoard(name), getBoardWithColumnsAndCards(id)
  actionLogRepository.js   — nextSequenceNumber(boardId, tx), insertEntry(...),
                              latestActive(boardId), earliestUndone(boardId),
                              clearUndone(boardId, tx), markUndone(id, tx), markActive(id, tx)

commands/
  addCard.js                — apply(tx, payload), buildInverse(tx, payload)
  deleteCard.js              — apply(tx, payload), buildInverse(tx, payload)
  moveCard.js                — apply(tx, payload), buildInverse(tx, payload)
  renameColumn.js            — apply(tx, payload), buildInverse(tx, payload)
  addColumn.js               — apply(tx, payload), buildInverse(tx, payload)

services/
  commandService.js         — applyCommand(boardId, type, payload), undo(boardId),
                               redo(boardId) — owns transaction boundaries
```

**Frontend:**
- `useBoard(boardId)` hook → `{ board, canUndo, canRedo, dispatchCommand, undo, redo }`
- Components: `<Board>`, `<Column>`, `<Card draggable>`, `<AddCardForm>`, `<Toolbar>`, `<LastActionToast>`

## Features

- Drag-and-drop card movement between columns with drop-zone indicators
- Inline editable column titles (click to rename)
- Add Card / Add Column quick-entry forms
- Undo/Redo toolbar buttons + keyboard shortcuts (`Ctrl+Z` / `Ctrl+Shift+Z`)
- Toast showing the most recent action taken
- Card detail modal for editing title/description
- Badge showing count of active (undoable) actions

## Getting Started

```bash
# clone and install
git clone <repo-url>
npm install

# set up database (Postgres or SQLite)
# run migration to create boards/columns/cards/action_log tables

# start backend
cd server
npm run dev

# start frontend
cd client
npm run dev
```

## Status

- [X] Backend scaffold + schema migration
- [X] `GET /api/boards/:id`
- [X] Command handlers (add/delete/move card, rename/add column)
- [X] `POST /api/boards/:id/commands`
- [X] Undo / Redo endpoints
- [ ] React board + drag-and-drop
- [ ] Undo/Redo UI + keyboard shortcuts
- [ ] Polish (toasts, animations, badge)