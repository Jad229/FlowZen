import { notFound } from './errors.js';

// UPDATE_CARD: capture the current title/description, then update. The
// inverse restores the prior values.
export default {
  async apply(tx, payload) {
    const { cardId, title, description = null } = payload;

    const res = await tx.query(
      'SELECT title, description FROM cards WHERE id = $1',
      [cardId]
    );
    const row = res.rows[0];
    if (!row) throw notFound(`Card not found: ${cardId}`);

    await tx.query(
      'UPDATE cards SET title = $1, description = $2 WHERE id = $3',
      [title, description, cardId]
    );

    return { oldTitle: row.title, oldDescription: row.description };
  },

  buildInverse(payload, ctx) {
    return {
      type: 'UPDATE_CARD',
      payload: {
        cardId: payload.cardId,
        title: ctx.oldTitle,
        description: ctx.oldDescription,
      },
    };
  },
};
