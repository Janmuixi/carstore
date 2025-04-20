import { authenticateToken } from "../middlewares/auth.js";
import carModel from "../models/car.js";
import BaseController from "./base.js"

class CarsController extends BaseController {
    constructor() {
        super(carModel);
        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findById = this.findById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    routes(app) {
        app.post('/cars', authenticateToken, this.create);
        app.get('/cars', authenticateToken, this.findAll);
        app.get('/cars/:id', authenticateToken, this.findById);
        app.put('/cars/:id', authenticateToken, this.update);
        app.delete('/cars/:id', authenticateToken, this.delete);
    }
}

export default new CarsController();