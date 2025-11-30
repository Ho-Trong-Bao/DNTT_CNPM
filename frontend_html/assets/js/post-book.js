/**
 * File: frontend/assets/js/post-book.js
 * Post Book Page JavaScript - KẾT NỐI VỚI BACKEND API
 */

let selectedCategories = [];
let imageBase64 = '';

document.addEventListener('DOMContentLoaded', async function() {
  // Kiểm tra đăng nhập
  if (!requireAuth()) return;
  
  await loadCategories();
  setupImagePreview();
  setupFormSubmit();
});

// Load categories từ API backend: GET /api/categories
async function loadCategories() {
  try {
    const categories = await categoryAPI.getAll();
    const container = document.getElementById('categoriesCheckbox');
    
    container.innerHTML = categories.map(cat => `
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" 
               id="cat${cat.categoryID}" value="${cat.categoryID}">
        <label class="form-check-label" for="cat${cat.categoryID}">
          ${cat.categoryName}
        </label>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading categories:', error);
    showToast('Không thể tải danh sách thể loại', 'error');
  }
}

// Setup image preview
function setupImagePreview() {
  document.getElementById('bookImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        imageBase64 = evt.target.result;
        document.getElementById('imagePreview').src = imageBase64;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Setup form submit - KẾT NỐI API: POST /api/posts?userID={id}
function setupFormSubmit() {
  document.getElementById('postBookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang đăng...';
    
    try {
      // Lấy categories đã chọn
      selectedCategories = [];
      document.querySelectorAll('#categoriesCheckbox input:checked').forEach(cb => {
        selectedCategories.push({
          categoryID: parseInt(cb.value)
        });
      });
      
      // Tạo object Book theo đúng cấu trúc backend
      const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        bookCondition: document.getElementById('bookCondition').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value,
        province: document.getElementById('province').value,
        district: document.getElementById('district').value,
        contactInfo: document.getElementById('contactInfo').value,
        image: imageBase64 || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        categories: selectedCategories
      };
      
      // Tạo object Post
      const postData = {
        book: bookData,
        description: document.getElementById('description').value
      };
      
      // Lấy userID từ localStorage
      const userID = getUserId();
      
      if (!userID) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }
      
      // Gọi API: POST /api/posts?userID={userID}
      console.log('Sending post data:', postData);
      await postAPI.create(postData, userID);
      
      showToast('Đăng bài thành công! Vui lòng chờ admin duyệt.', 'success');
      
      // Redirect về my-posts sau 1.5s
      setTimeout(() => {
        window.location.href = 'my-posts.html';
      }, 1500);
      
    } catch (error) {
      console.error('Error posting book:', error);
      showToast(error.message || 'Đăng bài thất bại. Vui lòng thử lại!', 'error');
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-upload me-2"></i>Đăng bài';
    }
  });
}