// ADD_CARD: insert a card. Accepts an optional explicit `id` so that
// DELETE_CARD's inverse can restore the exact original row.
export default {
  async apply(tx, payload) {
    const { columnId, title, description = null, position, id } = payload;

    let result;
    if (id != null) {
      result = await tx.query(
        `INSERT INTO cards (id, column_id, title, description, position)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [id, columnId, title, description, position]
      );
    } else {
      result = await tx.query(
        `INSERT INTO cards (column_id, title, description, position)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [columnId, title, description, position]
      );
    }

    return { id: result.rows[0].id };
  },

  buildInverse(payload, ctx) {
    return { type: 'DELETE_CARD', payload: { cardId: ctx.id } };
  },
};
