-- ===========================================
-- CẤU HÌNH DATABASE
-- ===========================================
DROP DATABASE IF EXISTS sachcu_db;
CREATE DATABASE sachcu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sachcu_db;

-- ===========================================
-- BẢNG USER
-- ===========================================
CREATE TABLE user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    province VARCHAR(50),
    district VARCHAR(50),
    ward VARCHAR(50),
    status ENUM('PENDING','ACTIVE','SUSPENDED','BANNED','DELETED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG ADMIN
-- ===========================================
CREATE TABLE admin (
    adminID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG CATEGORY
-- ===========================================
CREATE TABLE category (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- ===========================================
-- BẢNG BOOK
-- ===========================================
CREATE TABLE book (
    bookID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    province VARCHAR(50),
    district VARCHAR(50),
    book_condition VARCHAR(50),
    contact_info VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG POSTS
-- ===========================================
CREATE TABLE posts (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    bookID INT NOT NULL UNIQUE,
    description TEXT,
    status ENUM('APPROVED','PENDING','DECLINED','SOLD') DEFAULT 'PENDING',
    FOREIGN KEY (userID) REFERENCES user(userID) ON DELETE CASCADE,
    FOREIGN KEY (bookID) REFERENCES book(bookID) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG BOOK_CATEGORY
-- ===========================================
CREATE TABLE book_category (
    bookID INT NOT NULL,
    categoryID INT NOT NULL,
    PRIMARY KEY (bookID, categoryID),
    FOREIGN KEY (bookID) REFERENCES book(bookID) ON DELETE CASCADE,
    FOREIGN KEY (categoryID) REFERENCES category(categoryID) ON DELETE CASCADE
);

-- ===========================================
-- BẢNG REPORT
-- ===========================================
CREATE TABLE report (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL,
    adminID INT,
    reason TEXT,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('OPEN','RESOLVED','DISMISSED') DEFAULT 'OPEN',
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE,
    FOREIGN KEY (adminID) REFERENCES admin(adminID) ON DELETE SET NULL
);

-- ===========================================
-- CATEGORY SAMPLE DATA
-- ===========================================
INSERT INTO category (categoryID, category_name) VALUES
(1,'Văn học Việt Nam'),
(2,'Văn học nước ngoài'),
(3,'Kỹ năng sống'),
(4,'Tin học'),
(5,'Kinh tế'),
(6,'Thiếu nhi'),
(7,'Truyện tranh - Manga'),
(8,'Giáo trình đại học'),
(9,'Tâm lý - Triết học'),
(10,'Light Novel');

-- ===========================================
-- ADMIN SAMPLE
-- ===========================================
INSERT INTO admin (adminID, name, email, password, created_at) VALUES
(1,'Quản trị viên','admin@sachcu.vn','$2a$12$lKGQzsHyOLBhzUarV2OVm.jinv3lKI45N5yx.JRRAKtH.psnnHZNS','2025-12-01 16:16:50');

-- ===========================================
-- USER SAMPLE DATA
-- ===========================================
INSERT INTO user (userID, name, email, password, phone, province, district, ward, status, created_at, updated_at) VALUES
(11,'Test User','test@example.com','$2a$10$E35s03Qtut13vGQfMqwiauG4.fO4Vze8lWZL3vC3kvTJ7Aldxbzxq',NULL,NULL,NULL,NULL,'ACTIVE','2025-12-01 16:22:08','2025-12-01 16:22:08'),
(12,'User','user@example.com','$2a$12$lKGQzsHyOLBhzUarV2OVm.jinv3lKI45N5yx.JRRAKtH.psnnHZNS',NULL,NULL,NULL,NULL,'ACTIVE','2025-12-02 11:00:56','2025-12-02 11:00:56'),
(13,'Nguyễn Văn Test','test@gmail.com','$2a$10$B.vBwfDe5AdGfQ2mA5KpTeriWsP.biwqLGwjiqNZpwpdxYX18y3I.', '0909999999','TP.HCM','Quận 1','Bến Nghé','ACTIVE','2025-12-03 04:04:52','2025-12-03 04:04:52'),
(14,'Hồ Trọng Bảo','vungtau@gmail.com','$2a$10$v2XgrkmVbQ8pPn2MevXljeJ07p5ZD9A4v8qqelMaDdzlHrieSUYpm','0909888888','Hà Nội','Phường 11','Hà Đông','ACTIVE','2025-12-03 04:43:43','2025-12-06 15:39:15'),
(15,'Huy','huy@gmail.com','$2a$10$zql/pzUBgaDyyoQYu.QB5uzQyFzdjj4vMoonBXtOHlPOOlaq5Jsh.','0328605555','Hà Nội','Bình tân','Bến Nghé','ACTIVE','2025-12-03 13:23:32','2025-12-06 06:19:53'),
(16,'Huy','Hoang@gmail.com','$2a$10$x1u8HtXE8ROVR4tfduhu8.Kf0stGA6IOBmyZe0sQOjZog6n/4RM1.','0328605555','Hà Nội','Quận 1','Bến Nghé','ACTIVE','2025-12-06 05:36:29','2025-12-06 05:36:29'),
(17,'Bao','baocodon@gmail.com','$2a$10$m4j/WAnwzVwEfp/8vkK9HOX9gEEl6O/M5aSBPMQ23rJLh.SFcjI3W','0000001298','TP.HCM','Quận 1','Bến Nghé','ACTIVE','2025-12-06 07:08:40','2025-12-06 07:08:40');

-- ===========================================
-- BOOK SAMPLE DATA (KHỚP CỘT)
-- ===========================================
INSERT INTO `book` (`bookID`, `title`, `author`, `price`, `description`, `image`, `province`, `district`, `book_condition`, `contact_info`, `created_at`) VALUES
(1, 'Đắc nhân tâm', 'Dale Carnegie', 60000.00, 'Sách kỹ năng kinh điển, bản in đẹp.', NULL, 'TP.HCM', 'Quận 1', NULL, '0300100222', '2025-12-02 11:09:05.577692'),
(2, 'Nhà giả kim', 'Paulo Coelho', 75000.00, 'Một tiểu thuyết truyền cảm hứng.', 'http://localhost:8080/api/images/16088de5-9eae-4d11-8c2c-d48594f08a5d.jpg', 'Hà Nội', 'Cầu Giấy', NULL, '0300100222', NULL),
(3, 'Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 50000.00, 'Truyện thiếu nhi kinh điển.', 'http://localhost:8080/api/images/e5d34bb7-d814-4a67-b35d-c648534bb131.jpg', 'TP.HCM', 'Quận 3', NULL, '0300100222', NULL),
(4, 'Tôi thấy hoa vàng trên cỏ xanh', 'Nguyễn Nhật Ánh', 55000.00, 'Tác phẩm nổi tiếng của Nguyễn Nhật Ánh.', 'http://localhost:8080/api/images/d121b093-da44-443e-baf3-ca7ce066ea9b.jpg', 'Đà Nẵng', 'Hải Châu', NULL, '0300100222', NULL),
(5, 'Lập trình Java cơ bản', 'NXB CNTT', 120000.00, 'Giáo trình học Java cho sinh viên.', 'http://localhost:8080/api/images/983aa0f9-bda7-4154-adbf-26afeaa37a48.jpg', 'TP.HCM', 'Bình Thạnh', NULL, '0300100222', NULL),
(6, 'Lập trình Python nâng cao', 'NXB CNTT', 95000.00, 'Hướng dẫn lập trình Python chi tiết.', 'http://localhost:8080/api/images/8d9f1afb-9f5f-475d-a26b-88f0c9eda815.jpg', 'Hà Nội', 'Hai Bà Trưng', NULL, '0300100222', NULL),
(7, 'Cha giàu cha nghèo', 'Robert Kiyosaki', 65000.00, 'Sách tài chính kinh điển.', 'http://localhost:8080/api/images/09a2ad63-0727-48e9-a9ea-bbdbc3ee58e0.jpg', 'Cần Thơ', 'Ninh Kiều', NULL, '0300100222', NULL),
(8, '7 thói quen hiệu quả', 'Stephen R.Covey', 80000.00, 'Phát triển bản thân.', 'http://localhost:8080/api/images/3dc81451-c2a7-4114-a10a-5202eb05729d.jpg', 'TP.HCM', 'Quận 10', NULL, '0300100222', NULL),
(9, 'Sherlock Holmes Toàn Tập', 'Arthur Conan Doyle', 110000.00, 'Truyện trinh thám kinh điển.', NULL, 'Huế', 'Hương Thủy', NULL, '0300100222', NULL),
(10, 'Kinh tế học vĩ mô', 'Paul Samuelson', 130000.00, 'Giáo trình kinh tế.', NULL, 'Hà Nội', 'Ba Đình', NULL, '0300100222', NULL),
(11, '7 thoái quen hiệu quả', 'Tôi', 85000.00, 'L', 'http://localhost:8080/api/images/cd7f5fb3-446e-42ae-99af-0f2edeabadf0.jpg', 'TP.HCM', 'Quận 3', 'Củ 80%', '0328605555', '2025-12-03 13:31:14.126766'),
(12, 'Người quan trọng nhất là bản thân bạn', 'Hồ Trọng Bảo', 100000.00, 'Cuốn sách nói về kĩ năng sống. Vì mới nhận hàng chưa bóc siu muốn pass lại', 'http://localhost:8080/api/images/a6723956-56bb-463a-8c7c-6298b40026b2.png', 'TP.HCM', 'Quận 1', 'Mới', '0328605127', '2025-12-06 15:42:22.531547');


-- ===========================================
-- POSTS SAMPLE
-- ===========================================
INSERT INTO posts (postID, userID, bookID, description, status, created_at, updated_at) VALUES
(2,14,2,'Sách đẹp, đọc 1 lần','APPROVED',NULL,NULL),
(3,14,3,'Sách thiếu nhi phù hợp học sinh','APPROVED',NULL,NULL),
(4,14,4,'Còn mới 85%','APPROVED',NULL,'2025-12-03 09:08:58'),
(5,14,5,'Giáo trình cho sinh viên','APPROVED',NULL,NULL),
(6,14,6,'Dùng học Python rất tốt','APPROVED',NULL,NULL),
(7,14,7,'Bán lại giá tốt','APPROVED',NULL,NULL),
(8,14,8,'Sách kỹ năng còn mới','APPROVED',NULL,NULL),
(9,14,9,'Manga sưu tầm','APPROVED',NULL,NULL),
(10,14,10,'Bản đọc nhiều lần','PENDING',NULL,NULL),
(11,14,11,'Sách dày, trinh thám hấp dẫn','APPROVED',NULL,NULL),
(12,14,12,'Giáo trình kinh tế như mới','APPROVED',NULL,NULL)
;

-- ===========================================
-- BOOK CATEGORY SAMPLE
-- ===========================================
INSERT INTO book_category (bookID, categoryID) VALUES
(4,1),
(2,2),
(9,2),
(1,3),
(8,3),
(5,4),
(6,4),
(7,5),
(10,5),
(3,6);

-- ===========================================
-- REPORT SAMPLE
-- ===========================================
INSERT INTO report (reportID, postID, adminID, reason, status, report_date) VALUES
(1,10,1,'Nội dung mập mờ, cần kiểm tra','OPEN',NULL),
(2,4,1,'Tình trạng sách không đúng mô tả','RESOLVED',NULL);
