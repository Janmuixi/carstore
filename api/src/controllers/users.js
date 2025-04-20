import { authenticateToken, generateToken } from '../middlewares/auth.js';
import BaseController from './base.js';
import userModel from '../models/user.js';

class UserController extends BaseController {
    constructor() {
        super(userModel);
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    routes(app) {
        app.post('/users', authenticateToken, this.create);
        app.post('/users/login', this.login);
        app.get('/users', authenticateToken, this.findAll);
        app.get('/users/:id', authenticateToken, this.findById);
        app.put('/users/:id', authenticateToken, this.update);
        app.delete('/users/:id', authenticateToken, this.delete);
    }
    create = async (req, res) => {
        try {
            const userObj = req.body;
            const { password } = userObj;
            const hashedPassword = await this.model.hashPassword(password);
            delete userObj.password;
            userObj.password_hash = hashedPassword;
            const id = await this.model.create(userObj);
            res.status(201).json({ status: 'success', data: id });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await this.model.findByEmail(email);
            if (!user) {
                return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
            }
            const isValidPassword = await usersModel.comparePassword(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
            }
            const token = generateToken(user.id);
            res.status(200).json({ status: 'success', data: token });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new UserController();