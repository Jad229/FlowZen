import { notFound } from './errors.js';

// MOVE_CARD: capture the card's current column/position, then move it.
// The inverse moves it back to where it was.
export default {
  async apply(tx, payload) {
    const { cardId, toColumnId, toPosition } = payload;

    const res = await tx.query(
      'SELECT column_id, position FROM cards WHERE id = $1',
      [cardId]
    );
    const row = res.rows[0];
    if (!row) throw notFound(`Card not found: ${cardId}`);

    await tx.query(
      'UPDATE cards SET column_id = $1, position = $2 WHERE id = $3',
      [toColumnId, toPosition, cardId]
    );

    return { oldColumnId: row.column_id, oldPosition: row.position };
  },

  buildInverse(payload, ctx) {
    return {
      type: 'MOVE_CARD',
      payload: {
        cardId: payload.cardId,
        toColumnId: ctx.oldColumnId,
        toPosition: ctx.oldPosition,
      },
    };
  },
};
