/**
 * File: frontend/assets/js/home.js
 * Home Page JavaScript
 */

// Load featured books khi trang load
document.addEventListener('DOMContentLoaded', async function() {
  await loadFeaturedBooks();
});

async function loadFeaturedBooks() {
  const container = document.getElementById('featuredBooks');
  showLoading('featuredBooks');

  try {
    const books = await bookAPI.getFeatured();
    
    if (books && books.length > 0) {
      container.innerHTML = books.map(book => createBookCard(book)).join('');
    } else {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-book fs-1 text-muted"></i>
          <p class="mt-3 text-muted">Chưa có sách nổi bật nào</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading featured books:', error);
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
        <p class="mt-3 text-muted">Không thể tải sách nổi bật</p>
      </div>
    `;
  }
}