CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES boards(id),
    title VARCHAR(150) NOT NULL,
    position SMALLINT NOT NULL
);

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    column_id INTEGER REFERENCES columns(id),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    position SMALLINT NOT NULL
);

CREATE TABLE action_log (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL,
    command_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    inverse_payload JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'undone')) DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (board_id, sequence_number)
);