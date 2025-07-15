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
    price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS car_images (
    id TEXT PRIMARY KEY,
    car_id TEXT NOT NULL,
    image_data BYTEA NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id)
);
