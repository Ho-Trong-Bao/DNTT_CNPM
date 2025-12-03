-- ===========================================
-- spring.datasource.url=jdbc:mysql://localhost:3306/sachcu_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
-- spring.datasource.username=root
-- spring.datasource.password=123456
-- spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
-- ===========================================
DROP DATABASE IF EXISTS sachcu_db;
CREATE DATABASE sachcu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sachcu_db;

-- ===========================================
-- BẢNG USER
-- ===========================================
CREATE TABLE user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    province VARCHAR(50),
    district VARCHAR(50),
    ward VARCHAR(50),
    status ENUM('PENDING','ACTIVE','SUSPENDED','BANNED','DELETED') DEFAULT 'ACTIVE',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG ADMIN
-- ===========================================
CREATE TABLE admin (
    adminID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- BẢNG CATEGORY
-- ===========================================
CREATE TABLE category (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100) UNIQUE NOT NULL
);

-- ===========================================
-- BẢNG BOOK
-- ===========================================
CREATE TABLE book (
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

-- ===========================================
-- BẢNG POSTS
-- ===========================================
CREATE TABLE posts (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    bookID INT NOT NULL UNIQUE,
    description TEXT,
    status ENUM('APPROVED','PENDING','DECLINED','SOLD') DEFAULT 'PENDING',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES user(userID) ON DELETE CASCADE,
    FOREIGN KEY (bookID) REFERENCES book(bookID) ON DELETE CASCADE
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
    reportDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('OPEN','RESOLVED','DISMISSED') DEFAULT 'OPEN',
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE,
    FOREIGN KEY (adminID) REFERENCES admin(adminID) ON DELETE SET NULL
);

-- ===========================================
-- CATEGORY SAMPLE DATA
-- ===========================================
INSERT INTO category (categoryName) VALUES
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
-- ADMIN DEFAULT
-- Password: admin123
-- ===========================================
SET NAMES utf8mb4;

INSERT INTO `admin` (`adminID`, `name`, `email`, `password`, `createdAt`, `created_at`) VALUES
(1,	'Quản trị viên',	'admin@sachcu.vn',	'$2a$12$lKGQzsHyOLBhzUarV2OVm.jinv3lKI45N5yx.JRRAKtH.psnnHZNS',	'2025-12-01 16:16:50',	NULL);


-- ===========================================
-- USER SAMPLE 
-- ===========================================
INSERT INTO `user` (`userID`, `name`, `email`, `password`, `phone`, `province`, `district`, `ward`, `status`, `createdAt`, `updatedAt`, `created_at`, `updated_at`) VALUES
(11,	'Test User',	'test@example.com',	'$2a$10$E35s03Qtut13vGQfMqwiauG4.fO4Vze8lWZL3vC3kvTJ7Aldxbzxq',	NULL,	NULL,	NULL,	NULL,	'ACTIVE',	'2025-12-01 16:22:08',	'2025-12-01 16:22:08',	'2025-12-01 16:22:08.816446',	'2025-12-01 16:22:08.816446'),
(12,	'User',	'user@example.com',	'$2a$12$lKGQzsHyOLBhzUarV2OVm.jinv3lKI45N5yx.JRRAKtH.psnnHZNS',	NULL,	NULL,	NULL,	NULL,	'ACTIVE',	'2025-12-02 11:00:56',	'2025-12-03 04:41:13',	'2025-12-02 11:00:56.168434',	'2025-12-02 11:00:56.168434'),
(13,	'Nguyễn Văn Test',	'test@gmail.com',	'$2a$10$B.vBwfDe5AdGfQ2mA5KpTeriWsP.biwqLGwjiqNZpwpdxYX18y3I.',	'0909999999',	'TP.HCM',	'Quận 1',	'Bến Nghé',	'ACTIVE',	'2025-12-03 04:04:53',	'2025-12-03 04:04:53',	'2025-12-03 04:04:52.998102',	'2025-12-03 04:04:52.998102'),
(14,	'Nguyễn Vũng Tàu',	'vungtau@gmail.com',	'$2a$10$Xxjtyx8rdh2dFc3HC7lf3uH8Eczegu5BwoOgugQGsYnxfEqQJgAhO',	'0909999777',	'Vũng Tàu',	'Phường 10',	'Hà Đông',	'ACTIVE',	'2025-12-03 04:43:43',	'2025-12-03 04:43:43',	'2025-12-03 04:43:43.409431',	'2025-12-03 04:43:43.409431');

-- ===========================================
-- BOOK SAMPLE DATA (12 books)
-- ===========================================
INSERT INTO `book` (`bookID`, `title`, `author`, `bookCondition`, `price`, `description`, `image`, `contactInfo`, `province`, `district`, `createdAt`, `book_condition`, `contact_info`, `created_at`) VALUES
(1,	'Đắc nhân tâm',	'Dale Carnegie',	'Cũ (80%)',	60000.00,	'Sách kỹ năng kinh điển, bản in đẹp.',	NULL,	'0909123456',	'TP.HCM',	'Quận 1',	'2025-12-01 16:16:50',	NULL,	'2025-12-02 11:09:05.577692',	'2025-12-02 11:09:05.577692'),
(2,	'Nhà giả kim',	'Paulo Coelho',	'Cũ nhẹ (90%)',	75000.00,	'Một tiểu thuyết truyền cảm hứng.',	NULL,	'0967123456',	'Hà Nội',	'Cầu Giấy',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(3,	'Dế Mèn Phiêu Lưu Ký',	'Tô Hoài',	'Mới 98%',	50000.00,	'Truyện thiếu nhi kinh điển.',	NULL,	'0918123456',	'TP.HCM',	'Quận 3',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(4,	'Tôi thấy hoa vàng trên cỏ xanh',	'Nguyễn Nhật Ánh',	'Cũ 85%',	55000.00,	'Tác phẩm nổi tiếng của Nguyễn Nhật Ánh.',	NULL,	'0967123456',	'Đà Nẵng',	'Hải Châu',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(5,	'Lập trình Java cơ bản',	'NXB CNTT',	'Mới 99%',	120000.00,	'Giáo trình học Java cho sinh viên.',	NULL,	'0939123456',	'TP.HCM',	'Bình Thạnh',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(6,	'Lập trình Python nâng cao',	'NXB CNTT',	'Cũ 90%',	95000.00,	'Hướng dẫn lập trình Python chi tiết.',	NULL,	'0982123456',	'Hà Nội',	'Hai Bà Trưng',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(7,	'Cha giàu cha nghèo',	'Robert Kiyosaki',	'Cũ 80%',	65000.00,	'Sách tài chính kinh điển.',	NULL,	'0973123456',	'Cần Thơ',	'Ninh Kiều',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(8,	'7 thói quen hiệu quả',	'Stephen R.Covey',	'Mới 97%',	80000.00,	'Phát triển bản thân.',	NULL,	'0909123456',	'TP.HCM',	'Quận 10',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(9,	'One Piece Tập 1',	'Eiichiro Oda',	'Cũ nhẹ',	30000.00,	'Manga nổi tiếng.',	NULL,	'0922123456',	'Đồng Nai',	'Biên Hòa',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(10,	'Naruto Tập 55',	'Masashi Kishimoto',	'Cũ (70%)',	20000.00,	'Manga hành động.',	NULL,	'0912123456',	'Hải Phòng',	'Lê Chân',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(11,	'Sherlock Holmes Toàn Tập',	'Arthur Conan Doyle',	'Cũ',	110000.00,	'Truyện trinh thám kinh điển.',	NULL,	'0948123456',	'Huế',	'Hương Thủy',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(12,	'Kinh tế học vĩ mô',	'Paul Samuelson',	'Mới',	130000.00,	'Giáo trình kinh tế.',	NULL,	'0973123456',	'Hà Nội',	'Ba Đình',	'2025-12-01 16:16:50',	NULL,	NULL,	NULL),
(13,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:09:05',	'Mới',	'0909123456',	'2025-12-02 11:09:05.577692'),
(14,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:10:31',	'Mới',	'0909123456',	'2025-12-02 11:10:31.122953'),
(15,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:35:44',	'Mới',	'0909123456',	'2025-12-02 11:35:44.610186'),
(16,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:36:14',	'Mới',	'0909123456',	'2025-12-02 11:36:14.207604'),
(17,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:36:14',	'Mới',	'0909123456',	'2025-12-02 11:36:14.777204'),
(18,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:36:15',	'Mới',	'0909123456',	'2025-12-02 11:36:15.358340'),
(19,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:36:15',	'Mới',	'0909123456',	'2025-12-02 11:36:15.613613'),
(20,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:36:15',	'Mới',	'0909123456',	'2025-12-02 11:36:15.785568'),
(22,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	'https://cdn1.fahasa.com/media/catalog/product/d/n/dntttttuntitled.jpg',	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 11:41:49',	'Mới',	'0909123456',	'2025-12-02 11:41:49.576996'),
(23,	'Sách mới',	'Tác giả',	NULL,	100000.00,	NULL,	'https://cdn1.fahasa.com/media/catalog/product/d/n/dntttttuntitled.jpg',	NULL,	'TP.HCM',	'Quận 1',	'2025-12-02 15:10:56',	'Mới',	'0909123456',	'2025-12-02 15:10:56.259024');
-- 2025-12-03 05:07:11 UTC

-- ===========================================
-- POSTS SAMPLE
-- ===========================================
INSERT INTO posts (userID, bookID, description, status) VALUES
(1,1,'Bán rẻ vì không dùng nữa','APPROVED'),
(2,2,'Sách đẹp, đọc 1 lần','APPROVED'),
(3,3,'Sách thiếu nhi phù hợp học sinh','APPROVED'),
(4,4,'Còn mới 85%','PENDING'),
(5,5,'Giáo trình cho sinh viên','APPROVED'),
(6,6,'Dùng học Python rất tốt','APPROVED'),
(7,7,'Bán lại giá tốt','APPROVED'),
(8,8,'Sách kỹ năng còn mới','APPROVED'),
(9,9,'Manga sưu tầm','APPROVED'),
(10,10,'Bản đọc nhiều lần','PENDING'),
(3,11,'Sách dày, trinh thám hấp dẫn','APPROVED'),
(2,12,'Giáo trình kinh tế như mới','APPROVED');

-- ===========================================
-- BOOK CATEGORY SAMPLE
-- ===========================================
INSERT INTO book_category VALUES
(1,3),(2,2),(3,6),(4,1),(5,4),(6,4),(7,5),
(8,3),(9,7),(10,7),(11,2),(12,5);

-- ===========================================
-- REPORT SAMPLE
-- ===========================================
INSERT INTO report (postID, adminID, reason, status) VALUES
(10,1,'Nội dung mập mờ, cần kiểm tra','OPEN'),
(4,1,'Tình trạng sách không đúng mô tả','RESOLVED');
