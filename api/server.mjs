



import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let products = [];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const product = { ...req.body, id: uuidv4() };
  products.push(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updatedProduct = { ...req.body, id };
  products = products.map(product => product.id === id ? updatedProduct : product);
  res.json(updatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(product => product.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
