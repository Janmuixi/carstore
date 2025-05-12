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
        app.post('/cars/fill', authenticateToken, this.fill);
    }
    async fill(req, res) {
        try {
            const cars = await this.model.find();
            if (cars.length > 0) {
                return res.status(200).json({ message: "Cars already filled" });
            }
            const carData = [
                { name: "Car 1", brand: "Brand A", year: 2020 },
                { name: "Car 2", brand: "Brand B", year: 2021 },
                { name: "Car 3", brand: "Brand C", year: 2022 },
            ];
            await this.model.insertMany(carData);
            return res.status(201).json({ message: "Cars filled successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new CarsController();