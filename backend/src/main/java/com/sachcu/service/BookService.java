/**
 * File: backend/src/main/java/com/sachcu/service/BookService.java
 * Book Service - Xử lý logic nghiệp vụ liên quan đến sách
 */
package com.sachcu.service;

import com.sachcu.model.Book;
import com.sachcu.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BookService {
    
    private final BookRepository bookRepository;
    
    /**
     * Tìm kiếm sách với nhiều filter
     */
    public Page<Book> searchBooks(
            String search,
            String province,
            Integer categoryID,
            Double minPrice,
            Double maxPrice,
            Pageable pageable) {
        
        BigDecimal min = minPrice != null ? BigDecimal.valueOf(minPrice) : null;
        BigDecimal max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : null;
        
        if (search != null || province != null || categoryID != null || min != null || max != null) {
            return bookRepository.searchBooksWithFilters(
                search, province, categoryID, min, max, pageable
            );
        }
        
        return bookRepository.findLatestApprovedBooks(pageable);
    }
    
    /**
     * Lấy book theo ID
     */
    public Optional<Book> getBookById(Integer id) {
        return bookRepository.findById(id);
    }
    
    /**
     * Tạo hoặc cập nhật book
     */
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }
    
    /**
     * Xóa book
     */
    public void deleteBook(Integer id) {
        bookRepository.deleteById(id);
    }
    
    /**
     * Lấy danh sách sách nổi bật (3 sách mới nhất)
     */
    public List<Book> getFeaturedBooks() {
        Pageable topThree = PageRequest.of(0, 3, Sort.by("createdAt").descending());
        return bookRepository.findLatestApprovedBooks(topThree).getContent();
    }
    
    /**
     * Lấy tất cả sách của một user
     */
    public List<Book> getBooksByUser(Integer userID) {
        return bookRepository.findByUserId(userID);
    }
    
    /**
     * Lấy tất cả sách
     */
    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }
}