import express from 'express';
import db, { initDatabase, healthCheck } from './db/connectToDatabase.js';
import UserController from './controllers/users.js';
import CarsController from './controllers/cars.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());

app.use(cors());
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
