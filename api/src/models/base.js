import db from '../db/connectToDatabase.js';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

export default class Base {
  constructor(tableName) {
    this.tableName = tableName;
  }
  async findAll() {
    const sql = `SELECT * FROM ${this.tableName}`;
    const database = await db();
    console.log('SQL:', sql);
    const allAsync = promisify(database.all).bind(database);
    return allAsync(sql);
  }
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const database = await db();
    const getAsync = promisify(database.get).bind(database);
    return getAsync(sql, [id]);
  }
  async create(data) {
    const id = uuidv4();
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (id, ${keys.join(', ')}) VALUES (?, ${placeholders})`;
    const database = await db();
    const runAsync = promisify(database.run).bind(database);
    return runAsync(sql, [id, ...values]);
  }
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    const database = await db();
    const runAsync = promisify(database.run).bind(database);
    return runAsync(sql, [...values, id]);
  }
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const database = await db();
    const runAsync = promisify(database.run).bind(database);
    return runAsync(sql, [id]);
  }
}
