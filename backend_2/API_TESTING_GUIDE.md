# Hướng dẫn Test API - Sách Cũ Theo Khu Vực

## 1. Chuẩn bị

### Chạy database:
- Import file `init-db.sql` vào MySQL
- Database name: `sachcu_db`
- Username: `root`
- Password: `123456`

### Chạy backend:
```bash
mvn spring-boot:run
```

API Base URL: `http://localhost:8080/api`

## 2. Test Authentication APIs

### 2.1 Đăng ký User
```
POST /auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn Test",
  "email": "test@gmail.com",
  "password": "123456",
  "phone": "0909999999",
  "province": "TP.HCM",
  "district": "Quận 1",
  "ward": "Bến Nghé"
}
```

### 2.2 Đăng nhập User
```
POST /auth/login
Content-Type: application/json

{
  "email": "vana@gmail.com",
  "password": "123456"
}
```

**Response:** Lưu lại `token` để sử dụng cho các API khác

### 2.3 Đăng nhập Admin
```
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@sachcu.vn",
  "password": "admin123"
}
```

## 3. Test Book APIs (Public - không cần token)

### 3.1 Lấy tất cả sách
```
GET /books
```

### 3.2 Xem chi tiết sách (Guest - ẩn contact)
```
GET /books/1
```

### 3.3 Xem chi tiết sách (User đã login - hiện contact)
```
GET /books/1
Authorization: Bearer {token}
```

### 3.4 Tìm kiếm sách
```
GET /books/search?title=Python&province=TP.HCM
GET /books/search?author=Dale
GET /books/province/TP.HCM
```

## 4. Test Post APIs (Cần đăng nhập)

### 4.1 Đăng bài bán sách
```
POST /posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Sách Test API",
  "author": "Tác giả Test",
  "bookCondition": "Mới 99%",
  "price": 85000,
  "postDescription": "Đây là sách test API",
  "image": "https://example.com/image.jpg",
  "contactInfo": "0909123456",
  "categoryID": 4,
  "province": "TP.HCM",
  "district": "Quận 3"
}
```

### 4.2 Xem bài đăng của User
```
GET /users/1/posts
Authorization: Bearer {token}
```

### 4.3 Sửa bài đăng
```
PUT /posts/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Sách Test API Updated",
  "price": 90000
}
```

### 4.4 Xóa bài đăng
```
DELETE /posts/1
Authorization: Bearer {token}
```

## 5. Test User APIs

### 5.1 Xem thông tin User
```
GET /users/1
Authorization: Bearer {token}
```

### 5.2 Cập nhật thông tin User
```
PUT /users/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nguyễn Văn A Updated",
  "phone": "0909888888",
  "province": "Hà Nội"
}
```

### 5.3 Đổi mật khẩu
```
POST /users/1/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

## 6. Test Category APIs

### 6.1 Lấy tất cả danh mục (Public)
```
GET /categories
```

### 6.2 Thêm danh mục (Admin)
```
POST /admin/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "categoryName": "Khoa học viễn tưởng"
}
```

## 7. Test Admin APIs

### 7.1 Lấy tất cả bài đăng
```
GET /admin/posts
Authorization: Bearer {admin_token}
```

### 7.2 Lấy bài đăng theo trạng thái
```
GET /admin/posts/status/PENDING
Authorization: Bearer {admin_token}
```

### 7.3 Duyệt bài đăng
```
PUT /admin/posts/4/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "APPROVED"
}
```

### 7.4 Lấy danh sách User
```
GET /admin/users
Authorization: Bearer {admin_token}
```

### 7.5 Cập nhật trạng thái User
```
PUT /admin/users/2/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "SUSPENDED"
}
```

## 8. Lưu ý quan trọng

1. **Token hết hạn sau 24 giờ** - cần đăng nhập lại
2. **Guest** (không token): Chỉ xem được sách, ẨN thông tin liên hệ
3. **User** (có token): Xem đầy đủ thông tin, đăng bài, sửa/xóa bài của mình
4. **Admin** (admin token): Quản lý toàn bộ hệ thống

## 9. Test bằng Postman

1. Import collection từ file `Sachcu_API.postman_collection.json`
2. Set environment variable `base_url` = `http://localhost:8080/api`
3. Set environment variable `token` sau khi đăng nhập
4. Run collection để test tất cả APIs