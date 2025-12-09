/**
 * File: frontend/assets/js/book-detail.js
 * Book Detail Page JavaScript (ĐÃ CHỈNH SỬA THEO BACKEND)
 */

document.addEventListener('DOMContentLoaded', async function() {
  const bookId = getUrlParameter('id');
  
  if (!bookId) {
    showError('Không tìm thấy ID sách');
    return;
  }
  
  await loadBookDetail(bookId);
  await loadRelatedBooks();
});

async function loadBookDetail(bookId) {
  const section = document.getElementById('bookDetailSection');
  showLoading('bookDetailSection');
  
  try {
    const book = await bookAPI.get(bookId);

    if (!book) {
      showError('Không tìm thấy sách');
      return;
    }

    const defaultImage =
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80";

    const image = book.image || defaultImage;

    // 👉 Category xử lý theo backend (không có mảng)
    const categoriesHtml = book.categoryName
      ? `<span class="badge bg-secondary">${book.categoryName}</span>`
      : "";

    // 👉 Mô tả lấy từ postDescription
    const description = book.postDescription || "Không có mô tả.";

    // 👉 Thông tin liên hệ
    const contact = book.contactInfo || "Không có thông tin.";

    section.innerHTML = `
      <div class="row g-4 align-items-start">

        <!-- Image -->
        <div class="col-md-5">
          <div class="card border-0 shadow-sm">
            <img src="${image}" class="card-img-top" alt="${book.title}"
              style="height: 500px; object-fit: cover;"
              onerror="this.src='${defaultImage}'">
          </div>
        </div>

        <!-- Details -->
        <div class="col-md-7">

          <div class="mb-2">${categoriesHtml}</div>

          <h2 class="mb-3">${book.title}</h2>

          <p><strong>Tác giả:</strong> ${book.author || "Không rõ"}</p>
          <p><strong>Tình trạng:</strong> ${book.bookCondition || "Cũ"}</p>
          <p><strong>Khu vực:</strong> ${book.province || ""} 
            ${book.district ? " - " + book.district : ""}</p>

          <p class="fs-4 text-danger fw-bold">
            ${formatPrice(book.price)}
          </p>

          <hr>

          <div class="mb-4">
            <h5>📝 Mô tả</h5>
            <p class="text-muted">${description}</p>
          </div>

          <div class="d-flex gap-3 flex-wrap">
            <button class="btn btn-primary btn-lg" onclick="handleContact('${contact}')">
              <i class="bi bi-chat-dots me-2"></i>Liên hệ người bán
            </button>
            <button class="btn btn-outline-secondary btn-lg">
              <i class="bi bi-heart me-2"></i>Yêu thích
            </button>
          </div>

          <div class="card mt-4 bg-light">
            <div class="card-body">
              <h6 class="mb-2"><i class="bi bi-telephone-fill text-primary me-2"></i>Thông tin liên hệ</h6>
              <p class="mb-0">${contact}</p>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-body">
              <h6><i class="bi bi-person-circle me-1"></i>Người bán:</h6>
              <strong>${book.userName || "Ẩn danh"}</strong>
            </div>
          </div>

        </div>
      </div>
    `;

  } catch (error) {
    console.error("Error loading book detail:", error);
    showError("Không thể tải thông tin sách");
  }
}

async function loadRelatedBooks() {
  const container = document.getElementById("relatedBooks");

  try {
    const books = await bookAPI.search({});


    if (books && books.length > 0) {
      container.innerHTML = books
        .slice(0, 4)
        .map((book) => createBookCard(book))
        .join("");
    } else {
      container.innerHTML =
        '<p class="text-muted text-center">Không có sách tương tự</p>';
    }
  } catch (error) {
    console.error("Error loading related books:", error);
  }
}

function handleContact(contactInfo) {
  showToast(contactInfo, "info");
}

function showError(message) {
  document.getElementById("bookDetailSection").innerHTML = `
    <div class="text-center py-5">
      <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
      <h3 class="mt-3">${message}</h3>
      <a href="search-books.html" class="btn btn-primary mt-3">Quay lại tìm kiếm</a>
    </div>
  `;
}
