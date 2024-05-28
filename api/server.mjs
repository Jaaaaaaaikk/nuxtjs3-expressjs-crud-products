import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sample_db_products'
});

app.get('/api/products', async (req, res) => {
  console.log('Received GET request for products');
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  console.log('Received POST request for new product');
  const { name, price, quantity } = req.body;
  console.log('Received product:', { name, price, quantity });
  const id = uuidv4();
  await pool.query('INSERT INTO products (id, name, price, quantity) VALUES (?, ?, ?, ?)', [id, name, price, quantity]);
  res.status(201).json({ id, name, price, quantity });
});

app.put('/api/products/:id', async (req, res) => {
  console.log('Received PUT request for product update');
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  console.log('Received update request for product:', { id, name, price, quantity });
  await pool.query('UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]);
  res.json({ id, name, price, quantity });
});

app.delete('/api/products/:id', async (req, res) => {
  console.log('Received DELETE request for product deletion');
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