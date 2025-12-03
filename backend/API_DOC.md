# Tài liệu API hệ thống Sách Cũ

## 1. Đăng ký tài khoản
- **URL:** `/api/auth/register`
- **Phương thức:** POST
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "message": "Đăng ký thành công!",
  "success": true
}
```

## 2. Đăng nhập
- **URL:** `/api/auth/login`
- **Phương thức:** POST
- **Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzY0Njc2NDYzLCJleHAiOjE3NjQ3NjI4NjN9.u6UgMzk3MPFmb7KjZGMbJPu7qTiHfbFFt7e3ASk4xOwTAVBqKfi0ytv9nD1EIFgsGYVIK0aea5x7GqdmWB-LFQ",
  "type": "Bearer",
  "userId": 11,
  "email": "test@example.com",
  "name": "Test User"
}
```

## 3. Lấy danh sách sách
- **URL:** `/api/books`
- **Phương thức:** GET
- **Query Params:**
  - `search`, `province`, `categoryID`, `minPrice`, `maxPrice`, `page`, `size`, `sortBy`, `sortDir`
- **Response:**
```json
{
  "content": [
    {
      "bookID": 1,
      "title": "string",
      "author": "string",
      "price": 100000,
      ...
    }
  ],
  "totalElements": 12,
  "totalPages": 2,
  "number": 0
}
```

## 4. Lấy chi tiết sách
- **URL:** `/api/books/{id}`
- **Phương thức:** GET
- **Response:**
```json
{
  "bookID": 1,
  "title": "string",
  "author": "string",
  "price": 100000,
  ...
}
```

## 5. Tạo sách mới
- **URL:** `/api/books`
- **Phương thức:** POST
- **Request Body:**
```json
{
  "title": "string",
  "author": "string",
  "price": 100000,
  ...
}
```
- **Response:**
```json
{
  "bookID": 1,
  "title": "string",
  ...
}
```

## 6. Lấy danh mục
- **URL:** `/api/categories`
- **Phương thức:** GET
- **Response:**
```json
[
  {
    "categoryID": 1,
    "categoryName": "Văn học Việt Nam"
  }
]
```

## 7. Lấy thông tin user
- **URL:** `/api/users/{id}`
- **Phương thức:** GET
- **Response:**
```json
{
  "userID": 1,
  "name": "string",
  "email": "string",
  ...
}
```

## 8. Đổi mật khẩu
- **URL:** `/api/users/{id}/change-password`
- **Phương thức:** POST
- **Request Body:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```
- **Response:**
```json
{
  "message": "Đổi mật khẩu thành công!"
}
```

## 9. Tạo bài đăng mới
- **URL:** `/api/posts`
- **Phương thức:** POST
- **Request Body:**
```json
{
  "book": { ... },
  "description": "string"
}
```
- **Query Param:** `userID`
- **Response:**
```json
{
  "postID": 1,
  "book": { ... },
  "description": "string",
  "status": "pending"
}
```

## 10. Lấy bài đăng của user
- **URL:** `/api/posts/my-posts?userID={id}`
- **Phương thức:** GET
- **Response:**
```json
[
  {
    "postID": 1,
    "book": { ... },
    "description": "string",
    "status": "approved"
  }
]
```

... (Có thể bổ sung thêm các API khác nếu cần)
