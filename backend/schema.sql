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

-- Expense tracker. Unlike cards/food_entries, user_id is required here (no
-- legacy pre-auth rows to account for), so every row always has an owner.
CREATE TABLE transactions (
    id CHAR(32) PRIMARY KEY,
    type ENUM('income', 'expense') NOT NULL,
    category ENUM('food', 'rent', 'transport', 'utilities', 'subscriptions', 'entertainment', 'other') NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    user_id CHAR(32) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE budgets (
    id CHAR(32) PRIMARY KEY,
    category ENUM('food', 'rent', 'transport', 'utilities', 'subscriptions', 'entertainment', 'other') NOT NULL,
    monthly_limit DECIMAL(10, 2) NOT NULL,
    user_id CHAR(32) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (user_id, category)
);
