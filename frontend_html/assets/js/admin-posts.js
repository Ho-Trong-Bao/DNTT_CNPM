const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
if (!currentUser || currentUser.role !== "ADMIN") {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "loginAdmin.html";
} else {
    // Hiển thị tên admin nếu có
    const adminNameEl = document.getElementById("adminName");
    if (adminNameEl) adminNameEl.textContent = currentUser.name || "Quản trị viên";
}

// Xử lý nút đăng xuất
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (window.api && window.api.authAPI) {
            window.api.authAPI.logout();
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }
        window.location.href = "loginAdmin.html";
    });
}


let allPosts = []; 

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0 đ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Format ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('vi-VN');
};

// Hàm lấy Badge màu sắc cho trạng thái
const getStatusBadge = (status) => {
    // Chuyển về chữ hoa để so sánh cho chuẩn
    const s = (status || "").toUpperCase();
    switch (s) {
        case 'PENDING': return '<span class="badge bg-warning text-dark">Chờ duyệt</span>';
        case 'APPROVED': return '<span class="badge bg-success">Đã duyệt</span>';
        case 'DECLINED': return '<span class="badge bg-danger">Từ chối</span>';
        case 'SOLD': return '<span class="badge bg-secondary">Đã bán</span>';
        default: return `<span class="badge bg-light text-dark">${s || 'Chưa rõ'}</span>`;
    }
};

// --- LOGIC CHÍNH ---

// 1. Tải dữ liệu khi trang load
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllPosts();
});

// 2. Hàm gọi API lấy danh sách
async function loadAllPosts() {
    const tbody = document.getElementById('postsTableBody');
    try {
        // Hiển thị loading
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5"><div class="spinner-border text-primary"></div></td></tr>`;

        // Gọi API
        const data = await window.api.adminAPI.getAllPosts();

        // LOG DỮ LIỆU RA CONSOLE ĐỂ KIỂM TRA (F12)
        console.log("Dữ liệu API trả về:", data);

        // Kiểm tra nếu data rỗng hoặc null
        if (!data || !Array.isArray(data)) {
            throw new Error("Dữ liệu trả về không đúng định dạng danh sách");
        }

        // Sắp xếp ID giảm dần (mới nhất lên đầu)
        allPosts = data.sort((a, b) => {
            const idA = a.postID || a.id || 0;
            const idB = b.postID || b.id || 0;
            return idB - idA;
        });

        renderPosts(allPosts);

        // Cập nhật số lượng
        const countEl = document.getElementById('totalPostsCount');
        if (countEl) countEl.innerText = `Tổng số: ${allPosts.length} bài đăng`;

    } catch (error) {
        console.error("Lỗi tải bài đăng:", error);
        tbody.innerHTML = `
            <tr><td colspan="8" class="text-center text-danger">
                Lỗi kết nối API: ${error.message}<br>
                <small>Vui lòng kiểm tra Console (F12) để xem chi tiết.</small>
            </td></tr>
        `;
    }
}

// 3. Hàm render bảng (Đã nâng cấp để bắt nhiều trường hợp JSON)
function renderPosts(postsData) {
    const tbody = document.getElementById('postsTableBody');
    tbody.innerHTML = '';

    if (postsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Không có bài đăng nào.</td></tr>';
        return;
    }

    postsData.forEach(post => {
        // --- XỬ LÝ DỮ LIỆU LINH HOẠT ---

        // 1. Lấy ID
        const pID = post.postID || post.id || post.postId;

        // 2. Lấy thông tin Sách (Book)
        // Ưu tiên: post.book.title -> post.title -> post.bookTitle
        let bTitle = "Sách không tên";
        let bPrice = 0;
        let bImage = "";

        if (post.book) {
            // Trường hợp cấu trúc lồng nhau (Nested Object)
            bTitle = post.book.title || bTitle;
            bPrice = post.book.price || 0;
            bImage = post.book.image || "";
        } else {
            // Trường hợp cấu trúc phẳng (Flat DTO)
            bTitle = post.title || post.bookTitle || post.book_title || bTitle;
            bPrice = post.price || post.bookPrice || 0;
            bImage = post.image || post.bookImage || "";
        }

        // Xử lý ảnh lỗi hoặc rỗng
        const imgDisplay = bImage
            ? `<img src="${bImage}" class="book-thumb" alt="Book" onerror="this.onerror=null;this.src='https://via.placeholder.com/60x80?text=No+Img'">`
            : `<div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="width:60px; height:80px; font-size:10px;">No Img</div>`;

        // 3. Lấy thông tin Người dùng (User)
        let uName = "Ẩn danh";
        if (post.user) {
            uName = post.user.name || post.user.fullName || uName;
        } else {
            uName = post.userName || post.user_name || post.author || uName;
        }

        // 4. Lấy trạng thái và ngày
        const pStatus = post.status || post.postStatus || "PENDING";
        const pDate = post.created_at || post.createdAt || post.date || "";

        // --- TẠO NÚT BẤM (ACTION BUTTONS) ---
        let actionButtons = '';
        // Chuẩn hóa status về chữ hoa để so sánh
        const statusUpper = (pStatus + "").toUpperCase();

        if (statusUpper === 'PENDING') {
            actionButtons = `
                <button class="btn btn-sm btn-success mb-1" onclick="updatePostStatus(${pID}, 'APPROVED')">
                    <i class="bi bi-check-lg"></i> Duyệt
                </button>
                <button class="btn btn-sm btn-outline-danger mb-1" onclick="updatePostStatus(${pID}, 'DECLINED')">
                    <i class="bi bi-x-lg"></i> Từ chối
                </button>
            `;
        } else if (statusUpper === 'APPROVED') {
            actionButtons = `
                <button class="btn btn-sm btn-outline-secondary" onclick="updatePostStatus(${pID}, 'SOLD')">
                     Đã bán
                </button>
            `;
        }

        // --- RENDER ROW ---
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${pID}</td>
            <td>${imgDisplay}</td>
            <td class="fw-bold text-primary">${bTitle}</td>
            <td>${uName}</td>
            <td class="fw-bold text-danger">${formatCurrency(bPrice)}</td>
            <td><small>${formatDate(pDate)}</small></td>
            <td>${getStatusBadge(pStatus)}</td>
            <td class="text-end">
                <div class="d-flex flex-column align-items-end gap-1">
                    ${actionButtons}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 4. Hàm lọc dữ liệu (Client-side filtering)
window.filterPosts = function (statusKey) {
    // Update UI active button
    const buttons = document.querySelectorAll('.btn-group .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (statusKey === 'ALL') {
        renderPosts(allPosts);
    } else {
        const filtered = allPosts.filter(p => {
            // Lấy status dù nó nằm ở post.status hay post.postStatus
            const s = p.status || p.postStatus || "";
            return s.toUpperCase() === statusKey;
        });
        renderPosts(filtered);
    }
}

// 5. Hàm cập nhật trạng thái (Gọi API)
window.updatePostStatus = async function (postID, newStatus) {
    if (!confirm(`Xác nhận chuyển trạng thái thành "${newStatus}"?`)) return;

    try {
        // Gọi API cập nhật
        await window.api.adminAPI.updatePostStatus(postID, { status: newStatus });

        alert("Cập nhật thành công!");

        // Tải lại dữ liệu để cập nhật bảng
        loadAllPosts();

    } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra: " + (error.message || "Không rõ lỗi"));
    }
}