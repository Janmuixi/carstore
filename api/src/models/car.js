import Base from "./base.js";
import db from '../db/connectToDatabase.js';

class Car extends Base {
    constructor() {
        super('cars');
    }
    async uploadImages(carId, images) {
        const database = await db();
        const stmt = database.prepare("INSERT INTO car_images (car_id, image_data) VALUES (?, ?)");

        try {
            // even if your ide says that await is not needed here, it is, if we do not do it, there is no transaction for the commit when there is more than one image
            await database.run("BEGIN TRANSACTION");
            for (const image of images) {
                await stmt.run(carId, image);
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