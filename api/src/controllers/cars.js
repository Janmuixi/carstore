import { authenticateToken } from "../middlewares/auth.js";
import carModel from "../models/car.js";
import BaseController from "./base.js"
import fs from "fs/promises";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
        app.post('/cars', authenticateToken, upload.any(), this.create);
        app.get('/cars', authenticateToken, this.findAll);
        app.get('/cars/:id', authenticateToken, this.findById);
        app.put('/cars/:id', authenticateToken, this.update);
        app.delete('/cars/:id', authenticateToken, this.delete);
        app.post('/cars/fill', authenticateToken, this.fill);
    }
    async create(req, res) {
        try {
            const images = req.files || [];
            const carData = { ...req.body };
            const car = await this.model.create(carData);
            await this.model.uploadImages(car.id, images.map(image => image.buffer));
            return res.status(201).json({ status: 'success', message: "Car created successfully", data: car });
        } catch (error) {
            return res.status(500).json({ status: 'error', error: error.message });
        }
    }
    async fill(_, res) {
        try {
            // TODO: Find a way to fill the database with car models
            const cars = await this.model.findAll();
            if (cars.length > 0) {
                return res.status(200).json({ message: "Cars already filled" });
            }
            const modelsFile = await fs.readFile('all-vehicles-model.json', 'utf-8');
            const models = JSON.parse(modelsFile);
            return res.status(201).json({ message: "Cars filled successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new CarsController();