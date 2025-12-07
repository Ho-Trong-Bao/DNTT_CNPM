/**
 * File: frontend/assets/js/my-posts.js
 * Trang: Bài đăng của tôi
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;
  await loadMyPosts();
});

async function loadMyPosts() {
  const container = document.getElementById("myPostsContainer");
  const userID = getUserId();
  if (!userID) return;

  container.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Đang tải bài đăng...</p>
    </div>
  `;

  try {
    // GET /api/my-posts
    const posts = await postAPI.getMyPosts();

    if (!posts || posts.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center text-muted py-5">
          <i class="bi bi-journal-x fs-1"></i>
          <p class="mt-3">Bạn chưa có bài đăng nào.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(p => createPostCard(p)).join("");

  } catch (err) {
    console.error("Error:", err);
    container.innerHTML = `
      <div class="text-center text-danger py-4">
        Không thể tải danh sách bài đăng.
      </div>
    `;
  }
}

/* ============================
   TẠO CARD BÀI ĐĂNG
============================= */
function createPostCard(post) {
  const img = post.image ||
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80";

  const statusBadge = getStatusBadge(post.postStatus);

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card border-0 shadow-sm h-100">
        
        <img src="${img}" 
             class="card-img-top" 
             style="height: 460px; object-fit: cover;" 
             alt="Book image">

        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="card-title">${post.title}</h5>
            ${statusBadge}
          </div>

          <p class="text-muted mb-1">
            <i class="bi bi-person me-1"></i> ${post.author || "Không rõ"}
          </p>

          <p class="fw-bold text-danger mb-2">
            ${formatPrice(post.price)}
          </p>

          <p class="small mb-2 text-muted">
            <i class="bi bi-geo-alt-fill me-1"></i>
            ${post.province || "?"} ${post.district ? "- " + post.district : ""}
          </p>

          <p class="small">${post.postDescription || "Không có mô tả bài đăng"}</p>
        </div>

        <div class="card-footer bg-white d-flex justify-content-between">
          <a href="book-detail.html?id=${post.bookID}" 
             class="btn btn-outline-primary btn-sm">
            <i class="bi bi-eye me-1"></i>Xem
          </a>

          <button class="btn btn-warning btn-sm" onclick="editPost(${post.postID})">
            <i class="bi bi-pencil-square me-1"></i>Sửa
          </button>

          <button class="btn btn-danger btn-sm" onclick="deletePost(${post.postID})">
            <i class="bi bi-trash me-1"></i>Xóa
          </button>

          <button class="btn btn-success btn-sm" onclick="markAsSold(${post.postID})">
            <i class="bi bi-check2-circle me-1"></i>Đã bán
          </button>

        </div>

      </div>
    </div>
  `;
}


/* ============================
   Thây đổi trạng thái bài thành đã bán
============================= */

async function markAsSold(postID) {
  try {
    await postAPI.markSold(postID);
    showToast("Đã cập nhật trạng thái: Đã bán!", "success");
    setTimeout(() => location.reload(), 800);
  } catch (error) {
    console.error(error);
    showToast("Không thể cập nhật trạng thái!", "error");
  }
}



/* ============================
   HIỂN THỊ BADGE TRẠNG THÁI
============================= */
function getStatusBadge(status) {
  switch (status) {
    case "PENDING":
      return `<span class="badge bg-warning text-dark">⏳ Chờ duyệt</span>`;

    case "APPROVED":
      return `<span class="badge bg-success">✔ Đã duyệt</span>`;

    case "REJECTED":
      return `<span class="badge bg-danger">❌ Từ chối</span>`;

    case "SOLD":
      return `<span class="badge bg-secondary">💰 Đã bán</span>`;

    default:
      return `<span class="badge bg-secondary">Không xác định</span>`;
  }
}


/* ============================
   BUTTON ACTIONS
============================= */

function editPost(postID) {
  window.location.href = `edit-post.html?id=${postID}`;
}

let deletePostID = null;
async function deletePost() {
  try {
    await postAPI.delete(deletePostID);

    showToast("Đã xoá bài đăng!", "success");

    loadMyPosts();   // load lại danh sách

  } catch (error) {
    showToast(error.message || "Lỗi xoá bài đăng!", "error");
  }
}


document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  if (!deletePostID) return;

  try {
    await postAPI.delete(deletePostID);
    showToast("Đã xóa bài đăng!", "success");
    setTimeout(() => location.reload(), 800);
  } catch (error) {
    console.error(error);
    showToast("Không thể xóa bài đăng!", "error");
  }
});
