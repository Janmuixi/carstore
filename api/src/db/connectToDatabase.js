import sqlite3 from 'sqlite3';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const db = async () => {
  try {
    return new sqlite3.Database('database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error('❌ Failed to open SQLite DB:', err.message);
      }
    });
  } catch (err) {
    console.error('❌ Failed to open SQLite DB:', err.message);
  }
};

export const healthCheck = async () => {
  try {
    const database = await db();
    await database.get('SELECT 1');
    return { status: 'success', message: 'Database connection is healthy' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

export const initDatabase = async () => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
    const database = await db();
    const response = await new Promise((resolve, reject) => {
      database.exec(initSql, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default db;
