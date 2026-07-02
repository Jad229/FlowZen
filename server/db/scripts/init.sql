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