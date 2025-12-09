document
  .getElementById("adminLoginForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const data = await api.authAPI.adminLogin({ email, password });

      if (data && data.token && data.role === "ADMIN") {
        // Login thành công -> chuyển sang dashboard
        window.location.href = "admin-dashboard.html";
      } else {
        document.getElementById("errorMsg").innerText = "Không phải admin!";
      }
    } catch (err) {
      document.getElementById("errorMsg").innerText =
        err.message || "Đăng nhập thất bại";
    }
  });
