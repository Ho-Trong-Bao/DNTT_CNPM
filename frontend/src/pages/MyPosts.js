/**
 * File: frontend/src/pages/MyPosts.js
 * My Posts Page Component
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import { postAPI } from '../services/apiService';
import { getUserId } from '../utils/authUtils';
import { toast } from 'react-toastify';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    setLoading(true);
    try {
      const userID = getUserId();
      const response = await postAPI.getMyPosts(userID);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Không thể tải bài đăng của bạn');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (postID) => {
    setSelectedPostId(postID);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await postAPI.delete(selectedPostId);
      toast.success('Xóa bài đăng thành công!');
      loadMyPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Không thể xóa bài đăng');
    } finally {
      setShowDeleteModal(false);
      setSelectedPostId(null);
    }
  };

  const handleMarkAsSold = async (postID) => {
    try {
      await postAPI.markSold(postID);
      toast.success('Đã đánh dấu sách đã bán!');
      loadMyPosts();
    } catch (error) {
      console.error('Error marking as sold:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Chờ duyệt', icon: 'clock' },
      APPROVED: { variant: 'success', text: 'Đã duyệt', icon: 'check-circle' },
      DECLINED: { variant: 'danger', text: 'Từ chối', icon: 'x-circle' },
      SOLD: { variant: 'secondary', text: 'Đã bán', icon: 'bag-check' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <Badge bg={config.variant}>
        <i className={`bi bi-${config.icon} me-1`}></i>
        {config.text}
      </Badge>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">📚 Bài đăng của tôi</h2>
        <Link to="/post-book">
          <Button variant="primary">
            <i className="bi bi-plus-circle me-2"></i>
            Đăng bài mới
          </Button>
        </Link>
      </div>

      {posts.length > 0 ? (
        <Row className="g-4">
          {posts.map((post) => (
            <Col key={post.postID} sm={6} md={4} lg={3}>
              <Card className="book-card h-100">
                <Card.Img
                  variant="top"
                  src={post.book.image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80'}
                  alt={post.book.title}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    {getStatusBadge(post.status)}
                  </div>

                  <Card.Title>{post.book.title}</Card.Title>
                  
                  <p className="book-meta flex-grow-1">
                    <strong>Tác giả:</strong> {post.book.author || 'Không rõ'}<br />
                    <strong>Tình trạng:</strong> {post.book.bookCondition}<br />
                    <strong>Khu vực:</strong> {post.book.province}
                  </p>

                  <div className="mb-3">
                    <span className="fw-bold text-danger fs-5">
                      {formatPrice(post.book.price)}
                    </span>
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    {post.status === 'APPROVED' && (
                      <Button
                        variant="success"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleMarkAsSold(post.postID)}
                      >
                        <i className="bi bi-bag-check"></i> Đã bán
                      </Button>
                    )}
                    
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(post.postID)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <h4 className="mt-3 text-muted">Bạn chưa có bài đăng nào</h4>
          <p className="text-muted">Bắt đầu đăng bán sách của bạn ngay!</p>
          <Link to="/post-book">
            <Button variant="primary" className="mt-3">
              <i className="bi bi-plus-circle me-2"></i>
              Đăng bài đầu tiên
            </Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <i className="bi bi-trash me-2"></i>
            Xóa bài đăng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyPosts;