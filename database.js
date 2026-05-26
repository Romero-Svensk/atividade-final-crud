const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tarefas.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            prazo TEXT NOT NULL,
            status TEXT DEFAULT 'pendente'
        )
    `);
});

module.exports = db;