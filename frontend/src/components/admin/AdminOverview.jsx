/**
 * File: frontend/src/components/admin/AdminOverview.jsx
 * Admin Overview Dashboard
 */
import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { userAPI, postAPI, bookAPI, categoryAPI } from '../../services/api';
import { toast } from 'react-toastify';

function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    pendingPosts: 0,
    totalBooks: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [usersRes, postsRes, booksRes, categoriesRes] = await Promise.all([
        userAPI.getAll(),
        postAPI.getPending(),
        bookAPI.search({ page: 0, size: 1 }),
        categoryAPI.getAll(),
      ]);

      setStats({
        totalUsers: usersRes.data.length || 0,
        totalPosts: booksRes.data.totalElements || 0,
        pendingPosts: postsRes.data.length || 0,
        totalBooks: booksRes.data.totalElements || 0,
        totalCategories: categoriesRes.data.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">📊 Tổng quan hệ thống</h2>
      
      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <i className="bi bi-people-fill display-4 text-primary mb-3"></i>
              <h3 className="mb-0">{stats.totalUsers}</h3>
              <p className="text-muted">Người dùng</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <i className="bi bi-book-fill display-4 text-success mb-3"></i>
              <h3 className="mb-0">{stats.totalBooks}</h3>
              <p className="text-muted">Sách</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <i className="bi bi-file-earmark-text-fill display-4 text-info mb-3"></i>
              <h3 className="mb-0">{stats.totalPosts}</h3>
              <p className="text-muted">Bài đăng</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <i className="bi bi-clock-fill display-4 text-warning mb-3"></i>
              <h3 className="mb-0">{stats.pendingPosts}</h3>
              <p className="text-muted">Bài đăng chờ duyệt</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <i className="bi bi-tags-fill display-4 text-danger mb-3"></i>
              <h3 className="mb-0">{stats.totalCategories}</h3>
              <p className="text-muted">Thể loại</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminOverview;