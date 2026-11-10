CREATE DATABASE IF NOT EXISTS multiproject;
USE multiproject;

CREATE TABLE users (
    id CHAR(32) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE sessions (
    token CHAR(32) PRIMARY KEY,
    user_id CHAR(32) NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cards (
    id CHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    column_id ENUM('todo', 'in-progress', 'done') NOT NULL,
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    user_id CHAR(32) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- user_id is nullable here, matching cards above: entries saved before
-- accounts existed have no owner and stay inaccessible rather than shared
-- with everyone; see main.py.
CREATE TABLE food_entries (
    id CHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories FLOAT NOT NULL,
    protein FLOAT NOT NULL,
    carbs FLOAT NOT NULL,
    date DATE NOT NULL,
    user_id CHAR(32) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE food_database (
    number INT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_sv VARCHAR(255) NOT NULL,
    calories FLOAT NOT NULL,
    protein FLOAT NOT NULL,
    carbs FLOAT NOT NULL
);
