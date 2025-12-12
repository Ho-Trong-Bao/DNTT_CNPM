SET NAMES utf8mb4;

INSERT INTO `book` (`bookID`, `title`, `author`, `price`, `description`, `image`, `province`, `district`, `book_condition`, `contact_info`, `created_at`) VALUES
(1,	'Đắc nhân tâm',	'Dale Carnegie',	60000.00,	'Sách kỹ năng kinh điển, bản in đẹp.',	NULL,	'4',	'42',	'Củ 80%',	'0300100222',	'2025-12-02 11:09:05.577692'),
(2,	'Nhà giả kim',	'Nguyễn Nhật Ánh',	75000.00,	'Sách đẹp, đọc 1 lần',	'http://localhost:8080/api/images/16088de5-9eae-4d11-8c2c-d48594f08a5d.jpg',	'4',	'42',	'Mới',	'0300100222',	'2025-12-03 13:31:14.126766'),
(4,	'Tôi thấy hoa vàng trên cỏ xanh',	'Nguyễn Nhật Ánh',	55000.00,	'Còn mới 85%',	'http://localhost:8080/api/images/d121b093-da44-443e-baf3-ca7ce066ea9b.jpg',	'4',	'42',	'Cũ nhẹ (90%)',	'0300100222',	'2025-12-03 13:31:14.126766'),
(6,	'Lập trình Python nâng cao',	'NXB CNTT',	95000.00,	'Hướng dẫn lập trình Python chi tiết.',	'http://localhost:8080/api/images/8d9f1afb-9f5f-475d-a26b-88f0c9eda815.jpg',	'4',	'42',	'Củ 80%',	'0300100222',	'2025-12-03 13:31:14.126766'),
(7,	'Cha giàu cha nghèo',	'Robert Kiyosaki',	65000.00,	'Sách tài chính kinh điển.',	'http://localhost:8080/api/images/09a2ad63-0727-48e9-a9ea-bbdbc3ee58e0.jpg',	'4',	'42',	'Củ 80%',	'0300100222',	'2025-12-03 13:31:14.126766'),
(8,	'7 thói quen hiệu quả',	'Stephen R.Covey',	80000.00,	'Phát triển bản thân.',	'http://localhost:8080/api/images/3dc81451-c2a7-4114-a10a-5202eb05729d.jpg',	'4',	'42',	'Củ 80%',	'0300100222',	'2025-12-03 13:31:14.126766'),
(29,	'7 thoái quen hiệu quả',	'Tôi',	85000.00,	'L',	'http://localhost:8080/api/images/cd7f5fb3-446e-42ae-99af-0f2edeabadf0.jpg',	'4',	'42',	'Củ 80%',	'0328605555',	'2025-12-03 13:31:14.126766'),
(34,	'Người quan trọng nhất là bản thân bạn',	'Hồ Trọng Bảo',	100000.00,	'Cuốn sách nói về kĩ năng sống. Vì mới nhận hàng chưa bóc siu muốn pass lại',	'http://localhost:8080/api/images/a6723956-56bb-463a-8c7c-6298b40026b2.png',	'4',	'42',	'Mới',	'0328605127',	'2025-12-06 15:42:22.531547'),
(36,	'Bình Ngô Đại Cáo',	'Phương Anh',	1000000.00,	'Là 1 kỳ án của Việt Nam',	'http://localhost:8080/api/images/dc8101b5-faec-4548-9465-fdbb0a2faa06.jpg',	'4',	'42',	'Cũ nhẹ (90%)',	'0328605127',	'2025-12-10 11:48:37.971791');
-- 2025-12-12 13:03:50 UTC

SET NAMES utf8mb4;

INSERT INTO `posts` (`postID`, `userID`, `bookID`, `description`, `status`, `created_at`, `updated_at`) VALUES
(2,	14,	2,	'Sách đẹp, đọc 1 lần',	'APPROVED',	'2025-12-03 13:31:14.126766',	NULL),
(4,	14,	4,	'Còn mới 85%',	'APPROVED',	'2025-12-03 13:31:14.126766',	'2025-12-03 13:31:14.126766'),
(6,	14,	6,	'Dùng học Python rất tốt',	'APPROVED',	'2025-12-03 13:31:14.126766',	NULL),
(7,	14,	7,	'Bán lại giá tốt',	'APPROVED',	'2025-12-03 13:31:14.126766',	NULL),
(8,	14,	8,	'Sách kỹ năng còn mới',	'APPROVED',	'2025-12-03 13:31:14.126766',	'2025-12-03 13:31:14.126766'),
(25,	18,	36,	'Là 1 kỳ án của Việt Nam',	'APPROVED',	'2025-12-10 11:48:38.022220',	'2025-12-12 04:06:20.320846');
-- 2025-12-12 13:04:37 UTC

SET NAMES utf8mb4;

INSERT INTO `user` (`userID`, `name`, `email`, `password`, `phone`, `province`, `district`, `ward`, `status`, `created_at`, `updated_at`) VALUES
(13,	'Nguyễn Văn Test',	'test@gmail.com',	'$2a$10$B.vBwfDe5AdGfQ2mA5KpTeriWsP.biwqLGwjiqNZpwpdxYX18y3I.',	'0909999999',	'79',	'761',	'26776',	'ACTIVE',	'2025-12-03 04:04:52.998102',	'2025-12-03 04:04:52.998102'),
(14,	'Hồ Trọng Bảo',	'vungtau@gmail.com',	'$2a$10$v2XgrkmVbQ8pPn2MevXljeJ07p5ZD9A4v8qqelMaDdzlHrieSUYpm',	'0909888888',	'79',	'761',	'26776',	'ACTIVE',	'2025-12-03 04:43:43.409431',	'2025-12-12 09:08:18.261077'),
(15,	'Huy',	'huy@gmail.com',	'$2a$10$zql/pzUBgaDyyoQYu.QB5uzQyFzdjj4vMoonBXtOHlPOOlaq5Jsh.',	'0328605555',	'79',	'761',	'26776',	'ACTIVE',	'2025-12-03 13:23:32.477215',	'2025-12-06 06:19:53.927825'),
(16,	'Huy',	'Hoang@gmail.com',	'$2a$10$x1u8HtXE8ROVR4tfduhu8.Kf0stGA6IOBmyZe0sQOjZog6n/4RM1.',	'0328605555',	'79',	'761',	'26776',	'ACTIVE',	'2025-12-06 05:36:29.761204',	'2025-12-06 05:36:29.761204'),
(17,	'Bao',	'baocodon@gmail.com',	'$2a$10$m4j/WAnwzVwEfp/8vkK9HOX9gEEl6O/M5aSBPMQ23rJLh.SFcjI3W',	'0000001298',	'79',	'761',	'26776',	'ACTIVE',	'2025-12-06 07:08:40.839113',	'2025-12-06 07:08:40.839113'),
(18,	'Nguyễn Văn A',	'vana@gmail.com',	'$2a$10$69B4wDtNa2jVv/90oxbhUObGYfEgnZSSG7k0aKm.deYMyvkmo1Pa6',	'0333564566',	'79',	'761',	'26776',	'ACTIVE',	'2025-12-10 11:19:11.973839',	'2025-12-10 11:19:11.973839'),
(19,	'Trân Thành',	'tranthanh@gmail.com',	'$2a$10$k1nz3mYZwlhV3NJFu7fOXuwSyQ./lyQHbDonDUIp5uR0yNRaOB6k2',	'0328605113',	'96',	'967',	'32077',	'ACTIVE',	'2025-12-12 08:28:48.005674',	'2025-12-12 08:28:48.007178'),
(20,	'Nhật Doan',	'nhatdoan@gmail.com',	'$2a$10$k1nz3mYZwlhV3NJFu7fOXuwSyQ./lyQHbDonDUIp5uR0yNRaOB6k2',	'0908070666',	'79',	'761',	'26776',	'ACTIVE',	'2025-12-12 09:04:56.483508',	'2025-12-12 09:04:56.483508');
-- 2025-12-12 13:04:49 UTC