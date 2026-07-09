import { notFound } from './errors.js';

// DELETE_CARD: capture the full row, then delete it. The inverse is an
// ADD_CARD that restores the exact row (including id and position).
export default {
  async apply(tx, payload) {
    const { cardId } = payload;

    const res = await tx.query('SELECT * FROM cards WHERE id = $1', [cardId]);
    const row = res.rows[0];
    if (!row) throw notFound(`Card not found: ${cardId}`);

    await tx.query('DELETE FROM cards WHERE id = $1', [cardId]);

    return { row };
  },

  buildInverse(payload, ctx) {
    const { row } = ctx;
    return {
      type: 'ADD_CARD',
      payload: {
        id: row.id,
        columnId: row.column_id,
        title: row.title,
        description: row.description,
        position: row.position,
      },
    };
  },
};
