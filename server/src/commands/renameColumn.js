import { notFound } from './errors.js';

// RENAME_COLUMN: capture the current title, then rename. The inverse
// restores the prior title.
export default {
  async apply(tx, payload) {
    const { columnId, title } = payload;

    const res = await tx.query('SELECT title FROM columns WHERE id = $1', [
      columnId,
    ]);
    const row = res.rows[0];
    if (!row) throw notFound(`Column not found: ${columnId}`);

    await tx.query('UPDATE columns SET title = $1 WHERE id = $2', [
      title,
      columnId,
    ]);

    return { oldTitle: row.title };
  },

  buildInverse(payload, ctx) {
    return {
      type: 'RENAME_COLUMN',
      payload: { columnId: payload.columnId, title: ctx.oldTitle },
    };
  },
};
