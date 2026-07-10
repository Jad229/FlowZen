import { transaction } from '../../db/db.js';
import { commandRegistry } from '../commands/index.js';
import * as actionLog from '../repositories/actionLogRepository.js';
import { getBoardWithColumnsAndCards } from '../repositories/boardRepository.js';

// Applies a command against a board inside a single transaction: mutate the
// board, compute the executable inverse command, then append both the forward
// payload and its inverse to action_log. Returns the updated board.
export async function applyCommand(boardId, type, payload) {
  const handler = commandRegistry[type];
  if (!handler) {
    const err = new Error(`Unknown command type: ${type}`);
    err.status = 400;
    throw err;
  }

  return transaction(async (tx) => {
    const boardCheck = await tx.query('SELECT id FROM boards WHERE id = $1', [
      boardId,
    ]);
    if (boardCheck.rowCount === 0) {
      const err = new Error(`Board not found: ${boardId}`);
      err.status = 404;
      throw err;
    }

    const ctx = await handler.apply(tx, payload, boardId);
    const inverseCommand = handler.buildInverse(payload, ctx);

    // Include generated ids in the stored forward payload so redo can restore
    // the exact entity (e.g. ADD_CARD / ADD_COLUMN without an explicit id).
    const storedPayload = { ...payload };
    if (ctx.id != null && storedPayload.id == null) {
      storedPayload.id = ctx.id;
    }

    await actionLog.clearUndone(boardId, tx);
    const sequenceNumber = await actionLog.nextSequenceNumber(boardId, tx);
    await actionLog.insertEntry(
      {
        boardId,
        sequenceNumber,
        commandType: type,
        payload: storedPayload,
        inversePayload: inverseCommand,
      },
      tx
    );

    return getBoardWithColumnsAndCards(boardId, tx);
  });
}

// Undo the most recent active action by executing its stored inverse command.
// Does not append a new log row — only flips the entry's status to 'undone'.
export async function undo(boardId) {
  return transaction(async (tx) => {
    const boardCheck = await tx.query('SELECT id FROM boards WHERE id = $1', [
      boardId,
    ]);
    if (boardCheck.rowCount === 0) {
      const err = new Error(`Board not found: ${boardId}`);
      err.status = 404;
      throw err;
    }

    const entry = await actionLog.latestActive(boardId, tx);
    if (!entry) {
      const err = new Error('Nothing to undo');
      err.status = 409;
      throw err;
    }

    const inverse = entry.inverse_payload;
    const handler = commandRegistry[inverse.type];
    if (!handler) {
      const err = new Error(`Unknown inverse command type: ${inverse.type}`);
      err.status = 500;
      throw err;
    }

    await handler.apply(tx, inverse.payload, boardId);
    await actionLog.markUndone(entry.id, tx);

    return getBoardWithColumnsAndCards(boardId, tx);
  });
}

// Redo the earliest undone action by re-applying its original forward command.
// Does not append a new log row — only flips the entry's status back to 'active'.
export async function redo(boardId) {
  return transaction(async (tx) => {
    const boardCheck = await tx.query('SELECT id FROM boards WHERE id = $1', [
      boardId,
    ]);
    if (boardCheck.rowCount === 0) {
      const err = new Error(`Board not found: ${boardId}`);
      err.status = 404;
      throw err;
    }

    const entry = await actionLog.earliestUndone(boardId, tx);
    if (!entry) {
      const err = new Error('Nothing to redo');
      err.status = 409;
      throw err;
    }

    const handler = commandRegistry[entry.command_type];
    if (!handler) {
      const err = new Error(`Unknown command type: ${entry.command_type}`);
      err.status = 500;
      throw err;
    }

    await handler.apply(tx, entry.payload, boardId);
    await actionLog.markActive(entry.id, tx);

    return getBoardWithColumnsAndCards(boardId, tx);
  });
}
