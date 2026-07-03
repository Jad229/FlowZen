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
        const result = await query('SELECT * FROM boards WHERE id = $1', [id])
        res.json({ message: 'Board fetched successfully', board: result.rows[0] })
    } catch (error) {
        res.json({ message: 'An error occurred, could not fetch board', error })
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
    try {
        const result = await query('DELETE FROM boards WHERE id = $1', [id])
        res.json({ message: 'Board deleted successfully', board: result.rows[0] })
    } catch (error) {
        res.json({ message: 'An error occurred, could not delete board', error })
    }
}
