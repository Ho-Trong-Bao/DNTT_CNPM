-- Tạo database
CREATE DATABASE IF NOT EXISTS sachcu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sachcu_db;

-- Bảng User
CREATE TABLE User (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    province VARCHAR(50),
    district VARCHAR(50),
    ward VARCHAR(50),
    status ENUM('pending', 'active', 'suspended', 'banned', 'deleted') DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Admin
CREATE TABLE Admin (
    adminID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Category
CREATE TABLE Category (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100) NOT NULL UNIQUE
);

-- Bảng Book
CREATE TABLE Book (
    bookID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100),
    bookCondition VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    contactInfo VARCHAR(100),
    province VARCHAR(50),
    district VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Posts
CREATE TABLE Posts (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    bookID INT NOT NULL UNIQUE,
    description TEXT,
    status ENUM('approved', 'pending', 'declined', 'sold') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (bookID) REFERENCES Book(bookID) ON DELETE CASCADE
);

-- Bảng BookCategory (Many-to-Many)
CREATE TABLE BookCategory (
    bookID INT NOT NULL,
    categoryID INT NOT NULL,
    PRIMARY KEY (bookID, categoryID),
    FOREIGN KEY (bookID) REFERENCES Book(bookID) ON DELETE CASCADE,
    FOREIGN KEY (categoryID) REFERENCES Category(categoryID) ON DELETE CASCADE
);

-- Bảng Report
CREATE TABLE Report (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL,
    adminID INT,
    reason TEXT,
    reportDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('open', 'resolved', 'dismissed') DEFAULT 'open',
    FOREIGN KEY (postID) REFERENCES Posts(postID) ON DELETE CASCADE,
    FOREIGN KEY (adminID) REFERENCES Admin(adminID) ON DELETE SET NULL
);

-- Insert dữ liệu mẫu
INSERT INTO Category (categoryName) VALUES 
('Văn học Việt Nam'), 
('Văn học nước ngoài'), 
('Kỹ năng sống'), 
('Tin học'), 
('Kinh tế'), 
('Thiếu nhi');

INSERT INTO Admin (name, email, password) VALUES 
('Admin', 'admin@sachcu.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
-- Password: admin123

-- Dữ liệu User mẫu
INSERT INTO User (name, email, password, phone, province, district) VALUES 
('Nguyễn Văn A', 'nguyenvana@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0909123456', 'TP.HCM', 'Quận 1');
-- Password: 123456