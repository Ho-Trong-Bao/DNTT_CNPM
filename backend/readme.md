🎯 HƯỚNG DẪN CHẠY BACKEND
Bước 1: Tạo cấu trúc thư mục


mkdir -p backend/src/main/java/com/sachcu/{config,controller,dto,model,repository,service}
mkdir -p backend/src/main/resources
mkdir -p backend/src/test/java


Bước 2: Tạo database MySQL




Bước 3: Cấu hình application.properties

Sửa password MySQL trong file application.properties

spring.datasource.password=your_mysql_password_here

Bước 4: Build và Run
cd backend

# Build project
mvn clean install

# Run application
mvn spring-boot:run

Hoặc dùng IDE (IntelliJ IDEA / Eclipse):

Import project as Maven project

Chạy file SachCuApplication.java




Bước 5: Kiểm tra API
# Test đăng ký
curl -X POST http://localhost:8080/api/auth/register 
-H "Content-Type: application/json" \
-d '{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}'

# Test lấy danh sách sách
curl http://localhost:8080/api/books


📋 DANH SÁCH ENDPOINTS API
Auth APIs

POST /api/auth/register - Đăng ký
POST /api/auth/login - Đăng nhập

Book APIs

GET  - Tìm kiếm sách (có filter)
GET /api/books/{id} - Chi tiết sách
GET /api/books/featured - Sách nổi bật
POST /api/books - Tạo sách mới
PUT /api/books/{id} - Cập nhật sách
DELETE /api/books/{id} - Xóa sách

Post APIs

GET /api/posts/my-posts?userID={id} - Bài đăng của tôi
GET /api/posts/{id} - Chi tiết bài đăng
POST /api/posts?userID={id} - Tạo bài đăng
PUT /api/posts/{id} - Cập nhật bài đăng
DELETE /api/posts/{id} - Xóa bài đăng
PUT /api/posts/{id}/approve - Duyệt bài (Admin)
PUT /api/posts/{id}/decline - Từ chối bài (Admin)

User APIs

GET /api/users/{id} - Thông tin user
PUT /api/users/{id} - Cập nhật user
POST /api/users/{id}/change-password - Đổi mật khẩu

Category APIs

GET /api/categories - Danh sách thể loại
GET /api/categories/{id} - Chi tiết thể loại
