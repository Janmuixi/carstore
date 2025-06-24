import Base from './base.js';
import bcrypt from 'bcrypt';
import {promisify} from 'util';
import db from '../db/connectToDatabase.js';

class User extends Base {
  constructor() {
    super('users');
  }
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
  async findByEmail(email) {
    const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
    const database = await db();
    const getAsync = promisify(database.get).bind(database);
    return getAsync(sql, [email]);
  }
}

export default new User();