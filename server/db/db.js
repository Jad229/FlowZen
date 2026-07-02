import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const query = async function (sql, params = []) {
    const result = await pool.query(sql, params)
    return result;
}

const transaction = async function (callback) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await callback(client);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}

export { query, transaction };