document.addEventListener("DOMContentLoaded", () => {
  // ===== CHECK ADMIN LOGIN =====
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  if (!admin || admin.role !== "ADMIN") {
    window.location.href = "loginAdmin.html";
    return;
  }

  // ===== ELEMENTS =====
  const categoryForm = document.getElementById("categoryForm");
  const categoryID = document.getElementById("categoryID");
  const categoryName = document.getElementById("categoryName");
  const categoryTable = document.getElementById("categoryTable");
  const btnCancel = document.getElementById("btnCancel");

  // ===== CANCEL FORM =====
  btnCancel.addEventListener("click", () => {
    categoryID.value = "";
    categoryForm.reset();
  });

  // ===== SUBMIT FORM =====
  categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      categoryName: categoryName.value.trim(),
    };

    if (!payload.categoryName) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      if (categoryID.value) {
        await api.adminAPI.updateCategory(categoryID.value, payload);
        alert("Cập nhật danh mục thành công");
      } else {
        await api.adminAPI.createCategory(payload);
        alert("Thêm danh mục thành công");
      }

      categoryForm.reset();
      categoryID.value = "";
      loadCategories();
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi xử lý danh mục");
    }
  });

  // ===== LOAD CATEGORIES =====
  async function loadCategories() {
    try {
      const data = await api.categoryAPI.getAll();

      console.log("CATEGORY DATA:", data); 

      if (!Array.isArray(data)) {
        alert("Dữ liệu danh mục không hợp lệ!");
        return;
      }

      renderTable(data);
    } catch (err) {
      console.error("LOAD CATEGORY ERROR:", err);
      alert("Không tải được danh mục");
    }
  }

  // ===== RENDER TABLE =====
  function renderTable(categories) {
    categoryTable.innerHTML = "";

    if (categories.length === 0) {
      categoryTable.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-muted">Không có danh mục</td>
        </tr>
      `;
      return;
    }

    categories.forEach((c) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${c.categoryID}</td>
        <td>${c.categoryName}</td>
        <td class="text-center">
          <button type="button"
            class="btn btn-sm btn-warning me-1 btn-edit"
            data-id="${c.categoryID}"
            data-name="${c.categoryName}">
            Sửa
          </button>

          <button type="button"
            class="btn btn-sm btn-danger btn-delete"
            data-id="${c.categoryID}">
            Xóa
          </button>
        </td>
      `;

      categoryTable.appendChild(tr);
    });
  }

  // ===== EVENT DELEGATION =====
  categoryTable.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit");
    const deleteBtn = e.target.closest(".btn-delete");

    // ===== EDIT =====
    if (editBtn) {
      categoryID.value = editBtn.dataset.id;
      categoryName.value = editBtn.dataset.name;
      return;
    }

    // ===== DELETE =====
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;

      if (!confirm("Bạn có chắc muốn xóa danh mục này không?")) return;

      try {
        await api.adminAPI.deleteCategory(id);
        alert("Xóa danh mục thành công");
        loadCategories();
      } catch (err) {
        console.error(err);
        alert(err.message || "Xóa danh mục thất bại");
        loadCategories();
      }
    }
  });

  // ===== INIT =====
  loadCategories();
});
