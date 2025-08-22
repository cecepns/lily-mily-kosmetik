-- Cosmetic Store Database Schema
-- Database: toko_kosmetik_ariani

CREATE DATABASE IF NOT EXISTS toko_kosmetik_ariani;
USE toko_kosmetik_ariani;

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    online_store_link VARCHAR(500),
    brand_id INT,
    category_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Reviews table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Skincare', 'Produk perawatan kulit wajah dan tubuh'),
('Bodycare', 'Produk perawatan tubuh dan kesehatan kulit'),
('Haircare', 'Produk perawatan rambut dan kulit kepala'),
('Make-up', 'Produk kosmetik dan makeup'),
('Accessories', 'Aksesoris kecantikan dan perawatan');

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password, email) VALUES
('admin', '$2b$10$rQZ8YQZ8YQZ8YQZ8YQZ8YO8YQZ8YQZ8YQZ8YQZ8YQZ8YQZ8YQZ8YQ', 'admin@tokokosmetik.com');

-- Insert sample brands
INSERT INTO brands (name, description) VALUES
('Wardah', 'Kosmetik halal berkualitas tinggi'),
('Emina', 'Makeup untuk generasi muda'),
('Pixy', 'Kosmetik dengan kualitas terjangkau'),
('Make Over', 'Professional makeup brand'),
('Sariayu', 'Kosmetik tradisional Indonesia');