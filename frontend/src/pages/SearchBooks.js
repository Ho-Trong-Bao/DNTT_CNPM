/**
 * File: frontend/src/pages/SearchBooks.js
 * Search Books Page Component
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { bookAPI, categoryAPI } from '../services/apiService';
import BookCard from '../components/BookCard';
import { toast } from 'react-toastify';

function SearchBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    province: '',
    categoryID: '',
    minPrice: '',
    maxPrice: ''
  });

  const provinces = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

  useEffect(() => {
    loadCategories();
    searchBooks();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const searchBooks = async (page = 0) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        size: 12,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };

      // Loại bỏ các filter rỗng
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

      const response = await bookAPI.search(params);
      setBooks(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error searching books:', error);
      toast.error('Không thể tìm kiếm sách');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(0);
  };

  const handlePageChange = (page) => {
    searchBooks(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFilters({
      search: '',
      province: '',
      categoryID: '',
      minPrice: '',
      maxPrice: ''
    });
    setTimeout(() => searchBooks(0), 100);
  };

  return (
    <>
      {/* Search Header */}
      <section className="search-section">
        <Container>
          <h2 className="section-title mb-4">🔍 Tìm kiếm sách quanh bạn</h2>
          
          <Form onSubmit={handleSearch}>
            <Row className="g-3 justify-content-center">
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Tên sách, tác giả..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={2}>
                <Form.Select
                  name="categoryID"
                  value={filters.categoryID}
                  onChange={handleFilterChange}
                >
                  <option value="">Thể loại</option>
                  {categories.map(cat => (
                    <option key={cat.categoryID} value={cat.categoryID}>
                      {cat.categoryName}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Select
                  name="province"
                  value={filters.province}
                  onChange={handleFilterChange}
                >
                  <option value="">Khu vực</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Control
                  type="number"
                  name="minPrice"
                  placeholder="Giá từ"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </Col>

              <Col md={2}>
                <Form.Control
                  type="number"
                  name="maxPrice"
                  placeholder="Giá đến"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </Col>

              <Col md={1}>
                <Button variant="primary" type="submit" className="w-100">
                  <i className="bi bi-search"></i>
                </Button>
              </Col>
            </Row>

            <div className="text-center mt-3">
              <Button variant="outline-secondary" size="sm" onClick={handleReset}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Đặt lại
              </Button>
            </div>
          </Form>
        </Container>
      </section>

      {/* Results */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            📚 Kết quả tìm kiếm
            {!loading && <span className="text-muted ms-2">({books.length} sách)</span>}
          </h3>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : books.length > 0 ? (
          <>
            <Row className="g-4">
              {books.map((book) => (
                <Col key={book.bookID} sm={6} md={4} lg={3}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination>
                  <Pagination.Prev
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index}
                      active={index === currentPage}
                      onClick={() => handlePageChange(index)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  
                  <Pagination.Next
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <h4 className="mt-3 text-muted">Không tìm thấy sách nào</h4>
            <p className="text-muted">Thử thay đổi điều kiện tìm kiếm</p>
          </div>
        )}
      </Container>
    </>
  );
}

export default SearchBooks;