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

    await actionLog.clearUndone(boardId, tx);
    const sequenceNumber = await actionLog.nextSequenceNumber(boardId, tx);
    await actionLog.insertEntry(
      {
        boardId,
        sequenceNumber,
        commandType: type,
        payload,
        inversePayload: inverseCommand,
      },
      tx
    );

    return getBoardWithColumnsAndCards(boardId, tx);
  });
}

// Placeholders for the upcoming undo/redo endpoints. The action_log invariant
// (active rows are a contiguous prefix, undone rows the suffix) plus the stored
// executable inverse commands make these a small follow-up.
export async function undo(boardId) {
  throw new Error('undo not implemented');
}

export async function redo(boardId) {
  throw new Error('redo not implemented');
}
