/**
 * File: frontend/assets/js/search.js
 * Search Books Page JavaScript (PHIÊN BẢN CHUẨN BACKEND)
 */

// Khi tải trang
document.addEventListener("DOMContentLoaded", async function () {
  await loadProvinces();
  await searchBooks();
  await loadDistricts();

  document
    .getElementById("searchForm")
    .addEventListener("submit", handleSearch);
  document.getElementById("resetBtn").addEventListener("click", handleReset);
});

/* ============================
   LOAD PROVINCE (API VN)
============================ */
let provinceMap = {}; // code -> name
let districtMap = {}; // provinceCode -> array districts
async function loadProvinces() {
  try {
    const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
    const provinces = await res.json();

    const select = document.getElementById("provinceFilter");

    provinces.forEach((p) => {
      provinceMap[p.code] = p.name;
      districtMap[p.code] = p.districts; // Lưu quận theo tỉnh
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = p.name;
      select.appendChild(opt);
    });
    select.addEventListener("change", loadDistricts);
  } catch (err) {
    console.error("Error loading provinces:", err);
  }
}

async function loadDistricts() {
  const provinceCode = document.getElementById("provinceFilter").value;
  const districtSelect = document.getElementById("districtFilter");

  districtSelect.innerHTML = `<option value="">Chọn quận/huyện</option>`;

  if (!provinceCode) return;

  const districts = districtMap[provinceCode];
  if (!districts) return;

  districts.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d.code;
    opt.textContent = d.name;
    districtSelect.appendChild(opt);
  });
}

/* ============================
   SEARCH BOOKS – KHỚP BACKEND
============================ */
async function searchBooks() {
  const title = document.getElementById("titleInput").value.trim();
  const author = document.getElementById("authorInput").value.trim();
  const province = document.getElementById("provinceFilter").value.trim();
  const district = document.getElementById("districtFilter").value.trim();

  console.log("titleInput =", document.getElementById("titleInput"));
  console.log("authorInput =", document.getElementById("authorInput"));
  console.log("🔥 searchBooks() ĐÃ ĐƯỢC GỌI");

  const params = {};

  if (title !== "") params.title = title;
  if (author !== "") params.author = author;
  if (province !== "") params.province = province;
  if (district !== "") params.district = district;

  const qs = new URLSearchParams(params).toString();

  console.log("➡ Gửi API:", `${API_BASE_URL}/books/search?${qs}`);

  const res = await fetch(`${API_BASE_URL}/books/search?${qs}`);
  const books = await res.json();
  console.log("🔥 Dữ liệu books nhận từ API:", books);
  renderBooks(books);
}

function renderBooks(books) {
  const container = document.getElementById("searchResults");

  if (!books || books.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted"></i>
        <h4 class="mt-3 text-muted">Không tìm thấy sách nào</h4>
      </div>
    `;
    return;
  }

  container.innerHTML = books
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

/* ============================
   FORM EVENTS
============================ */
function handleSearch(e) {
  e.preventDefault();
  searchBooks();
}

function handleReset() {
  document.getElementById("titleInput").value = "";
  document.getElementById("authorInput").value = "";
  document.getElementById("provinceFilter").value = "";
  document.getElementById("districtFilter").value = "";

  searchBooks();
}

/* ============================
   BOOK CARD
============================ */
function createBookCard(book) {
  const defaultImage =
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80";

  const img = book.image || defaultImage;

  return `
    <div class="col-md-3 col-sm-6">
      <div class="card border-0 shadow-sm h-100">
        <img src="${img}" 
             class="card-img-top" 
             style="height: 250px; object-fit: cover;"
             onerror="this.src='${defaultImage}'">

        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="text-muted small">${book.author || "Không rõ"}</p>

          <p class="fw-bold text-danger">${formatPrice(book.price)}</p>

          <p class="small text-muted">
            <i class="bi bi-geo-alt-fill me-1"></i>
            ${book.province || ""} ${book.district ? "- " + book.district : ""}
          </p>

          <a href="book-detail.html?id=${book.bookID}" 
             class="btn btn-outline-primary btn-sm w-100">
            Xem chi tiết
          </a>
        </div>
      </div>
    </div>
  `;
}

/* ============================
   UTIL
============================ */
function showLoading(id) {
  document.getElementById(id).innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
  `;
}
