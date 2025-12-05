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
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('OPEN','RESOLVED','DISMISSED') DEFAULT 'OPEN',
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE,
    FOREIGN KEY (adminID) REFERENCES admin(adminID) ON DELETE SET NULL
);

-- ===========================================
-- CATEGORY SAMPLE DATA
-- ===========================================
INSERT INTO `category` (`categoryID`, `category_name`) VALUES
(1,	'Văn học Việt Nam'),
(2,	'Văn học nước ngoài'),
(3,	'Kỹ năng sống'),
(4,	'Tin học'),
(5,	'Kinh tế'),
(6,	'Thiếu nhi'),
(7,	'Truyện tranh - Manga'),
(8,	'Giáo trình đại học'),
(9,	'Tâm lý - Triết học'),
(10,	'Light Novel');

-- ===========================================
-- ADMIN DEFAULT
-- Password: admin123
-- ===========================================

INSERT INTO `admin` (`adminID`, `name`, `email`, `password`, `created_at`) VALUES
(1,	'Quản trị viên',	'admin@sachcu.vn',	'$2a$12$lKGQzsHyOLBhzUarV2OVm.jinv3lKI45N5yx.JRRAKtH.psnnHZNS',	'2025-12-01 16:16:50',	NULL);


-- ===========================================
-- USER SAMPLE 
-- ===========================================
INSERT INTO `user` (`userID`, `name`, `email`, `password`, `phone`, `province`, `district`, `ward`, `status`, `created_at`, `updated_at`) VALUES
(1,	'Nguyễn Văn A',	'vana@gmail.com',	'123456',	'0909123456',	'TP.HCM',	'Quận 1',	'Bến Nghé',	'ACTIVE',	NULL,	'2025-12-03 10:47:52.442444'),
(2,	'Trần Thị B',	'thib@gmail.com',	'123456',	'0918123456',	'TP.HCM',	'Quận 3',	'Phường 5',	'ACTIVE',	NULL,	'2025-12-03 10:48:20.165318'),
(3,	'Lê Minh C',	'minhc@gmail.com',	'123456',	'0935123456',	'Hà Nội',	'Cầu Giấy',	'Dịch Vọng',	'SUSPENDED',	NULL,	'2025-12-03 10:39:31.590073'),
(4,	'Phạm Duy D',	'duyd@gmail.com',	'123456',	'0967123456',	'Đà Nẵng',	'Hải Châu',	'Thuận Phước',	'ACTIVE',	NULL,	NULL),
(5,	'Đặng Quỳnh E',	'quynhe@gmail.com',	'123456',	'0973123456',	'Cần Thơ',	'Ninh Kiều',	'An Bình',	'ACTIVE',	NULL,	NULL),
(6,	'Nguyễn Hoàng F',	'hoangf@gmail.com',	'123456',	'0982123456',	'Hà Nội',	'Ba Đình',	'Điện Biên',	'ACTIVE',	NULL,	NULL),
(7,	'Trương Mỹ G',	'myg@gmail.com',	'123456',	'0912123456',	'TP.HCM',	'Bình Thạnh',	'Phường 25',	'ACTIVE',	NULL,	NULL),
(8,	'Lý Quốc H',	'quoch@gmail.com',	'123456',	'0939123456',	'Đồng Nai',	'Biên Hòa',	'Tân Hiệp',	'ACTIVE',	NULL,	NULL),
(9,	'Cao Kim I',	'kimi@gmail.com',	'123456',	'0922123456',	'Hải Phòng',	'Lê Chân',	'An Biên',	'ACTIVE',	NULL,	NULL),
(10,	'Hoàng Nhật K',	'nhatk@gmail.com',	'123456',	'0948123456',	'Huế',	'Hương Thủy',	'Thủy Phương',	'ACTIVE',	NULL,	NULL),
(11,	'Test User',	'test@example.com',	'$2a$10$E35s03Qtut13vGQfMqwiauG4.fO4Vze8lWZL3vC3kvTJ7Aldxbzxq',	NULL,	NULL,	NULL,	NULL,	'ACTIVE',	'2025-12-01 16:22:08.816446',	'2025-12-01 16:22:08.816446'),
(12,	'User',	'user@example.com',	'$2a$12$lKGQzsHyOLBhzUarV2OVm.jinv3lKI45N5yx.JRRAKtH.psnnHZNS',	NULL,	NULL,	NULL,	NULL,	'ACTIVE',	'2025-12-02 11:00:56.168434',	'2025-12-02 11:00:56.168434'),
(13,	'Nguyễn Văn Test',	'test@gmail.com',	'$2a$10$B.vBwfDe5AdGfQ2mA5KpTeriWsP.biwqLGwjiqNZpwpdxYX18y3I.',	'0909999999',	'TP.HCM',	'Quận 1',	'Bến Nghé',	'ACTIVE',	'2025-12-03 04:04:52.998102',	'2025-12-03 04:04:52.998102'),
(14,	'Hồ Trọng Bảo',	'vungtau@gmail.com',	'$2a$10$v2XgrkmVbQ8pPn2MevXljeJ07p5ZD9A4v8qqelMaDdzlHrieSUYpm',	'0909888888',	'Cà Mau',	'Phường 10',	'Hà Đông',	'ACTIVE',	'2025-12-03 04:43:43.409431',	'2025-12-03 13:01:21.878348'),
(15,	'Huy',	'huy@gmail.com',	'$2a$10$jw1t9YAg9fTbHb9KPnG0o.RMIpApJmr8iWGYbJD/.2R5N6Xo/heZG',	'0328605555',	'Hà Nội',	'Quận 1',	'Bến Nghé',	'ACTIVE',	'2025-12-03 13:23:32.477215',	'2025-12-03 13:23:32.477215');

-- ===========================================
-- BOOK SAMPLE DATA (12 books)
-- ===========================================
INSERT INTO `book` (`bookID`, `title`, `author`, `price`, `description`, `image`, `province`, `district`, `book_condition`, `contact_info`, `created_at`) VALUES
(1,	'Đắc nhân tâm',	'Dale Carnegie',	60000.00,	'Sách kỹ năng kinh điển, bản in đẹp.',	NULL,	'TP.HCM',	'Quận 1',	NULL,	'2025-12-02 11:09:05.577692',	'2025-12-02 11:09:05.577692'),
(2,	'Nhà giả kim',	'Paulo Coelho',	75000.00,	'Một tiểu thuyết truyền cảm hứng.',	NULL,	'Hà Nội',	'Cầu Giấy',	NULL,	NULL,	NULL),
(3,	'Dế Mèn Phiêu Lưu Ký',	'Tô Hoài',	50000.00,	'Truyện thiếu nhi kinh điển.',	NULL,	'TP.HCM',	'Quận 3',	NULL,	NULL,	NULL),
(4,	'Tôi thấy hoa vàng trên cỏ xanh',	'Nguyễn Nhật Ánh',	55000.00,	'Tác phẩm nổi tiếng của Nguyễn Nhật Ánh.',	NULL,	'Đà Nẵng',	'Hải Châu',	NULL,	NULL,	NULL),
(5,	'Lập trình Java cơ bản',	'NXB CNTT',	120000.00,	'Giáo trình học Java cho sinh viên.',	NULL,	'TP.HCM',	'Bình Thạnh',	NULL,	NULL,	NULL),
(6,	'Lập trình Python nâng cao',	'NXB CNTT',	95000.00,	'Hướng dẫn lập trình Python chi tiết.',	NULL,	'Hà Nội',	'Hai Bà Trưng',	NULL,	NULL,	NULL),
(7,	'Cha giàu cha nghèo',	'Robert Kiyosaki',	65000.00,	'Sách tài chính kinh điển.',	NULL,	'Cần Thơ',	'Ninh Kiều',	NULL,	NULL,	NULL),
(8,	'7 thói quen hiệu quả',	'Stephen R.Covey',	80000.00,	'Phát triển bản thân.',	NULL,	'TP.HCM',	'Quận 10',	NULL,	NULL,	NULL),
(9,	'One Piece Tập 1',	'Eiichiro Oda',	30000.00,	'Manga nổi tiếng.',	NULL,	'Đồng Nai',	'Biên Hòa',	NULL,	NULL,	NULL),
(10,	'Naruto Tập 55',	'Masashi Kishimoto',	20000.00,	'Manga hành động.',	NULL,	'Hải Phòng',	'Lê Chân',	NULL,	NULL,	NULL),
(11,	'Sherlock Holmes Toàn Tập',	'Arthur Conan Doyle',	110000.00,	'Truyện trinh thám kinh điển.',	NULL,	'Huế',	'Hương Thủy',	NULL,	NULL,	NULL),
(12,	'Kinh tế học vĩ mô',	'Paul Samuelson',	130000.00,	'Giáo trình kinh tế.',	NULL,	'Hà Nội',	'Ba Đình',	NULL,	NULL,	NULL),
(13,	'Sách mới',	'Tác giả',	100000.00,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:09:05.577692'),
(14,	'Sách mới',	'Tác giả',	100000.00,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:10:31.122953'),
(15,	'Sách mới',	'Tác giả',	100000.00,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:35:44.610186'),
(16,	'Sách mới',	'Tác giả',	100000.00,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:36:14.207604'),
(17,	'Sách mới',	'Tác giả',	100000.00,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:36:14.777204'),
(18,	'Sách mới',	'Tác giả',	100000.00,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:36:15.358340'),
(19,	'Sách mới',	'Tác giả',	100000.00,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:36:15.613613'),
(20,	'Sách mới',	'Tác giả',	100000.00,	NULL,	NULL,	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:36:15.785568'),
(21,	'Sách mới',	'Tác giả',	100000.00,	NULL,	'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fahasa.com%2Fdac-nhan-tam-tai-ban-2021.html&psig=AOvVaw2ezzepBHrJLO-XXLkh0uv9&ust=1764761824660000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCODhjJ_onpEDFQAAAAAdAAAAABAE',	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:37:34.799750'),
(22,	'Sách mới',	'Tác giả',	100000.00,	NULL,	'https://cdn1.fahasa.com/media/catalog/product/d/n/dntttttuntitled.jpg',	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 11:41:49.576996'),
(23,	'Sách mới',	'Tác giả',	100000.00,	NULL,	'https://cdn1.fahasa.com/media/catalog/product/d/n/dntttttuntitled.jpg',	'TP.HCM',	'Quận 1',	'Mới',	'0909123456',	'2025-12-02 15:10:56.259024'),
(24,	'Sách Test API',	'Tác giả Test',	85000.00,	'Đây là sách test API',	'https://images.nhaxuatbanhongduc.com.vn/Picture/2023/6/12/image-20230612152556154.jpg',	'TP.HCM',	'Quận 3',	'Mới 99%',	'0909123456',	'2025-12-03 05:45:49.903537'),
(25,	'Sách Test API',	'Tác giả Test',	85000.00,	'Đây là sách test API',	'https://images.nhaxuatbanhongduc.com.vn/Picture/2023/6/12/image-20230612152556154.jpg',	'TP.HCM',	'Quận 3',	'Mới 99%',	'0909123456',	'2025-12-03 05:47:49.738531'),
(26,	'Sách Test API',	'Tác giả Test',	85000.00,	'Đây là sách test API',	'https://example.com/image.jpg',	'TP.HCM',	'Quận 3',	'Mới 99%',	'0909123456',	'2025-12-03 09:45:57.650959'),
(27,	'Sách Test API',	'Tác giả Test',	85000.00,	'Đây là sách test API',	'https://example.com/image.jpg',	'TP.HCM',	'Quận 3',	'Mới 99%',	'0909123456',	'2025-12-03 12:18:59.588646'),
(28,	'7 thoái quen hiệu quả',	'Tôi',	85000.00,	'Đây là sách test API',	'https://example.com/image.jpg',	'TP.HCM',	'Quận 3',	'Củ 80%',	'0328605555',	'2025-12-03 12:45:04.582851'),
(29,	'7 thoái quen hiệu quả',	'Tôi',	85000.00,	'L',	'https://example.com/image.jpg',	'TP.HCM',	'Quận 3',	'Củ 80%',	'0328605555',	'2025-12-03 13:31:14.126766');
-- 2025-12-03 05:07:11 UTC

-- ===========================================
-- POSTS SAMPLE
-- ===========================================
INSERT INTO `posts` (`postID`, `userID`, `bookID`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1,	1,	22,	'Bán rẻ vì không dùng nữa',	'APPROVED',	NULL,	NULL),
(2,	2,	2,	'Sách đẹp, đọc 1 lần',	'APPROVED',	NULL,	NULL),
(3,	3,	3,	'Sách thiếu nhi phù hợp học sinh',	'APPROVED',	NULL,	NULL),
(4,	4,	4,	'Còn mới 85%',	'APPROVED',	NULL,	'2025-12-03 09:08:58.774695'),
(5,	5,	5,	'Giáo trình cho sinh viên',	'APPROVED',	NULL,	NULL),
(6,	6,	6,	'Dùng học Python rất tốt',	'APPROVED',	NULL,	NULL),
(7,	7,	7,	'Bán lại giá tốt',	'APPROVED',	NULL,	NULL),
(8,	8,	8,	'Sách kỹ năng còn mới',	'APPROVED',	NULL,	NULL),
(9,	9,	9,	'Manga sưu tầm',	'APPROVED',	NULL,	NULL),
(10,	10,	10,	'Bản đọc nhiều lần',	'PENDING',	NULL,	NULL),
(11,	3,	11,	'Sách dày, trinh thám hấp dẫn',	'APPROVED',	NULL,	NULL),
(12,	13,	12,	'Giáo trình kinh tế như mới',	'APPROVED',	NULL,	NULL),
(13,	14,	24,	'Đây là sách test API',	'PENDING',	'2025-12-03 05:45:49.921593',	'2025-12-03 05:45:49.921593'),
(14,	14,	25,	'Đây là sách test API',	'PENDING',	'2025-12-03 05:47:49.742484',	'2025-12-03 05:47:49.742484'),
(15,	14,	26,	'Đây là sách test API',	'PENDING',	'2025-12-03 09:45:57.669316',	'2025-12-03 09:45:57.669316'),
(16,	14,	27,	'Đây là sách test API',	'PENDING',	'2025-12-03 12:18:59.606217',	'2025-12-03 12:18:59.606217'),
(17,	14,	28,	'Đây là sách test API',	'APPROVED',	'2025-12-03 12:45:04.591293',	'2025-12-03 12:47:58.008612'),
(18,	14,	29,	'L',	'PENDING',	'2025-12-03 13:31:14.131091',	'2025-12-03 13:31:14.131091');

-- ===========================================
-- BOOK CATEGORY SAMPLE
-- ===========================================
INSERT INTO `book_category` (`bookID`, `categoryID`) VALUES
(4,	1),
(2,	2),
(11,	2),
(1,	3),
(8,	3),
(5,	4),
(6,	4),
(24,	4),
(25,	4),
(26,	4),
(27,	4),
(7,	5),
(12,	5),
(3,	6),
(9,	7),
(10,	7);

-- ===========================================
-- REPORT SAMPLE
-- ===========================================
INSERT INTO `report` (`reportID`, `postID`, `adminID`, `reason`, `status`, `report_date`) VALUES
(1,	10,	1,	'Nội dung mập mờ, cần kiểm tra',	'OPEN',	NULL),
(2,	4,	1,	'Tình trạng sách không đúng mô tả',	'RESOLVED',	NULL);
