import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";

// Define paths
const DB_DIR = "data";
const DB_FILE = path.join(DB_DIR, "app.db");
const SCHEMA_FILE = "./src/schema/schema.sql";

// Ensure the data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

// Initialize the database
const db = new Database(DB_FILE, { verbose: console.log });

// Initialize schema
const initializeSchema = (): void => {
  const schema = fs.readFileSync(SCHEMA_FILE, "utf8");
  db.exec(schema);
};

// Types
export interface FileEntry {
  filePath: string;
  baseName: string;
}

export interface SymbolEntry {
  symbolName: string;
  originFilePath: string;
}

export interface VariableDeclaration {
  symbolId: number;
  fileId: number;
  declarationText: string;
  lineNumber: number;
  columnNumber: number;
  declarationType: string;
}

// Insert a file into the database
export const insertFile = (filePath: string, baseName: string): number => {
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO file_table (file_path, base_name) VALUES (?, ?)`
  );
  const result = stmt.run(filePath, baseName);
  return result.lastInsertRowid as number;
};

// Insert a symbol into the database
export const insertSymbol = (
  symbolName: string,
  originFilePath: string
): number => {
  const stmt = db.prepare(
    `INSERT INTO symbol_table (symbol_name, origin_file_path) VALUES (?, ?)`
  );
  const result = stmt.run(symbolName, originFilePath);
  return result.lastInsertRowid as number;
};

// Insert a variable declaration into the database
export const insertVariableDeclaration = (
  symbolId: number,
  fileId: number,
  declarationText: string,
  lineNumber: number,
  columnNumber: number,
  declarationType: string
): void => {
  const stmt = db.prepare(
    `INSERT INTO variable_declaration_table 
         (symbol_id, file_id, declaration_text, line_number, column_number, declaration_type)
         VALUES (?, ?, ?, ?, ?, ?)`
  );
  stmt.run(
    symbolId,
    fileId,
    declarationText,
    lineNumber,
    columnNumber,
    declarationType
  );
};

// Close and back up the database on exit
export const closeDatabase = (): void => {
  db.close();
  console.log(`Database saved to ${DB_FILE}`);
};

// Initialize schema at startup
initializeSchema();
