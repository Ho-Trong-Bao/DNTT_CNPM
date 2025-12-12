/**
 * File: edit-post.js
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;

  await loadCategories();
  await loadPostData();
  setupImagePreview();
  setupSubmit();
});

let currentImageUrl = null;
let selectedImageFile = null;

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Load categories
async function loadCategories() {
  const select = document.getElementById("category");
  const list = await categoryAPI.getAll();

  select.innerHTML = `<option value="">-- Chọn thể loại --</option>`;
  list.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.categoryID;
    opt.textContent = c.categoryName;
    select.appendChild(opt);
  });
}

// Load post data
async function loadPostData() {
  try {
    const postID = getPostId();
    const post = await postAPI
      .getMyPosts()
      .then((list) => list.find((p) => p.postID == postID));

    if (!post) {
      showToast("Không tìm thấy bài đăng!", "error");
      return;
    }

    // Fill form
    document.getElementById("title").value = post.title;
    document.getElementById("author").value = post.author;
    document.getElementById("bookCondition").value = post.bookCondition;
    document.getElementById("price").value = post.price;
    document.getElementById("category").value = post.categoryID;
    document.getElementById("description").value = post.postDescription;
    document.getElementById("contactInfo").value = post.contactInfo;

    document.getElementById("province").value = post.province;
    document.getElementById("district").value = post.district;

    currentImageUrl = post.image;
    document.getElementById("imagePreview").src = post.image;
  } catch (err) {
    console.error(err);
    showToast("Lỗi tải dữ liệu bài đăng!", "error");
  }
}

function setupImagePreview() {
  document.getElementById("bookImage").addEventListener("change", (e) => {
    selectedImageFile = e.target.files[0];
    if (selectedImageFile) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        (document.getElementById("imagePreview").src = ev.target.result);
      reader.readAsDataURL(selectedImageFile);
    }
  });
}

// Submit updated data
function setupSubmit() {
  document
    .getElementById("editPostForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = document.getElementById("saveBtn");
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...`;

      try {
        let finalImageUrl = currentImageUrl;

        // Nếu có ảnh mới → upload
        if (selectedImageFile) {
          const formData = new FormData();
          formData.append("file", selectedImageFile);

          const res = await fetch(`${API_BASE_URL}/images/upload`, {
            method: "POST",
            headers: { Authorization: "Bearer " + getToken() },
            body: formData,
          });

          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          finalImageUrl = data.fileUrl;
        }

        const payload = {
          title: document.getElementById("title").value,
          author: document.getElementById("author").value,
          bookCondition: document.getElementById("bookCondition").value,
          price: parseFloat(document.getElementById("price").value),
          postDescription: document.getElementById("description").value,
          image: finalImageUrl,
          contactInfo: document.getElementById("contactInfo").value,
          categoryID: parseInt(document.getElementById("category").value),
          province: document.getElementById("province").value,
          district: document.getElementById("district").value,
        };

        const postID = getPostId();
        await postAPI.update(postID, payload);

        showToast("Cập nhật bài đăng thành công!", "success");
        setTimeout(() => (location.href = "my-posts.html"), 1200);
      } catch (err) {
        console.error(err);
        showToast(err.message || "Lỗi cập nhật bài đăng!", "error");
      }

      btn.disabled = false;
      btn.innerHTML = `<i class="bi bi-save me-2"></i>Lưu thay đổi`;
    });
}
