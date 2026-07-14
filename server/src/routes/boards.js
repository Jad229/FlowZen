import { query, transaction } from '../../db/db.js';
import { getBoardWithColumnsAndCards } from '../repositories/boardRepository.js';
import { getHistoryState } from '../repositories/actionLogRepository.js';

export const getBoards = async (req, res) => {
    try {
        const result = await query('SELECT * FROM boards')
        res.json({ message: 'Boards fetched successfully', boards: result.rows })
    } catch (error) {
        res.json({ message: 'An error occurred, could not fetch boards', error })
    }
}

export const getBoard = async (req, res) => {
    const { id } = req.params;
    try {
        const board = await getBoardWithColumnsAndCards(id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        const history = await getHistoryState(id);
        res.json({ message: 'Board fetched successfully', board, ...history });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred, could not fetch board', error: error.message });
    }
}

export const createBoard = async (req, res) => {
    const { name } = req.body;

    try {
        const result = await transaction(async (tx) => {
            const boardQuery = await tx.query('INSERT INTO boards (name) VALUES ($1) RETURNING *', [name])
            const board = boardQuery.rows[0]

            await tx.query('INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3)', [board.id, 'To Do', 1])
            await tx.query('INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3)', [board.id, 'In Progress', 2])
            await tx.query('INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3)', [board.id, 'Done', 3])

            return board
        })

        res.json({
            message: 'Board created successfully', board: result
        })

    } catch (error) {
        res.json({ message: 'An error occurred, could not create board', error })
    }
}

export const deleteBoard = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Board id is required' });
    }

    try {
        const board = await transaction(async (tx) => {
            await tx.query(
                `DELETE FROM cards
                 WHERE column_id IN (SELECT id FROM columns WHERE board_id = $1)`,
                [id]
            );
            await tx.query('DELETE FROM columns WHERE board_id = $1', [id]);
            // action_log rows cascade via ON DELETE CASCADE
            const result = await tx.query(
                'DELETE FROM boards WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rowCount === 0) {
                const err = new Error(`Board not found: ${id}`);
                err.status = 404;
                throw err;
            }

            return result.rows[0];
        });

        res.json({ message: 'Board deleted successfully', board });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            message: 'An error occurred, could not delete board',
            error: error.message,
        });
    }
}
