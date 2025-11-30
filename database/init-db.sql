-- ===========================================
-- TẠO DATABASE (HỖ TRỢ TIẾNG VIỆT FULL)
-- ===========================================
DROP DATABASE IF EXISTS sachcu_db;
CREATE DATABASE sachcu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sachcu_db;

-- ===========================================
-- BẢNG USER
-- ===========================================
CREATE TABLE User (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    province VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    district VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    ward VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    status ENUM('pending','active','suspended','banned','deleted') DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG ADMIN
-- ===========================================
CREATE TABLE Admin (
    adminID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG CATEGORY
-- ===========================================
CREATE TABLE Category (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE
);

-- ===========================================
-- BẢNG BOOK
-- ===========================================
CREATE TABLE Book (
    bookID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    author VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    bookCondition VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    price DECIMAL(10,2) NOT NULL,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    image VARCHAR(255),
    contactInfo VARCHAR(100),
    province VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    district VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG POSTS
-- ===========================================
CREATE TABLE Posts (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    bookID INT NOT NULL UNIQUE,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    status ENUM('approved','pending','declined','sold') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (bookID) REFERENCES Book(bookID) ON DELETE CASCADE
);

-- ===========================================
-- BẢNG BOOKCATEGORY
-- ===========================================
CREATE TABLE BookCategory (
    bookID INT NOT NULL,
    categoryID INT NOT NULL,
    PRIMARY KEY (bookID, categoryID),
    FOREIGN KEY (bookID) REFERENCES Book(bookID) ON DELETE CASCADE,
    FOREIGN KEY (categoryID) REFERENCES Category(categoryID) ON DELETE CASCADE
);

-- ===========================================
-- BẢNG REPORT
-- ===========================================
CREATE TABLE Report (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL,
    adminID INT,
    reason TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    reportDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('open','resolved','dismissed') DEFAULT 'open',
    FOREIGN KEY (postID) REFERENCES Posts(postID) ON DELETE CASCADE,
    FOREIGN KEY (adminID) REFERENCES Admin(adminID) ON DELETE SET NULL
);

-- ===========================================
-- THÊM DỮ LIỆU CATEGORY
-- ===========================================
INSERT INTO Category (categoryName) VALUES
('Văn học Việt Nam'),
('Văn học nước ngoài'),
('Kỹ năng sống'),
('Tin học'),
('Kinh tế'),
('Thiếu nhi'),
('Truyện tranh - Manga'),
('Giáo trình đại học'),
('Tâm lý - Triết học'),
('Light Novel');

-- ===========================================
-- ADMIN MẶC ĐỊNH
-- Password: admin123
-- ===========================================
INSERT INTO Admin (name, email, password) VALUES
('Quản trị viên', 'admin@sachcu.vn',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- ===========================================
-- USERS MẪU (10+)
-- Password: 123456
-- ===========================================
INSERT INTO User (name, email, password, phone, province, district, ward) VALUES
('Nguyễn Văn A', 'vana@gmail.com','123456','0909123456','TP.HCM','Quận 1','Bến Nghé'),
('Trần Thị B', 'thib@gmail.com','123456','0918123456','TP.HCM','Quận 3','Phường 5'),
('Lê Minh C', 'minhc@gmail.com','123456','0935123456','Hà Nội','Cầu Giấy','Dịch Vọng'),
('Phạm Duy D', 'duyd@gmail.com','123456','0967123456','Đà Nẵng','Hải Châu','Thuận Phước'),
('Đặng Quỳnh E','quynhe@gmail.com','123456','0973123456','Cần Thơ','Ninh Kiều','An Bình'),
('Nguyễn Hoàng F','hoangf@gmail.com','123456','0982123456','Hà Nội','Ba Đình','Điện Biên'),
('Trương Mỹ G','myg@gmail.com','123456','0912123456','TP.HCM','Bình Thạnh','Phường 25'),
('Lý Quốc H','quoch@gmail.com','123456','0939123456','Đồng Nai','Biên Hòa','Tân Hiệp'),
('Cao Kim I','kimi@gmail.com','123456','0922123456','Hải Phòng','Lê Chân','An Biên'),
('Hoàng Nhật K','nhatk@gmail.com','123456','0948123456','Huế','Hương Thủy','Thủy Phương');

-- ===========================================
-- BOOKS + POSTS SAMPLE (20+ sách)
-- ===========================================
INSERT INTO Book (title, author, bookCondition, price, description, province, district, contactInfo) VALUES
('Đắc nhân tâm', 'Dale Carnegie', 'Cũ (80%)', 60000, 'Sách kỹ năng kinh điển, bản in đẹp.', 'TP.HCM','Quận 1','0909123456'),
('Nhà giả kim', 'Paulo Coelho', 'Cũ nhẹ (90%)', 75000, 'Một tiểu thuyết truyền cảm hứng.', 'Hà Nội','Cầu Giấy','0967123456'),
('Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 'Mới 98%', 50000, 'Truyện thiếu nhi kinh điển.', 'TP.HCM','Quận 3','0918123456'),
('Tôi thấy hoa vàng trên cỏ xanh', 'Nguyễn Nhật Ánh', 'Cũ 85%', 55000,'Tác phẩm nổi tiếng của Nguyễn Nhật Ánh.', 'Đà Nẵng','Hải Châu','0967123456'),
('Lập trình Java cơ bản', 'NXB CNTT', 'Mới 99%', 120000, 'Giáo trình học Java cho sinh viên.', 'TP.HCM','Bình Thạnh','0939123456'),
('Lập trình Python nâng cao', 'NXB CNTT', 'Cũ 90%', 95000, 'Hướng dẫn lập trình Python chi tiết.', 'Hà Nội','Hai Bà Trưng','0982123456'),
('Cha giàu cha nghèo', 'Robert Kiyosaki', 'Cũ 80%', 65000, 'Sách tài chính kinh điển.', 'Cần Thơ','Ninh Kiều','0973123456'),
('7 thói quen hiệu quả', 'Stephen R.Covey', 'Mới 97%', 80000, 'Phát triển bản thân.', 'HCM','Quận 10','0909123456'),
('One Piece Tập 1', 'Eiichiro Oda', 'Cũ nhẹ', 30000, 'Manga nổi tiếng.', 'Đồng Nai','Biên Hòa','0922123456'),
('Naruto Tập 55', 'Masashi Kishimoto', 'Cũ (70%)', 20000, 'Manga hành động.', 'Hải Phòng','Lê Chân','0912123456'),
('Sherlock Holmes Toàn Tập', 'Arthur Conan Doyle', 'Cũ', 110000, 'Truyện trinh thám kinh điển.', 'Huế','Hương Thủy','0948123456'),
('Kinh tế học vĩ mô', 'Paul Samuelson', 'Mới', 130000, 'Giáo trình kinh tế.', 'Hà Nội','Ba Đình','0973123456');

-- POSTS (match bookID)
INSERT INTO Posts (userID, bookID, description, status) VALUES
(1,1,'Bán rẻ vì không dùng nữa','approved'),
(2,2,'Sách đẹp, đọc 1 lần','approved'),
(3,3,'Sách thiếu nhi phù hợp học sinh','approved'),
(4,4,'Còn mới 85%','pending'),
(5,5,'Giáo trình cho sinh viên','approved'),
(6,6,'Dùng học Python rất tốt','approved'),
(7,7,'Bán lại giá tốt','approved'),
(8,8,'Sách kỹ năng còn mới','approved'),
(9,9,'Manga sưu tầm','approved'),
(10,10,'Bản đọc nhiều lần','pending'),
(3,11,'Sách dày, trinh thám hấp dẫn','approved'),
(2,12,'Giáo trình kinh tế như mới','approved');

-- BOOKCATEGORY mẫu
INSERT INTO BookCategory VALUES
(1,3),(2,2),(3,6),(4,1),(5,4),(6,4),(7,5),
(8,3),(9,7),(10,7),(11,2),(12,5);

-- REPORT sample
INSERT INTO Report (postID, adminID, reason, status) VALUES
(10,1,'Nội dung mập mờ, cần kiểm tra','open');
