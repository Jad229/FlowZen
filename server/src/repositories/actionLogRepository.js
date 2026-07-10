import { query } from '../../db/db.js';

// Runs a SQL query. If we are inside a transaction (tx is given), run it on
// that transaction. Otherwise run it on its own with the normal query helper.
async function runQuery(tx, sql, params) {
  if (tx) {
    return tx.query(sql, params);
  }
  return query(sql, params);
}

export async function nextSequenceNumber(boardId, tx) {
  const result = await runQuery(
    tx,
    'SELECT COALESCE(MAX(sequence_number), 0) + 1 AS next FROM action_log WHERE board_id = $1',
    [boardId]
  );
  return result.rows[0].next;
}

export async function insertEntry(entry, tx) {
  const { boardId, sequenceNumber, commandType, payload, inversePayload } = entry;

  const result = await runQuery(
    tx,
    `INSERT INTO action_log (board_id, sequence_number, command_type, payload, inverse_payload)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      boardId,
      sequenceNumber,
      commandType,
      JSON.stringify(payload),
      JSON.stringify(inversePayload),
    ]
  );

  return result.rows[0];
}

// Applying a new command discards any previously undone (redoable) rows.
export async function clearUndone(boardId, tx) {
  await runQuery(
    tx,
    "DELETE FROM action_log WHERE board_id = $1 AND status = 'undone'",
    [boardId]
  );
}

export async function latestActive(boardId, tx) {
  const result = await runQuery(
    tx,
    "SELECT * FROM action_log WHERE board_id = $1 AND status = 'active' ORDER BY sequence_number DESC LIMIT 1",
    [boardId]
  );
  return result.rows[0] || null;
}

export async function earliestUndone(boardId, tx) {
  const result = await runQuery(
    tx,
    "SELECT * FROM action_log WHERE board_id = $1 AND status = 'undone' ORDER BY sequence_number ASC LIMIT 1",
    [boardId]
  );
  return result.rows[0] || null;
}

export async function markUndone(id, tx) {
  await runQuery(tx, "UPDATE action_log SET status = 'undone' WHERE id = $1", [id]);
}

export async function markActive(id, tx) {
  await runQuery(tx, "UPDATE action_log SET status = 'active' WHERE id = $1", [id]);
}
