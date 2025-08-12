-- File table
CREATE TABLE IF NOT EXISTS file_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT UNIQUE NOT NULL,
    base_name TEXT NOT NULL
);

-- Symbol table
CREATE TABLE IF NOT EXISTS symbol_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol_name TEXT NOT NULL,
    origin_file_path TEXT NOT NULL
);

-- Variable Declaration table
CREATE TABLE IF NOT EXISTS variable_declaration_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol_id INTEGER NOT NULL REFERENCES symbol_table(id),
    file_id INTEGER NOT NULL REFERENCES file_table(id),
    declaration_text TEXT,
    line_number INTEGER,
    column_number INTEGER,
    declaration_type TEXT
);

-- Join table
CREATE TABLE IF NOT EXISTS file_symbol (
    file_id INTEGER NOT NULL REFERENCES file_table(id),
    symbol_id INTEGER NOT NULL REFERENCES symbol_table(id),
    PRIMARY KEY (file_id, symbol_id)
);
