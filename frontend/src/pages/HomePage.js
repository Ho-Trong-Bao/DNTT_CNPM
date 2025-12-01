/**
 * File: frontend/src/pages/HomePage.js
 * Home Page Component
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { bookAPI } from '../services/apiService';
import BookCard from '../components/BookCard';
import { toast } from 'react-toastify';

function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedBooks();
  }, []);

  const loadFeaturedBooks = async () => {
    try {
      const response = await bookAPI.getFeatured();
      setFeaturedBooks(response.data);
    } catch (error) {
      console.error('Error loading featured books:', error);
      toast.error('Không thể tải sách nổi bật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="hero-banner">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1>Khám phá và chia sẻ sách cũ quanh bạn</h1>
              <p>
                Góp phần lan tỏa tri thức, giữ gìn ký ức — mỗi quyển sách đều có câu chuyện riêng.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/search">
                  <Button variant="primary" size="lg">
                    <i className="bi bi-search me-2"></i>
                    Tìm sách ngay
                  </Button>
                </Link>
                <Link to="/post-book">
                  <Button variant="outline-secondary" size="lg">
                    <i className="bi bi-pencil-square me-2"></i>
                    Đăng bán sách
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Books */}
      <Container className="my-5 py-4">
        <h2 className="section-title">📚 Sách nổi bật</h2>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : featuredBooks.length > 0 ? (
          <Row className="g-4">
            {featuredBooks.map((book) => (
              <Col key={book.bookID} md={6} lg={4}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-book fs-1 text-muted"></i>
            <p className="mt-3 text-muted">Chưa có sách nổi bật nào</p>
          </div>
        )}
      </Container>

      {/* Search Prompt Section */}
      <section className="bg-white py-5">
        <Container className="text-center">
          <h2 className="section-title">🔍 Tìm kiếm sách quanh bạn</h2>
          <p className="lead mb-4">
            Hàng ngàn đầu sách đang chờ bạn khám phá từ những người yêu sách khác.
          </p>
          <Link to="/search">
            <Button variant="primary" size="lg">
              <i className="bi bi-search me-2"></i>
              Bắt đầu tìm kiếm
            </Button>
          </Link>
        </Container>
      </section>

      {/* Stats Section */}
      <Container className="my-5 py-4">
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <div className="p-4">
              <i className="bi bi-book-fill fs-1 text-primary mb-3"></i>
              <h3>1000+</h3>
              <p className="text-muted">Đầu sách</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="p-4">
              <i className="bi bi-people-fill fs-1 text-primary mb-3"></i>
              <h3>500+</h3>
              <p className="text-muted">Người dùng</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="p-4">
              <i className="bi bi-geo-alt-fill fs-1 text-primary mb-3"></i>
              <h3>63</h3>
              <p className="text-muted">Tỉnh thành</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomePage;