
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'hello';
const JWT_EXPIRATION = '20s';

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sample_db_products'
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user1' && password === '1234') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token expired' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/products', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', authenticateJWT, async (req, res) => {
  const { name, price, quantity } = req.body;
  const id = uuidv4();
  await pool.query('INSERT INTO products (id, name, price, quantity) VALUES (?, ?, ?, ?)', [id, name, price, quantity]);
  res.status(201).json({ id, name, price, quantity });
});

app.put('/api/products/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  await pool.query('UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]);
  res.json({ id, name, price, quantity });
});

app.delete('/api/products/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



/*in my phpmyadmin mysql i create a sample_db_products database,
 then i create a table with 4 columns
 (id(int),name(text),price(decimal),quantity(int))*/

// i use npm as javascript package manager