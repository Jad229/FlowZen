import { notFound } from './errors.js';

// MOVE_CARD: capture the card's current column/position, then move it,
// shifting sibling positions so ordering stays contiguous. The inverse
// moves it back to where it was.
export default {
  async apply(tx, payload) {
    const { cardId, toColumnId, toPosition } = payload;

    const res = await tx.query(
      'SELECT column_id, position FROM cards WHERE id = $1',
      [cardId]
    );
    const row = res.rows[0];
    if (!row) throw notFound(`Card not found: ${cardId}`);

    const fromColumnId = row.column_id;
    const fromPosition = row.position;

    // Park the card so sibling shifts don't collide with it.
    await tx.query('UPDATE cards SET position = -1 WHERE id = $1', [cardId]);

    // Close the gap in the source column.
    await tx.query(
      `UPDATE cards
       SET position = position - 1
       WHERE column_id = $1 AND position > $2`,
      [fromColumnId, fromPosition]
    );

    // Open a gap at the destination index.
    await tx.query(
      `UPDATE cards
       SET position = position + 1
       WHERE column_id = $1 AND position >= $2`,
      [toColumnId, toPosition]
    );

    await tx.query(
      'UPDATE cards SET column_id = $1, position = $2 WHERE id = $3',
      [toColumnId, toPosition, cardId]
    );

    return { oldColumnId: fromColumnId, oldPosition: fromPosition };
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
