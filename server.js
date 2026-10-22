import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/tarefas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, titulo, criado_em FROM tarefas ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao listar tarefas' });
  }
});

app.post('/tarefas', async (req, res) => {
  const { titulo } = req.body || {};
  if (!titulo) return res.status(400).json({ erro: 'titulo é obrigatório' });
  try {
    const [result] = await pool.query('INSERT INTO tarefas (titulo) VALUES (?)', [titulo]);
    res.status(201).json({ id: result.insertId, titulo });
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao criar tarefa' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API rodando na porta ${port}`));
