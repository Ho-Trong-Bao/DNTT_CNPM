/**
 * File: frontend/assets/js/my-posts.js
 * My Posts Page JavaScript - KẾT NỐI VỚI BACKEND API
 */

let deleteModal;
let selectedPostId = null;

document.addEventListener('DOMContentLoaded', async function() {
  // Kiểm tra đăng nhập
  if (!requireAuth()) return;
  
  // Initialize Bootstrap modal
  deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  
  // Load posts
  await loadMyPosts();
  
  // Setup delete confirmation
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
});

// Load my posts từ API: GET /api/posts/my-posts?userID={id}
async function loadMyPosts() {
  const container = document.getElementById('myPostsContainer');
  showLoading('myPostsContainer');
  
  try {
    const userID = getUserId();
    
    if (!userID) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    
    // Gọi API: GET /api/posts/my-posts?userID={userID}
    console.log('Loading posts for userID:', userID);
    const posts = await postAPI.getMyPosts(userID);
    
    console.log('Loaded posts:', posts);
    
    if (posts && posts.length > 0) {
      container.innerHTML = posts.map(post => createPostCard(post)).join('');
    } else {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <h4 class="mt-3 text-muted">Bạn chưa có bài đăng nào</h4>
          <p class="text-muted">Bắt đầu đăng bán sách của bạn ngay!</p>
          <a href="post-book.html" class="btn btn-primary mt-3">
            <i class="bi bi-plus-circle me-2"></i>Đăng bài đầu tiên
          </a>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('Error loading posts:', error);
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
        <p class="mt-3 text-muted">Không thể tải bài đăng của bạn</p>
      </div>
    `;
    showToast('Không thể tải bài đăng', 'error');
  }
}

// Tạo HTML cho post card
function createPostCard(post) {
  const defaultImage = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80';
  const image = post.book?.image || defaultImage;
  
  const statusConfig = {
    PENDING: { variant: 'warning', text: 'Chờ duyệt', icon: 'clock' },
    APPROVED: { variant: 'success', text: 'Đã duyệt', icon: 'check-circle' },
    DECLINED: { variant: 'danger', text: 'Từ chối', icon: 'x-circle' },
    SOLD: { variant: 'secondary', text: 'Đã bán', icon: 'bag-check' }
  };
  
  const status = statusConfig[post.status] || statusConfig.PENDING;
  
  return `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card book-card h-100">
        <img src="${image}" class="card-img-top" alt="${post.book?.title}" 
             style="height: 250px; object-fit: cover;"
             onerror="this.src='${defaultImage}'">
        <div class="card-body d-flex flex-column">
          <div class="mb-2">
            <span class="badge bg-${status.variant}">
              <i class="bi bi-${status.icon} me-1"></i>${status.text}
            </span>
          </div>
          
          <h5 class="card-title">${post.book?.title || 'Không có tiêu đề'}</h5>
          
          <p class="book-meta flex-grow-1">
            <strong>Tác giả:</strong> ${post.book?.author || 'Không rõ'}<br>
            <strong>Tình trạng:</strong> ${post.book?.bookCondition || 'Cũ'}<br>
            <strong>Khu vực:</strong> ${post.book?.province || 'Không rõ'}
          </p>
          
          <div class="mb-3">
            <span class="fw-bold text-danger fs-5">${formatPrice(post.book?.price || 0)}</span>
          </div>
          
          <div class="d-flex gap-2 mt-auto">
            ${post.status === 'APPROVED' ? `
              <button class="btn btn-success btn-sm flex-fill" onclick="markAsSold(${post.postID})">
                <i class="bi bi-bag-check"></i> Đã bán
              </button>
            ` : ''}
            
            <button class="btn btn-outline-danger btn-sm" onclick="showDeleteModal(${post.postID})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Show delete modal
function showDeleteModal(postId) {
  selectedPostId = postId;
  deleteModal.show();
}

// Confirm delete - Gọi API: DELETE /api/posts/{id}
async function confirmDelete() {
  if (!selectedPostId) return;
  
  try {
    console.log('Deleting post:', selectedPostId);
    
    // Gọi API: DELETE /api/posts/{selectedPostId}
    await postAPI.delete(selectedPostId);
    
    showToast('Xóa bài đăng thành công!', 'success');
    deleteModal.hide();
    
    // Reload posts
    await loadMyPosts();
    
  } catch (error) {
    console.error('Error deleting post:', error);
    showToast('Không thể xóa bài đăng', 'error');
  } finally {
    selectedPostId = null;
  }
}

// Mark as sold - Gọi API: PUT /api/posts/{id}/mark-sold
async function markAsSold(postId) {
  try {
    console.log('Marking post as sold:', postId);
    
    // Gọi API: PUT /api/posts/{postId}/mark-sold
    await postAPI.markSold(postId);
    
    showToast('Đã đánh dấu sách đã bán!', 'success');
    
    // Reload posts
    await loadMyPosts();
    
  } catch (error) {
    console.error('Error marking as sold:', error);
    showToast('Không thể cập nhật trạng thái', 'error');
  }
}