package com.sachcu.service;

import com.sachcu.dto.response.BookDetailResponse;
import com.sachcu.entity.Book;
import com.sachcu.entity.BookCategory;
import com.sachcu.entity.Post;
import com.sachcu.exception.ResourceNotFoundException;
import com.sachcu.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service: BookService
 * Mô tả: Xử lý logic liên quan đến Book
 * APIs:
 * - GET /books - Lấy danh sách tất cả sách
 * - GET /books/{bookID} - Xem chi tiết sách
 * - GET /books/search - Tìm kiếm và lọc sách
 */
@Service
@RequiredArgsConstructor
public class BookService {
    
    private final BookRepository bookRepository;
    
    /**
     * Lấy tất cả sách đã được duyệt
     */
    public List<BookDetailResponse> getAllApprovedBooks() {
        List<Book> books = bookRepository.findAll();
        
        return books.stream()
                .filter(book -> book.getPost() != null && 
                               book.getPost().getStatus() == Post.PostStatus.APPROVED)
                .map(this::convertToDetailResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy chi tiết sách theo ID
     * @param bookID ID của sách
     * @param isAuthenticated User đã đăng nhập hay chưa
     */
    public BookDetailResponse getBookDetail(Integer bookID, boolean isAuthenticated) {
        Book book = bookRepository.findById(bookID)
                .orElseThrow(() -> new ResourceNotFoundException("Sách không tồn tại với ID: " + bookID));
        
        BookDetailResponse response = convertToDetailResponse(book);
        
        // Ẩn thông tin liên hệ nếu chưa đăng nhập
        if (!isAuthenticated) {
            response.setContactInfo("Vui lòng đăng nhập để xem thông tin liên hệ");
        }
        
        return response;
    }
    
    /**
     * Tìm kiếm sách theo nhiều tiêu chí
     */
    public List<BookDetailResponse> searchBooks(String title, String author, 
                                                String province, String district) {
        List<Book> books = bookRepository.searchBooks(title, author, province, district);
        
        return books.stream()
                .filter(book -> book.getPost() != null && 
                               book.getPost().getStatus() == Post.PostStatus.APPROVED)
                .map(this::convertToDetailResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Tìm sách theo tỉnh/thành phố
     */
    public List<BookDetailResponse> getBooksByProvince(String province) {
        List<Book> books = bookRepository.findByProvince(province);
        
        return books.stream()
                .filter(book -> book.getPost() != null && 
                               book.getPost().getStatus() == Post.PostStatus.APPROVED)
                .map(this::convertToDetailResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert Book entity sang BookDetailResponse
     */
    private BookDetailResponse convertToDetailResponse(Book book) {
        BookDetailResponse response = new BookDetailResponse();
        
        // Book info
        response.setBookID(book.getBookID());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setBookCondition(book.getBookCondition());
        response.setPrice(book.getPrice());
        response.setDescription(book.getDescription());
        response.setImage(book.getImage());
        response.setContactInfo(book.getContactInfo());
        response.setProvince(book.getProvince());
        response.setDistrict(book.getDistrict());
        response.setCreatedAt(book.getCreatedAt());
        
        // Post info
        if (book.getPost() != null) {
            response.setPostID(book.getPost().getPostID());
            response.setPostDescription(book.getPost().getDescription());
            response.setPostStatus(book.getPost().getStatus().name());
            
            // User info
            if (book.getPost().getUser() != null) {
                response.setUserID(book.getPost().getUser().getUserID());
                response.setUserName(book.getPost().getUser().getName());
            }
        }
        
        // Category info (lấy category đầu tiên)
        if (!book.getBookCategories().isEmpty()) {
            BookCategory bookCategory = book.getBookCategories().get(0);
            response.setCategoryID(bookCategory.getCategory().getCategoryID());
            response.setCategoryName(bookCategory.getCategory().getCategoryName());
        }
        
        return response;
    }
}