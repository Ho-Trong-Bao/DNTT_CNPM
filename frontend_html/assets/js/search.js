/**
 * File: frontend/assets/js/search.js
 * Search Books Page JavaScript
 */

let currentPage = 0;
let totalPages = 0;

// Load categories và search books khi trang load
document.addEventListener('DOMContentLoaded', async function() {
  await loadCategories();
  await searchBooks();
  
  // Event listeners
  document.getElementById('searchForm').addEventListener('submit', handleSearch);
  document.getElementById('resetBtn').addEventListener('click', handleReset);
});

// Load categories cho filter
async function loadCategories() {
  try {
    const categories = await categoryAPI.getAll();
    const categoryFilter = document.getElementById('categoryFilter');
    
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.categoryID;
      option.textContent = cat.categoryName;
      categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Search books
async function searchBooks(page = 0) {
  const container = document.getElementById('searchResults');
  const resultCount = document.getElementById('resultCount');
  
  showLoading('searchResults');
  
  try {
    const params = {
      search: document.getElementById('searchKeyword').value || undefined,
      categoryID: document.getElementById('categoryFilter').value || undefined,
      province: document.getElementById('provinceFilter').value || undefined,
      minPrice: document.getElementById('minPrice').value || undefined,
      maxPrice: document.getElementById('maxPrice').value || undefined,
      page: page,
      size: 12,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };
    
    // Loại bỏ undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) delete params[key];
    });
    
    const response = await bookAPI.search(params);
    const books = response.content;
    totalPages = response.totalPages;
    currentPage = page;
    
    if (books && books.length > 0) {
      container.innerHTML = books.map(book => createBookCard(book)).join('');
      resultCount.textContent = `(${books.length} sách)`;
      
      // Update pagination
      if (totalPages > 1) {
        updatePagination();
      } else {
        document.getElementById('paginationNav').classList.add('d-none');
      }
    } else {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <h4 class="mt-3 text-muted">Không tìm thấy sách nào</h4>
          <p class="text-muted">Thử thay đổi điều kiện tìm kiếm</p>
        </div>
      `;
      resultCount.textContent = '';
      document.getElementById('paginationNav').classList.add('d-none');
    }
  } catch (error) {
    console.error('Error searching books:', error);
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
        <p class="mt-3 text-muted">Không thể tìm kiếm sách</p>
      </div>
    `;
    resultCount.textContent = '';
  }
}

// Handle search form submit
function handleSearch(e) {
  e.preventDefault();
  searchBooks(0);
}

// Handle reset button
function handleReset() {
  document.getElementById('searchKeyword').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('provinceFilter').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  searchBooks(0);
}

// Update pagination
function updatePagination() {
  const pagination = document.getElementById('pagination');
  const paginationNav = document.getElementById('paginationNav');
  
  pagination.innerHTML = '';
  
  // Previous button
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 0 ? 'disabled' : ''}`;
  prevLi.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPage - 1}); return false;">Trước</a>`;
  pagination.appendChild(prevLi);
  
  // Page numbers
  for (let i = 0; i < totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i + 1}</a>`;
    pagination.appendChild(li);
  }
  
  // Next button
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`;
  nextLi.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPage + 1}); return false;">Sau</a>`;
  pagination.appendChild(nextLi);
  
  paginationNav.classList.remove('d-none');
}

// Go to page
function goToPage(page) {
  if (page >= 0 && page < totalPages) {
    searchBooks(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}