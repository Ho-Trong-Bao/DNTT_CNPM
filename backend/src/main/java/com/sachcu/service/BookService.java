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
        
        return bookRepository.findAll(pageable);
    }
    
    public Optional<Book> getBookById(Integer id) {
        return bookRepository.findById(id);
    }
    
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }
    
    public void deleteBook(Integer id) {
        bookRepository.deleteById(id);
    }
    
    public List<Book> getFeaturedBooks() {
        Pageable topThree = PageRequest.of(0, 3, Sort.by("createdAt").descending());
        return bookRepository.findAll(topThree).getContent();
    }
    
    public List<Book> getBooksByUser(Integer userID) {
        return bookRepository.findByPost_User_UserID(userID);
    }
}