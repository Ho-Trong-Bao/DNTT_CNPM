/**
 * File: frontend/assets/js/account.js
 * Account Page JavaScript - KẾT NỐI VỚI BACKEND API
 */

document.addEventListener('DOMContentLoaded', async function() {
  // Kiểm tra đăng nhập
  if (!requireAuth()) return;
  
  await loadUserProfile();
  setupAvatarPreview();
  setupProfileForm();
  setupPasswordForm();
});

// Load user profile từ API: GET /api/users/{id}
async function loadUserProfile() {
  try {
    const userID = getUserId();
    
    if (!userID) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    
    // Gọi API: GET /api/users/{userID}
    console.log('Loading profile for userID:', userID);
    const user = await userAPI.getById(userID);
    
    console.log('Loaded user:', user);
    
    // Fill form với dữ liệu user
    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('province').value = user.province || '';
    document.getElementById('district').value = user.district || '';
    document.getElementById('ward').value = user.ward || '';
    
  } catch (error) {
    console.error('Error loading profile:', error);
    showToast('Không thể tải thông tin tài khoản', 'error');
  }
}

// Setup avatar preview
function setupAvatarPreview() {
  document.getElementById('avatar').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        document.getElementById('avatarPreview').src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Setup profile form submit - API: PUT /api/users/{id}
function setupProfileForm() {
  document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const saveBtn = document.getElementById('saveProfileBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...';
    
    try {
      const userID = getUserId();
      
      const profileData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        province: document.getElementById('province').value,
        district: document.getElementById('district').value,
        ward: document.getElementById('ward').value
      };
      
      // Gọi API: PUT /api/users/{userID}
      console.log('Updating profile:', profileData);
      await userAPI.updateProfile(userID, profileData);
      
      // Cập nhật localStorage
      const token = getToken();
      const user = getCurrentUser();
      saveAuthData(token, {
        ...user,
        name: profileData.name
      });
      
      showToast('Cập nhật thông tin thành công!', 'success');
      
      // Reload navbar
      updateNavbar();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Không thể cập nhật thông tin', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Lưu thay đổi';
    }
  });
}

// Setup password form submit - API: POST /api/users/{id}/change-password
function setupPasswordForm() {
  document.getElementById('passwordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate
    if (newPassword !== confirmNewPassword) {
      showToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    
    if (newPassword.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
      return;
    }
    
    const changeBtn = document.getElementById('changePasswordBtn');
    changeBtn.disabled = true;
    changeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang cập nhật...';
    
    try {
      const userID = getUserId();
      
      // Gọi API: POST /api/users/{userID}/change-password
      console.log('Changing password for userID:', userID);
      await userAPI.changePassword(userID, {
        oldPassword: oldPassword,
        newPassword: newPassword
      });
      
      showToast('Đổi mật khẩu thành công!', 'success');
      
      // Reset form
      document.getElementById('passwordForm').reset();
      
    } catch (error) {
      console.error('Error changing password:', error);
      showToast(error.message || 'Không thể đổi mật khẩu', 'error');
    } finally {
      changeBtn.disabled = false;
      changeBtn.innerHTML = '<i class="bi bi-shield-check me-2"></i>Đổi mật khẩu';
    }
  });
}