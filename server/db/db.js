import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function query(sql, params = []) {
    const result = await pool.query(sql, params)
    return result;
}

async function transaction(callback) {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const result = await callback(connection);
        await connection.query('COMMIT');
        return result;
    } catch (error) {
        await connection.query('ROLLBACK');
        throw error;
    } finally {
        connection.release();
    }
}

export { query, transaction };