// assets/js/admin-posts.js

// 1. Kiểm tra quyền Admin
// SỬA: Lấy key "admin" thay vì "user" (do api.js lưu là "admin")
const currentAdmin = JSON.parse(localStorage.getItem("admin") || "{}");

// Kiểm tra: Phải có data và role phải là ADMIN
if (!currentAdmin || currentAdmin.role !== "ADMIN") {
    alert("Bạn không có quyền truy cập trang này hoặc phiên đăng nhập đã hết hạn!");
    window.location.href = "loginAdmin.html"; // Đảm bảo bạn có file này
} else {
    // Hiển thị tên admin
    const adminNameEl = document.getElementById("adminName");
    if (adminNameEl) adminNameEl.textContent = currentAdmin.name || "Quản trị viên";
}

// 2. Xử lý nút đăng xuất
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (window.api && window.api.authAPI) {
            // SỬA: Gọi hàm logoutAdmin() thay vì logout() chung chung
            window.api.authAPI.logoutAdmin(); 
        } else {
            // Fallback thủ công nếu api chưa load
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");
        }
        window.location.href = "loginAdmin.html";
    });
}

let allPosts = []; 

// --- CÁC HÀM FORMAT ---
const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0 đ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('vi-VN');
};

const getStatusBadge = (status) => {
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

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllPosts();
});

async function loadAllPosts() {
    const tbody = document.getElementById('postsTableBody');
    try {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5"><div class="spinner-border text-primary"></div></td></tr>`;

        // Gọi API: window.api.adminAPI.getAllPosts() đã được định nghĩa trong api.js
        const data = await window.api.adminAPI.getAllPosts();

        // Kiểm tra dữ liệu trả về
        // api.js của bạn trả về JSON.parse(text), nên data có thể là mảng ngay lập tức hoặc object chứa mảng
        let postsArray = [];
        if (Array.isArray(data)) {
            postsArray = data;
        } else if (data && Array.isArray(data.data)) {
            postsArray = data.data; // Trường hợp bọc trong { data: [...] }
        } else {
            // Nếu API trả về rỗng hoặc lỗi nhẹ, coi như mảng rỗng để không crash web
            console.warn("Dữ liệu không phải mảng:", data);
        }

        // Sắp xếp: ID giảm dần (Mới nhất lên đầu)
        allPosts = postsArray.sort((a, b) => {
            const idA = a.postID || a.id || 0;
            const idB = b.postID || b.id || 0;
            return idB - idA;
        });

        renderPosts(allPosts);

        const countEl = document.getElementById('totalPostsCount');
        if (countEl) countEl.innerText = `Tổng số: ${allPosts.length} bài đăng`;

    } catch (error) {
        console.error("Lỗi tải bài đăng:", error);
        tbody.innerHTML = `
            <tr><td colspan="8" class="text-center text-danger">
                Lỗi kết nối API: ${error.message}<br>
                <small>Vui lòng kiểm tra Console (F12) và đảm bảo Backend đang chạy.</small>
            </td></tr>
        `;
    }
}

function renderPosts(postsData) {
    const tbody = document.getElementById('postsTableBody');
    tbody.innerHTML = '';

    if (!postsData || postsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Không có bài đăng nào.</td></tr>';
        return;
    }

    postsData.forEach(post => {
        // --- XỬ LÝ DỮ LIỆU AN TOÀN ---
        const pID = post.postID || post.id || post.postId;

        // Xử lý Book (Nested hoặc Flat)
        let bTitle = "Sách không tên";
        let bPrice = 0;
        let bImage = "";

        if (post.book) {
            bTitle = post.book.title || bTitle;
            bPrice = post.book.price || 0;
            bImage = post.book.image || "";
        } else {
            bTitle = post.title || post.bookTitle || bTitle;
            bPrice = post.price || post.bookPrice || 0;
            bImage = post.image || post.bookImage || "";
        }

        // Xử lý Image
        const imgDisplay = bImage
            ? `<img src="${bImage}" class="book-thumb" alt="Img" onerror="this.onerror=null;this.src='https://via.placeholder.com/60x80?text=No+Img'">`
            : `<div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="width:60px; height:80px; font-size:10px;">No Img</div>`;

        // Xử lý User
        let uName = "Ẩn danh";
        if (post.user) {
            uName = post.user.name || post.user.fullName || uName;
        } else {
            uName = post.userName || post.user_name || post.author || uName;
        }

        const pStatus = post.status || post.postStatus || "PENDING";
        const pDate = post.created_at || post.createdAt || post.date || "";

        // --- BUTTONS ---
        let actionButtons = '';
        const statusUpper = (pStatus + "").toUpperCase();

        if (statusUpper === 'PENDING') {
            // Lưu ý: Thêm dấu nháy đơn '${pID}' phòng trường hợp ID là string UUID
            actionButtons = `
                <button class="btn btn-sm btn-success mb-1" onclick="updatePostStatus('${pID}', 'APPROVED')">
                    <i class="bi bi-check-lg"></i> Duyệt
                </button>
                <button class="btn btn-sm btn-outline-danger mb-1" onclick="updatePostStatus('${pID}', 'DECLINED')">
                    <i class="bi bi-x-lg"></i> Từ chối
                </button>
            `;
        } else if (statusUpper === 'APPROVED') {
            actionButtons = `
                <button class="btn btn-sm btn-outline-secondary" onclick="updatePostStatus('${pID}', 'SOLD')">
                      Đã bán
                </button>
            `;
        } else {
            actionButtons = `<span class="text-muted small">--</span>`;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${pID}</td>
            <td>${imgDisplay}</td>
            <td class="fw-bold text-primary text-wrap" style="max-width: 200px;">${bTitle}</td>
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

window.filterPosts = function (statusKey) {
    const buttons = document.querySelectorAll('.btn-group .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (statusKey === 'ALL') {
        renderPosts(allPosts);
    } else {
        const filtered = allPosts.filter(p => {
            const s = p.status || p.postStatus || "";
            return s.toUpperCase() === statusKey;
        });
        renderPosts(filtered);
    }
}

window.updatePostStatus = async function (postID, newStatus) {
    const confirmMsg = newStatus === 'APPROVED' ? 'Duyệt bài đăng này?' : 
                       newStatus === 'DECLINED' ? 'Từ chối bài đăng này?' : 
                       `Chuyển trạng thái thành ${newStatus}?`;

    if (!confirm(confirmMsg)) return;

    try {
        await window.api.adminAPI.updatePostStatus(postID, { status: newStatus });
        alert("Cập nhật thành công!");
        loadAllPosts();
    } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra: " + (error.message || "Không rõ lỗi"));
    }
}