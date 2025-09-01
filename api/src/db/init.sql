PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    description TEXT NOT NULL,
    year INTEGER NOT NULL,
    km INTEGER NOT NULL,
    fuel TEXT NOT NULL CHECK (fuel IN ('gasoline','diesel','electric','hybrid')),
    transmission TEXT NOT NULL CHECK (transmission IN ('manual','automatic')),
    doors INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    color TEXT NOT NULL,
    price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','sold','reserved')),
    warranty_expiration_date TEXT,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TRIGGER IF NOT EXISTS trg_cars_updated_at
AFTER UPDATE ON cars
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE cars SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TABLE IF NOT EXISTS car_images (
    id TEXT PRIMARY KEY,
    car_id TEXT NOT NULL,
    image_data BLOB NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
