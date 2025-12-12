/**
 * File: frontend/assets/js/home.js
 * Trang chủ - Hiển thị sách nổi bật và dữ liệu tổng quan
 */

document.addEventListener("DOMContentLoaded", async () => {
  await loadLocationData();
  loadBooks(1); // load trang đầu tiên
});

let provinceMap = {};
let districtMap = {};
const ITEMS_PER_PAGE = 12;

async function loadLocationData() {
  const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
  const provinces = await res.json();

  provinces.forEach((p) => {
    provinceMap[p.code] = p.name;
    districtMap[p.code] = p.districts;
  });
}

async function loadBooks(page) {
  try {
    const books = await bookAPI.list(); // GET /books
    renderBooksPage(books, page);
    renderPagination(books.length, page);
  } catch (err) {
    console.error(err);
    showToast("Không thể tải dữ liệu sách!", "error");
  }
}

function renderBooksPage(books, page) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const booksToShow = books.slice(start, end);
  const container = document.getElementById("featuredBooks");

  container.innerHTML = booksToShow
    .map(
      (book) => `
            <div class="col-md-3">
                <div class="card h-100 shadow-sm">
                    <img src="${
                      book.image
                    }" class="card-img-top" style="height:400px; object-fit:cover;">

                    <div class="card-body d-flex flex-column">
                        
                        <div class="flex-grow-1"> <!-- Phần nội dung phía trên -->
                            <h5 class="card-title">${book.title}</h5>

                        </div>

                        <!-- Phần cố định ở đáy -->

                            <p class="text-muted mb-1">
                                <i class="bi bi-person"></i> ${book.author}
                            </p>

                            <p class="text-muted small mb-1">
                                <i class="bi bi-geo-alt-fill"></i>
                                ${
                                  districtMap[book.province]?.find(
                                    (d) => d.code == book.district
                                  )?.name || book.district
                                }
                                -
                                ${provinceMap[book.province] || book.province}
                            </p>
                        <p class="fw-bold text-danger mb-3">
                            ${book.price.toLocaleString()} đ
                        </p>

                        <a href="book-detail.html?id=${
                          book.bookID
                        }" class="btn btn-primary w-100">
                            Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>
        `
    )
    .join("");
}

function renderPagination(totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const pagination = document.getElementById("pagination");

  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" onclick="loadBooks(${i})">${i}</a>
            </li>
        `;
  }
}
