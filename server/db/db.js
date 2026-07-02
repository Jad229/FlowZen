import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function query(sql, params = []) {
    const result = await pool.query(sql, params)
    return result;
}

async function transaction(callback) {
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

export default { query };