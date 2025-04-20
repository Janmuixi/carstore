import express from 'express';
import db, { initDatabase, healthCheck } from './db/connectToDatabase.js';
import UserController from './controllers/users.js';
import CarsController from './controllers/cars.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

UserController.routes(app);
CarsController.routes(app);

app.get('/health-check', async (req, res) => {
  try {
    await healthCheck();
    res.status(200).json({ status: 'success', message: 'Database connection is healthy' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/init', async (req, res) => {
  try {
    await initDatabase();
    res.status(200).json({ status: 'success', message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
