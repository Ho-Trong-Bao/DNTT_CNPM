/**
 * File: frontend/src/pages/PostBook.js
 * Post Book Page Component
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { postAPI, categoryAPI } from '../services/apiService';
import { getUserId } from '../utils/authUtils';
import { toast } from 'react-toastify';

function PostBook() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    bookCondition: 'Cũ nhẹ (90%)',
    price: '',
    description: '',
    categoryIDs: [],
    province: '',
    district: '',
    contactInfo: '',
    postDescription: ''
  });

  const provinces = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
  const conditions = ['Mới', 'Cũ nhẹ (90%)', 'Cũ (70%)', 'Rách nhẹ'];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const categoryID = parseInt(value);
      setFormData(prev => ({
        ...prev,
        categoryIDs: checked
          ? [...prev.categoryIDs, categoryID]
          : prev.categoryIDs.filter(id => id !== categoryID)
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImagePreview(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userID = getUserId();

      // Tạo object Book
      const bookData = {
        title: formData.title,
        author: formData.author,
        bookCondition: formData.bookCondition,
        price: parseFloat(formData.price),
        description: formData.description,
        province: formData.province,
        district: formData.district,
        contactInfo: formData.contactInfo,
        image: imagePreview
      };

      // Tạo object Post
      const postData = {
        book: bookData,
        description: formData.postDescription
      };

      await postAPI.create(postData, userID);
      
      toast.success('Đăng bài thành công! Vui lòng chờ admin duyệt.');
      navigate('/my-posts');
    } catch (error) {
      console.error('Error posting book:', error);
      toast.error('Đăng bài thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="section-title mb-4">📝 Đăng bán sách của bạn</h2>

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          {/* Image Preview */}
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Img
                variant="top"
                src={imagePreview}
                alt="Preview"
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Form.Group>
                  <Form.Label className="fw-semibold">Ảnh bìa sách</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn ảnh rõ nét để thu hút người mua
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Book Information */}
          <Col md={8}>
            <Card className="border-0 shadow-sm p-4">
              <h5 className="mb-3">Thông tin sách</h5>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Tên sách *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Nhập tên sách..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Tác giả *</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  placeholder="Tên tác giả..."
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Tình trạng</Form.Label>
                    <Form.Select
                      name="bookCondition"
                      value={formData.bookCondition}
                      onChange={handleChange}
                    >
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Giá bán (VNĐ) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      placeholder="VD: 50000"
                      value={formData.price}
                      onChange={handleChange}
                      min="1000"
                      step="1000"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Thể loại</Form.Label>
                <div>
                  {categories.map(category => (
                    <Form.Check
                      key={category.categoryID}
                      inline
                      type="checkbox"
                      label={category.categoryName}
                      value={category.categoryID}
                      checked={formData.categoryIDs.includes(category.categoryID)}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Tỉnh/Thành phố</Form.Label>
                    <Form.Select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
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

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Quận/Huyện</Form.Label>
                    <Form.Control
                      type="text"
                      name="district"
                      placeholder="Nhập quận/huyện"
                      value={formData.district}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Thông tin liên hệ</Form.Label>
                <Form.Control
                  type="text"
                  name="contactInfo"
                  placeholder="VD: 0901234567 hoặc email@gmail.com"
                  value={formData.contactInfo}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Mô tả chi tiết *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Giới thiệu về sách, lý do bán..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="text-end mt-4">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang đăng...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-upload me-2"></i>
                      Đăng bài
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default PostBook;