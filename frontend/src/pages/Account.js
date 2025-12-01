/**
 * File: frontend/src/pages/Account.js
 * Account Page Component
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { userAPI } from '../services/apiService';
import { getCurrentUser, getUserId, saveAuthData, getToken } from '../utils/authUtils';
import { toast } from 'react-toastify';

function Account() {
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('https://i.pravatar.cc/120');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    province: '',
    district: '',
    ward: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const provinces = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userID = getUserId();
      const response = await userAPI.getById(userID);
      const userData = response.data;

      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        province: userData.province || '',
        district: userData.district || '',
        ward: userData.ward || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Không thể tải thông tin tài khoản');
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setAvatarPreview(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userID = getUserId();
      const response = await userAPI.updateProfile(userID, profileData);

      // Cập nhật localStorage
      const token = getToken();
      saveAuthData(token, {
        userId: userID,
        email: profileData.email,
        name: profileData.name
      });

      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      const userID = getUserId();
      await userAPI.changePassword(userID, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMsg = error.response?.data?.message || 'Không thể đổi mật khẩu';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h2 className="section-title mb-4">👤 Thông tin tài khoản</h2>

            <Tabs defaultActiveKey="profile" className="mb-4">
              {/* Tab: Profile */}
              <Tab eventKey="profile" title="Hồ sơ">
                <Form onSubmit={handleProfileSubmit}>
                  {/* Avatar */}
                  <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="rounded-circle shadow"
                      width="120"
                      height="120"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <Form.Label className="fw-semibold mb-1">Ảnh đại diện</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ maxWidth: '250px' }}
                      />
                      <Form.Text className="text-muted">
                        Chọn ảnh dưới 2MB
                      </Form.Text>
                    </div>
                  </div>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Họ và tên</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          required
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Tỉnh/Thành</Form.Label>
                        <Form.Select
                          name="province"
                          value={profileData.province}
                          onChange={handleProfileChange}
                        >
                          <option value="">Chọn tỉnh/thành</option>
                          {provinces.map(province => (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Quận/Huyện</Form.Label>
                        <Form.Control
                          type="text"
                          name="district"
                          placeholder="Nhập quận/huyện"
                          value={profileData.district}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Phường/Xã</Form.Label>
                        <Form.Control
                          type="text"
                          name="ward"
                          placeholder="Nhập phường/xã"
                          value={profileData.ward}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-center mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="px-5"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Lưu thay đổi
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Tab>

              {/* Tab: Change Password */}
              <Tab eventKey="password" title="Đổi mật khẩu">
                <Form onSubmit={handlePasswordSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Mật khẩu hiện tại</Form.Label>
                    <Form.Control
                      type="password"
                      name="oldPassword"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      placeholder="Nhập mật khẩu mới"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                    <Form.Text className="text-muted">
                      Mật khẩu phải có ít nhất 6 ký tự
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>

                  <div className="text-center mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="px-5"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          Đổi mật khẩu
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Tab>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Account;