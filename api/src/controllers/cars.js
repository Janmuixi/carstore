import { authenticateToken } from "../middlewares/auth.js";
import carModel from "../models/car.js";
import BaseController from "./base.js";
import fs from "fs/promises";
import multer from "multer";
import { promisify } from "util";

// Centralized option sets for cars
const ALLOWED_FUELS = new Set(['gasoline', 'diesel', 'electric', 'hybrid']);
const ALLOWED_TRANSMISSIONS = new Set(['manual', 'automatic']);
const ALLOWED_STATUSES = new Set(['available', 'sold', 'reserved']);

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
    this.uploadImages = this.uploadImages.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }
  routes(app) {
    app.post('/cars', authenticateToken, upload.any(), this.create);
    app.get('/cars', authenticateToken, this.findAll);
    app.get('/cars/:id', authenticateToken, this.findById);
    app.put('/cars/:id', authenticateToken, this.update);
    app.delete('/cars/:id', authenticateToken, this.delete);
    app.post('/cars/:id/images', authenticateToken, upload.any(), this.uploadImages);
    app.delete('/cars/:id/images/:imageId', authenticateToken, this.deleteImage);
    app.post('/cars/fill', authenticateToken, this.fill);
    app.get('/caroptions', authenticateToken, this.options);
  }
  async create(req, res) {
    try {
      const images = req.files || [];
      // Whitelist and coerce fields according to the new schema
      const {
        make,
        model,
        description,
        year,
        km,
        fuel,
        transmission,
        doors,
        seats,
        color,
        price,
        status,
        warranty_expiration_date,
      } = req.body || {};

      const requiredFields = { make, model, description, year, km, fuel, transmission, doors, seats, color, price };
      for (const [key, value] of Object.entries(requiredFields)) {
        if (value === undefined || value === null || String(value).length === 0) {
          return res.status(400).json({ status: 'error', message: `Missing required field: ${key}` });
        }
      }

      const carData = {
        make: String(make),
        model: String(model),
        description: String(description),
        year: Number.parseInt(year, 10),
        km: Number.parseInt(km, 10),
        fuel: String(fuel),
        transmission: String(transmission),
        doors: Number.parseInt(doors, 10),
        seats: Number.parseInt(seats, 10),
        color: String(color),
        price: Number.parseFloat(price),
      };

      if (!Number.isFinite(carData.year) || carData.year < 1886 || carData.year > new Date().getFullYear()) {
        return res.status(400).json({ status: 'error', message: 'Invalid year' });
      }
      if (!Number.isFinite(carData.km) || carData.km < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid kilometers' });
      }
      if (!Number.isFinite(carData.doors) || carData.doors < 1) {
        return res.status(400).json({ status: 'error', message: 'Invalid doors' });
      }
      if (!Number.isFinite(carData.seats) || carData.seats < 1) {
        return res.status(400).json({ status: 'error', message: 'Invalid seats' });
      }
      if (!Number.isFinite(carData.price) || carData.price < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid price' });
      }
      if (!ALLOWED_FUELS.has(carData.fuel)) {
        return res.status(400).json({ status: 'error', message: 'Invalid fuel' });
      }
      if (!ALLOWED_TRANSMISSIONS.has(carData.transmission)) {
        return res.status(400).json({ status: 'error', message: 'Invalid transmission' });
      }

      if (status) carData.status = String(status);
      if (carData.status && !ALLOWED_STATUSES.has(carData.status)) {
        return res.status(400).json({ status: 'error', message: 'Invalid status' });
      }
      if (warranty_expiration_date) carData.warranty_expiration_date = String(warranty_expiration_date);

      const car = await this.model.create(carData);
      await this.model.uploadImages(car.id, images.map(image => image.buffer));
      return res.status(201).json({ status: 'success', message: "Car created successfully", data: car });
    } catch (error) {
      return res.status(500).json({ status: 'error', error: error.message });
    }
  }
  async update(req, res) {
    const { id } = req.params;
    try {
      const payload = req.body || {};
      // Only allow known fields and coerce types where appropriate
      const allowed = {};
      if (payload.make !== undefined) allowed.make = String(payload.make);
      if (payload.model !== undefined) allowed.model = String(payload.model);
      if (payload.description !== undefined) allowed.description = String(payload.description);
      if (payload.year !== undefined) allowed.year = Number.parseInt(payload.year, 10);
      if (payload.km !== undefined) allowed.km = Number.parseInt(payload.km, 10);
      if (payload.fuel !== undefined) allowed.fuel = String(payload.fuel);
      if (payload.transmission !== undefined) allowed.transmission = String(payload.transmission);
      if (payload.doors !== undefined) allowed.doors = Number.parseInt(payload.doors, 10);
      if (payload.seats !== undefined) allowed.seats = Number.parseInt(payload.seats, 10);
      if (payload.color !== undefined) allowed.color = String(payload.color);
      if (payload.price !== undefined) allowed.price = Number.parseFloat(payload.price);
      if (payload.status !== undefined) allowed.status = String(payload.status);
      if (payload.warranty_expiration_date !== undefined) {
        allowed.warranty_expiration_date = String(payload.warranty_expiration_date);
      }

      // Validate enums if provided
      if (allowed.fuel !== undefined && !ALLOWED_FUELS.has(allowed.fuel)) {
        return res.status(400).json({ status: 'error', message: 'Invalid fuel' });
      }
      if (allowed.transmission !== undefined && !ALLOWED_TRANSMISSIONS.has(allowed.transmission)) {
        return res.status(400).json({ status: 'error', message: 'Invalid transmission' });
      }
      if (allowed.status !== undefined && !ALLOWED_STATUSES.has(allowed.status)) {
        return res.status(400).json({ status: 'error', message: 'Invalid status' });
      }

      const data = await this.model.update(id, allowed);
      if (!data) {
        return res.status(404).json({ status: 'error', message: 'Not found' });
      }
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
  async options(_req, res) {
    try {
      return res.status(200).json({
        status: 'success',
        data: {
          fuel: Array.from(ALLOWED_FUELS),
          transmission: Array.from(ALLOWED_TRANSMISSIONS),
          status: Array.from(ALLOWED_STATUSES),
        }
      });
    } catch (error) {      
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async uploadImages(req, res) {
    const { id } = req.params;
    try {
      const images = req.files || [];
      if (images.length === 0) {
        return res.status(400).json({ status: 'error', message: 'No images provided' });
      }

      await this.model.uploadImages(id, images.map(image => image.buffer));
      const updatedCar = await this.model.findById(id);
      
      return res.status(200).json({ 
        status: 'success', 
        message: 'Images uploaded successfully',
        data: updatedCar
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async deleteImage(req, res) {
    const { id, imageId } = req.params;
    try {
      const database = await this.model.getDatabase();
      const runAsync = promisify(database.run).bind(database);
      
      const result = await runAsync(
        'DELETE FROM car_images WHERE id = ? AND car_id = ?',
        [imageId, id]
      );

      if (result.changes === 0) {
        return res.status(404).json({ status: 'error', message: 'Image not found' });
      }

      return res.status(200).json({ 
        status: 'success', 
        message: 'Image deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
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