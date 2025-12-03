# 🎨 Frontend - Website Sách Cũ Theo Khu Vực

## 📋 Mô tả
Frontend ReactJS cho hệ thống mua bán sách cũ theo khu vực.

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 16+ và npm
- Backend đang chạy tại `http://localhost:8080/api`

### Bước 1: Cài đặt dependencies
```bash
cd frontend
npm install
```

### Bước 2: Tạo file .env (optional)
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### Bước 3: Chạy development server
```bash
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

### Bước 4: Build production
```bash
npm run build
```

## 📁 Cấu trúc thư mục
```
src/
├── components/       # Các component tái sử dụng
│   ├── Navbar.js
│   ├── Footer.js
│   ├── BookCard.js
│   └── ProtectedRoute.js
├── pages/           # Các trang chính
│   ├── HomePage.js
│   ├── SearchBooks.js
│   ├── BookDetail.js
│   ├── PostBook.js
│   ├── MyPosts.js
│   ├── Account.js
│   ├── Login.js
│   └── Register.js
├── services/        # API services
│   └── apiService.js
├── styles/          # CSS files
│   └── App.css
├── utils/           # Utility functions
│   └── authUtils.js
├── App.js           # Main App component
└── index.js         # Entry point
```

## 🎯 Chức năng chính

### 🏠 Trang chủ (HomePage)
- Hiển thị sách nổi bật
- Hero banner với call-to-action
- Thống kê hệ thống

### 🔍 Tìm kiếm (SearchBooks)
- Tìm kiếm theo từ khóa, thể loại, khu vực, giá
- Phân trang kết quả
- Filter động

### 📖 Chi tiết sách (BookDetail)
- Hiển thị thông tin chi tiết sách
- Liên hệ người bán
- Sách liên quan

### ✍️ Đăng bài (PostBook)
- Form đăng bán sách
- Upload ảnh
- Preview trước khi đăng

### 📚 Bài đăng của tôi (MyPosts)
- Quản lý bài đăng
- Xóa bài đăng
- Đánh dấu đã bán

### 👤 Tài khoản (Account)
- Cập nhật thông tin cá nhân
- Đổi mật khẩu
- Upload avatar

### 🔐 Đăng nhập/Đăng ký
- Form đăng nhập
- Form đăng ký với validation
- JWT authentication

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Framework
- **React Router 6** - Routing
- **React Bootstrap** - UI Components
- **Axios** - HTTP Client
- **React Toastify** - Notifications
- **Bootstrap 5** - CSS Framework
- **Bootstrap Icons** - Icon library

## 📱 Responsive Design
- Mobile-first approach
- Tối ưu cho mọi kích thước màn hình
- Touch-friendly UI

## 🔒 Bảo mật
- JWT token authentication
- Protected routes
- XSS protection
- CSRF protection

## 🎨 Giao diện
- Thiết kế hiện đại, thân thiện
- Màu sắc ấm áp, dễ nhìn
- Animation mượt mà
- Loading states

## 📦 Scripts có sẵn

```bash
npm start          # Chạy development server
npm run build      # Build production
npm test           # Chạy tests
npm run eject      # Eject configuration
```

## 🐛 Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra:
- Backend đã bật CORS chưa
- URL API trong `apiService.js` đúng chưa

### Lỗi connection refused
- Kiểm tra backend đang chạy tại port 8080
- Kiểm tra proxy trong `package.json`

### Lỗi authentication
- Clear localStorage
- Đăng nhập lại
- Kiểm tra token expiration

## 📞 Liên hệ
Nhóm 13 - Trường ĐH Giao Thông Vận Tải TP.HCM