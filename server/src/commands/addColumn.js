// ADD_COLUMN: insert a column on the current board. Accepts an optional
// explicit `id` so DELETE_COLUMN's inverse can restore the exact column.
// The board id is supplied by the service (from the route), never the payload.
export default {
  async apply(tx, payload, boardId) {
    const { title, position, id } = payload;

    let result;
    if (id != null) {
      result = await tx.query(
        `INSERT INTO columns (id, board_id, title, position)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [id, boardId, title, position]
      );
    } else {
      result = await tx.query(
        `INSERT INTO columns (board_id, title, position)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [boardId, title, position]
      );
    }

    return { id: result.rows[0].id };
  },

  buildInverse(payload, ctx) {
    return { type: 'DELETE_COLUMN', payload: { columnId: ctx.id } };
  },
};
