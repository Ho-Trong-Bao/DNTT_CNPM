/**
 * File: frontend/src/pages/BookDetail.js
 * Book Detail Page Component
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { bookAPI } from '../services/apiService';
import BookCard from '../components/BookCard';
import { toast } from 'react-toastify';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookDetail();
    loadRelatedBooks();
  }, [id]);

  const loadBookDetail = async () => {
    setLoading(true);
    try {
      const response = await bookAPI.getById(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book detail:', error);
      toast.error('Không thể tải thông tin sách');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedBooks = async () => {
    try {
      const response = await bookAPI.search({ page: 0, size: 4 });
      setRelatedBooks(response.data.content);
    } catch (error) {
      console.error('Error loading related books:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleContact = () => {
    if (book?.contactInfo) {
      toast.info(`Liên hệ: ${book.contactInfo}`);
    } else {
      toast.warning('Chưa có thông tin liên hệ');
    }
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

  if (!book) {
    return (
      <Container className="py-5 text-center">
        <i className="bi bi-exclamation-triangle fs-1 text-warning"></i>
        <h3 className="mt-3">Không tìm thấy sách</h3>
        <Link to="/search">
          <Button variant="primary" className="mt-3">
            Quay lại tìm kiếm
          </Button>
        </Link>
      </Container>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80';

  return (
    <>
      {/* Book Detail */}
      <Container className="py-5">
        <Row className="g-4 align-items-start">
          {/* Image */}
          <Col md={5}>
            <Card className="border-0 shadow-sm">
              <Card.Img
                src={book.image || defaultImage}
                alt={book.title}
                style={{ height: '500px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = defaultImage; }}
              />
            </Card>
          </Col>

          {/* Details */}
          <Col md={7}>
            <div className="mb-2">
              {book.categories?.map(cat => (
                <Badge key={cat.categoryID} bg="secondary" className="me-2">
                  {cat.categoryName}
                </Badge>
              ))}
            </div>

            <h2 className="mb-3">{book.title}</h2>

            <div className="mb-4">
              <p className="mb-2">
                <strong>Tác giả:</strong> {book.author || 'Không rõ'}
              </p>
              <p className="mb-2">
                <strong>Tình trạng:</strong> {book.bookCondition || 'Cũ'}
              </p>
              <p className="mb-2">
                <strong>Khu vực:</strong> {book.province} {book.district && `- ${book.district}`}
              </p>
              <p className="mb-2">
                <strong>Giá:</strong>{' '}
                <span className="text-danger fw-bold fs-4">
                  {formatPrice(book.price)}
                </span>
              </p>
            </div>

            <div className="mb-4">
              <h5>📝 Mô tả</h5>
              <p className="text-muted">
                {book.description || 'Chưa có mô tả chi tiết cho cuốn sách này.'}
              </p>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <Button variant="primary" size="lg" onClick={handleContact}>
                <i className="bi bi-chat-dots me-2"></i>
                Liên hệ người bán
              </Button>
              <Button variant="outline-secondary" size="lg">
                <i className="bi bi-heart me-2"></i>
                Yêu thích
              </Button>
              <Button variant="outline-danger" size="lg">
                <i className="bi bi-flag me-2"></i>
                Báo cáo
              </Button>
            </div>

            {book.contactInfo && (
              <Card className="mt-4 bg-light">
                <Card.Body>
                  <h6 className="mb-2">
                    <i className="bi bi-telephone-fill text-primary me-2"></i>
                    Thông tin liên hệ
                  </h6>
                  <p className="mb-0">{book.contactInfo}</p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Related Books */}
      <section className="bg-light py-5">
        <Container>
          <h3 className="section-title">📖 Các sách tương tự</h3>
          <Row className="g-4">
            {relatedBooks.slice(0, 4).map((relatedBook) => (
              <Col key={relatedBook.bookID} sm={6} md={3}>
                <BookCard book={relatedBook} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default BookDetail;