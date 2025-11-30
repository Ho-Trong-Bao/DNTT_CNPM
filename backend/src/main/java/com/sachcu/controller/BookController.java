/**
 * File: backend/src/main/java/com/sachcu/controller/BookController.java
 * Book Controller - API quản lý sách
 */
package com.sachcu.controller;

import com.sachcu.model.Book;
import com.sachcu.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {
    
    private final BookService bookService;
    
    /**
     * GET /api/books
     * Lấy danh sách sách với filter và pagination
     */
    @GetMapping
    public ResponseEntity<Page<Book>> searchBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) Integer categoryID,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Book> books = bookService.searchBooks(
            search, province, categoryID, minPrice, maxPrice, pageable
        );
        
        return ResponseEntity.ok(books);
    }
    
    /**
     * GET /api/books/{id}
     * Lấy chi tiết sách theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Integer id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * GET /api/books/featured
     * Lấy 3 sách nổi bật
     */
    @GetMapping("/featured")
    public ResponseEntity<List<Book>> getFeaturedBooks() {
        List<Book> books = bookService.getFeaturedBooks();
        return ResponseEntity.ok(books);
    }
    
    /**
     * GET /api/books/user/{userID}
     * Lấy tất cả sách của một user
     */
    @GetMapping("/user/{userID}")
    public ResponseEntity<List<Book>> getBooksByUser(@PathVariable Integer userID) {
        List<Book> books = bookService.getBooksByUser(userID);
        return ResponseEntity.ok(books);
    }
    
    /**
     * POST /api/books
     * Tạo sách mới
     */
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book savedBook = bookService.saveBook(book);
        return ResponseEntity.ok(savedBook);
    }
    
    /**
     * PUT /api/books/{id}
     * Cập nhật thông tin sách
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Integer id, 
            @RequestBody Book book) {
        book.setBookID(id);
        Book updatedBook = bookService.saveBook(book);
        return ResponseEntity.ok(updatedBook);
    }
    
    /**
     * DELETE /api/books/{id}
     * Xóa sách
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}