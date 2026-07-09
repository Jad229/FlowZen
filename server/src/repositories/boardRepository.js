import { query } from '../../db/db.js';

// Runs a SQL query. If we are inside a transaction (tx is given), run it on
// that transaction. Otherwise run it on its own with the normal query helper.
async function runQuery(tx, sql, params) {
  if (tx) {
    return tx.query(sql, params);
  }
  return query(sql, params);
}

export async function getBoardWithColumnsAndCards(id, tx) {
  // 1. Get the board.
  const boardResult = await runQuery(tx, 'SELECT * FROM boards WHERE id = $1', [id]);
  const board = boardResult.rows[0];
  if (!board) {
    return null;
  }

  // 2. Get the board's columns, in order.
  const columnsResult = await runQuery(
    tx,
    'SELECT * FROM columns WHERE board_id = $1 ORDER BY position',
    [id]
  );
  const columns = columnsResult.rows;

  // 3. For each column, get its cards and attach them to the column.
  for (const column of columns) {
    const cardsResult = await runQuery(
      tx,
      'SELECT * FROM cards WHERE column_id = $1 ORDER BY position',
      [column.id]
    );
    column.cards = cardsResult.rows;
  }

  // 4. Attach the columns to the board and return it.
  board.columns = columns;
  return board;
}
