# Test API hệ thống Sách Cũ

File này chứa các ví dụ test API bằng lệnh `curl` và chú thích chức năng bằng tiếng Việt.

---

## 1. Đăng ký tài khoản
Chức năng: Tạo tài khoản mới cho người dùng.
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
  }'
```

## 2. Đăng nhập
Chức năng: Đăng nhập, nhận về token xác thực.
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

## 3. Lấy danh sách sách
Chức năng: Lấy danh sách sách, có thể lọc theo tên, tỉnh, danh mục...
```bash
curl -X GET "http://localhost:8080/api/books?search=Java&province=TP.HCM&page=0&size=5"
```

## 4. Lấy chi tiết sách
Chức năng: Lấy thông tin chi tiết của một sách.
```bash
curl -X GET http://localhost:8080/api/books/1
```

## 5. Tạo sách mới
Chức năng: Thêm sách mới vào hệ thống.
```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sách mới",
    "author": "Tác giả",
    "price": 100000,
    "bookCondition": "Mới",
    "province": "TP.HCM",
    "district": "Quận 1",
    "contactInfo": "0909123456"
  }'
```

## 6. Lấy danh mục
Chức năng: Lấy tất cả danh mục sách.
```bash
curl -X GET http://localhost:8080/api/categories
```

## 7. Lấy thông tin user
Chức năng: Lấy thông tin user theo ID.
```bash
curl -X GET http://localhost:8080/api/users/1
```

## 8. Đổi mật khẩu
Chức năng: Đổi mật khẩu cho user.
```bash
curl -X POST http://localhost:8080/api/users/1/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "123456",
    "newPassword": "654321"
  }'
```

## 9. Tạo bài đăng mới
Chức năng: Đăng bán sách (cần truyền userID qua query param).
```bash
curl -X POST "http://localhost:8080/api/posts?userID=1" \
  -H "Content-Type: application/json" \
  -d '{
    "book": {
      "title": "Sách cần bán",
      "author": "Tác giả",
      "price": 50000,
      "bookCondition": "Cũ",
      "province": "TP.HCM",
      "district": "Quận 1",
      "contactInfo": "0909123456"
    },
    "description": "Sách còn mới, giá tốt"
  }'
```

## 10. Lấy bài đăng của user
Chức năng: Lấy tất cả bài đăng của một user.
```bash
curl -X GET "http://localhost:8080/api/posts/my-posts?userID=1"
```

---
Có thể bổ sung thêm các API khác nếu cần test.