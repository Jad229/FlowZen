import { notFound } from './errors.js';

// DELETE_COLUMN: support handler that is the inverse of ADD_COLUMN. Captures
// the column (and any cards, defensively) then deletes it. As ADD_COLUMN's
// inverse the column is empty, so the inverse only restores the column itself.
export default {
  async apply(tx, payload) {
    const { columnId } = payload;

    const res = await tx.query('SELECT * FROM columns WHERE id = $1', [
      columnId,
    ]);
    const row = res.rows[0];
    if (!row) throw notFound(`Column not found: ${columnId}`);

    const cardsRes = await tx.query(
      'SELECT * FROM cards WHERE column_id = $1 ORDER BY position',
      [columnId]
    );

    await tx.query('DELETE FROM cards WHERE column_id = $1', [columnId]);
    await tx.query('DELETE FROM columns WHERE id = $1', [columnId]);

    return { row, cards: cardsRes.rows };
  },

  buildInverse(payload, ctx) {
    return {
      type: 'ADD_COLUMN',
      payload: {
        id: ctx.row.id,
        title: ctx.row.title,
        position: ctx.row.position,
      },
    };
  },
};
