import Base from "./base.js";
import db from '../db/connectToDatabase.js';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

class Car extends Base {
    constructor() {
        super('cars');
    }
    async findAll() {
        const database = await db();
        const allAsync = promisify(database.all).bind(database);
        const cars = await allAsync(`SELECT * FROM cars`);
        if (!cars || cars.length === 0) return [];
        const carIds = cars.map((c) => c.id);
        const placeholders = carIds.map(() => '?').join(',');
        const imagesRows = await allAsync(
            `SELECT id, car_id, image_data FROM car_images WHERE car_id IN (${placeholders})`,
            carIds
        );
        const imagesByCarId = new Map();
        for (const row of imagesRows) {
            const list = imagesByCarId.get(row.car_id) || [];
            list.push({ id: row.id, car_id: row.car_id, image_data: row.image_data });
            imagesByCarId.set(row.car_id, list);
        }
        return cars.map((car) => ({ ...car, images: imagesByCarId.get(car.id) || [] }));
    }
    async findById(id) {
        const database = await db();
        const getAsync = promisify(database.get).bind(database);
        const allAsync = promisify(database.all).bind(database);
        const car = await getAsync(`SELECT * FROM cars WHERE id = ?`, [id]);
        if (!car) return null;
        const images = await allAsync(`SELECT id, car_id, image_data FROM car_images WHERE car_id = ?`, [id]);
        return { ...car, images };
    }
    async uploadImages(carId, images) {
        const database = await db();
        const stmt = database.prepare("INSERT INTO car_images (id, car_id, image_data) VALUES (?, ?, ?)");

        try {
            // even if your ide says that await is not needed here, it is, if we do not do it, there is no transaction for the commit when there is more than one image
            await database.run("BEGIN TRANSACTION");
            for (const image of images) {
                const id = uuidv4();
                await stmt.run(id, carId, image);
            }
            await database.run("COMMIT");
        } catch (error) {
            db.run("ROLLBACK");
            throw error;
        } finally {
            stmt.finalize();
        }
    }
}

export default new Car();