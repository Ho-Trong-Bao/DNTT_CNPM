package com.sachcu.controller;

import com.sachcu.dto.response.BookDetailResponse;
import com.sachcu.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller: BookController
 * Mô tả: Xử lý các API liên quan đến Book (Không cần đăng nhập - Public)
 * 
 * APIs:
 * - GET /books - Lấy danh sách tất cả sách đã duyệt (Public)
 * - GET /books/{bookID} - Xem chi tiết sách (Public, ẩn contact nếu chưa đăng nhập)
 * - GET /books/search - Tìm kiếm và lọc sách (Public)
 * - GET /books/province/{province} - Lấy sách theo tỉnh/thành (Public)
 */
@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookController {
    
    private final BookService bookService;
    
    /**
     * API: Lấy danh sách tất cả sách đã duyệt
     * Method: GET
     * Endpoint: /books
     * Auth: KHÔNG CẦN (Public)
     */
    @GetMapping
    public ResponseEntity<?> getAllBooks() {
        try {
            List<BookDetailResponse> books = bookService.getAllApprovedBooks();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * API: Xem chi tiết sách
     * Method: GET
     * Endpoint: /books/{bookID}
     * Auth: KHÔNG CẦN (Public)
     * Note: Nếu chưa đăng nhập thì ẩn thông tin liên hệ
     */
    @GetMapping("/{bookID}")
    public ResponseEntity<?> getBookDetail(@PathVariable Integer bookID,
                                          @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            // Kiểm tra user đã đăng nhập hay chưa
            boolean isAuthenticated = (token != null && token.startsWith("Bearer "));
            
            BookDetailResponse book = bookService.getBookDetail(bookID, isAuthenticated);
            return ResponseEntity.ok(book);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * API: Tìm kiếm sách theo nhiều tiêu chí
     * Method: GET
     * Endpoint: /books/search?title=xxx&author=xxx&province=xxx&district=xxx
     * Auth: KHÔNG CẦN (Public)
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(@RequestParam(required = false) String title,
                                        @RequestParam(required = false) String author,
                                        @RequestParam(required = false) String province,
                                        @RequestParam(required = false) String district) {
        try {
            List<BookDetailResponse> books = bookService.searchBooks(title, author, province, district);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * API: Lấy sách theo tỉnh/thành phố
     * Method: GET
     * Endpoint: /books/province/{province}
     * Auth: KHÔNG CẦN (Public)
     */
    @GetMapping("/province/{province}")
    public ResponseEntity<?> getBooksByProvince(@PathVariable String province) {
        try {
            List<BookDetailResponse> books = bookService.getBooksByProvince(province);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}