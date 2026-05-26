const express = require('express');
const db = require('./database');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


app.post('/tarefas', (req, res) => {
    const { nome, prazo } = req.body;

    if (!nome || !prazo) {
        return res.status(400).json({
            erro: "Nome e prazo são obrigatórios"
        });
    }

    db.run(
        'INSERT INTO tarefas (nome, prazo) VALUES (?, ?)',
        [nome, prazo],
        function () {
            res.status(201).json({
                id: this.lastID,
                nome,
                prazo,
                status: 'pendente'
            });
        }
    );
});


app.get('/tarefas', (req, res) => {
    db.all('SELECT * FROM tarefas', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});


app.get('/tarefas/:id', (req, res) => {
    db.get(
        'SELECT * FROM tarefas WHERE id = ?',
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            if (!row) {
                return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
            }
            res.json(row);
        }
    );
});


app.put('/tarefas/:id', (req, res) => {
    const { nome, prazo, status } = req.body;

    db.run(
        'UPDATE tarefas SET nome = ?, prazo = ?, status = ? WHERE id = ?',
        [nome, prazo, status, req.params.id],
        function () {
            res.json({ mensagem: 'Tarefa atualizada com sucesso' });
        }
    );
});


app.delete('/tarefas/:id', (req, res) => {
    db.run(
        'DELETE FROM tarefas WHERE id = ?',
        [req.params.id],
        function () {
            res.json({ mensagem: 'Tarefa removida com sucesso' });
        }
    );
});


app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});