import { notFound } from './errors.js';

// MOVE_COLUMN: capture the current position, then update it. The inverse
// restores the prior position.
export default {
  async apply(tx, payload) {
    const { columnId, position } = payload;

    const res = await tx.query('SELECT position FROM columns WHERE id = $1', [
      columnId,
    ]);
    const row = res.rows[0];
    if (!row) throw notFound(`Column not found: ${columnId}`);

    await tx.query('UPDATE columns SET position = $1 WHERE id = $2', [
      position,
      columnId,
    ]);

    return { oldPosition: row.position };
  },

  buildInverse(payload, ctx) {
    return {
      type: 'MOVE_COLUMN',
      payload: { columnId: payload.columnId, position: ctx.oldPosition },
    };
  },
};
