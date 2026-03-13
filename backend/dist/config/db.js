import Database from 'better-sqlite3';
import { join } from 'path';
// Store the SQLite file in the root of the backend folder
const dbPath = join(process.cwd(), 'database.sqlite');
export const db = new Database(dbPath, { verbose: console.log });
// Enable foreign keys
db.pragma('foreign_keys = ON');
export async function withTransaction(fn) {
    const transaction = db.transaction((data) => {
        return fn(data);
    });
    // better-sqlite3 transactions are synchronous by nature, 
    // but we'll wrap it to maintain compatibility with the existing async structure.
    return transaction(null);
}
// Mocking pool.connect logic since SQLite is local/single-connection
export async function withPgClient(fn) {
    return await fn(db);
}
