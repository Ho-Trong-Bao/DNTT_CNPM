/**
 * File: frontend/src/components/BookCard.js
 * Book Card Component - Hiển thị thẻ sách
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function BookCard({ book }) {
  const defaultImage = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <Card className="book-card h-100">
      <Card.Img 
        variant="top" 
        src={book.image || defaultImage}
        alt={book.title}
        onError={(e) => { e.target.src = defaultImage; }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{book.title}</Card.Title>
        <p className="book-meta flex-grow-1">
          <strong>Tác giả:</strong> {book.author || 'Không rõ'}<br />
          <strong>Tình trạng:</strong> {book.bookCondition || 'Cũ'}<br />
          <strong>Khu vực:</strong> {book.province || 'Không rõ'}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fw-bold text-danger fs-5">
            {formatPrice(book.price)}
          </span>
          <Link to={`/book/${book.bookID}`}>
            <Button variant="primary" size="sm">
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BookCard;