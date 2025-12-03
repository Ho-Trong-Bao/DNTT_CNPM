package com.sachcu.service;

import com.sachcu.dto.request.CreatePostRequest;
import com.sachcu.dto.request.UpdatePostRequest;
import com.sachcu.dto.response.PostResponse;
import com.sachcu.dto.response.BookDetailResponse;
import com.sachcu.entity.*;
import com.sachcu.exception.ResourceNotFoundException;
import com.sachcu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service: PostService
 * Mô tả: Xử lý logic liên quan đến Post (Bài đăng bán sách)
 * APIs:
 * - POST /posts - Đăng bài bán sách mới (User)
 * - GET /posts/{postID} - Xem chi tiết bài đăng (Public, ẩn thông tin nếu chưa login)
 * - GET /my-posts - Xem bài đăng của chính User (User)
 * - PUT /my-posts/{postID} - Sửa bài đăng của chính User (User)
 * - DELETE /my-posts/{postID} - Xóa bài đăng của chính User (User)
 */
@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    
    /**
     * Tạo bài đăng mới (Transaction: tạo Book và Post cùng lúc)
     */
    @Transactional
    public PostResponse createPost(Integer userID, CreatePostRequest request) {
        // Lấy thông tin User
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));
        
        // Lấy Category
        Category category = categoryRepository.findById(request.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category không tồn tại"));
        
        // Tạo Book
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setBookCondition(request.getBookCondition());
        book.setPrice(request.getPrice());
        book.setDescription(request.getPostDescription());
        book.setImage(request.getImage());
        book.setContactInfo(request.getContactInfo());
        book.setProvince(request.getProvince());
        book.setDistrict(request.getDistrict());
        
        Book savedBook = bookRepository.save(book);
        
        // Tạo BookCategory
        BookCategory bookCategory = new BookCategory();
        BookCategory.BookCategoryId id = new BookCategory.BookCategoryId();
        id.setBookID(savedBook.getBookID());
        id.setCategoryID(category.getCategoryID());
        bookCategory.setId(id);
        bookCategory.setBook(savedBook);
        bookCategory.setCategory(category);
        
        savedBook.getBookCategories().add(bookCategory);
        
        // Tạo Post
        Post post = new Post();
        post.setUser(user);
        post.setBook(savedBook);
        post.setDescription(request.getPostDescription());
        post.setStatus(Post.PostStatus.PENDING); // Mặc định PENDING
        
        Post savedPost = postRepository.save(post);
        
        return convertToResponse(savedPost);
    }
    
    /**
     * Xem chi tiết bài đăng (Public)
     * Note: Ẩn thông tin liên hệ và người đăng nếu chưa login
     */
    public BookDetailResponse getPostDetail(Integer postID, boolean isAuthenticated) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new ResourceNotFoundException("Bài đăng không tồn tại"));
        
        // Kiểm tra bài đăng đã được duyệt chưa
        if (post.getStatus() != Post.PostStatus.APPROVED) {
            throw new ResourceNotFoundException("Bài đăng chưa được duyệt");
        }
        
        return convertToDetailResponse(post, isAuthenticated);
    }
    
    /**
     * Lấy tất cả bài đăng của chính User (My Posts)
     */
    public List<BookDetailResponse> getMyPosts(Integer userID) {
        List<Post> posts = postRepository.findByUser_UserID(userID);
        
        // Hiển thị đầy đủ thông tin vì là bài đăng của chính user
        return posts.stream()
                .map(post -> convertToDetailResponse(post, true))
                .collect(Collectors.toList());
    }
    
    /**
     * Cập nhật bài đăng (chỉ User sở hữu mới được cập nhật)
     */
    @Transactional
    public BookDetailResponse updateMyPost(Integer postID, Integer userID, UpdatePostRequest request) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new ResourceNotFoundException("Bài đăng không tồn tại"));
        
        // Kiểm tra quyền sở hữu
        if (!post.getUser().getUserID().equals(userID)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa bài đăng này");
        }
        
        // Không cho phép sửa nếu bài đã được duyệt hoặc đã bán
        if (post.getStatus() == Post.PostStatus.SOLD) {
            throw new RuntimeException("Không thể sửa bài đăng đã bán");
        }
        
        // Cập nhật thông tin Book
        Book book = post.getBook();
        if (request.getTitle() != null) book.setTitle(request.getTitle());
        if (request.getAuthor() != null) book.setAuthor(request.getAuthor());
        if (request.getBookCondition() != null) book.setBookCondition(request.getBookCondition());
        if (request.getPrice() != null) book.setPrice(request.getPrice());
        if (request.getImage() != null) book.setImage(request.getImage());
        if (request.getContactInfo() != null) book.setContactInfo(request.getContactInfo());
        if (request.getProvince() != null) book.setProvince(request.getProvince());
        if (request.getDistrict() != null) book.setDistrict(request.getDistrict());
        
        bookRepository.save(book);
        
        // Cập nhật mô tả Post
        if (request.getPostDescription() != null) {
            post.setDescription(request.getPostDescription());
            book.setDescription(request.getPostDescription());
        }
        
        // Reset trạng thái về PENDING nếu bài bị DECLINED
        if (post.getStatus() == Post.PostStatus.DECLINED) {
            post.setStatus(Post.PostStatus.PENDING);
        }
        
        Post updatedPost = postRepository.save(post);
        return convertToDetailResponse(updatedPost, true);
    }
    
    /**
     * Xóa bài đăng (chỉ User sở hữu mới được xóa)
     */
    @Transactional
    public void deleteMyPost(Integer postID, Integer userID) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new ResourceNotFoundException("Bài đăng không tồn tại"));
        
        // Kiểm tra quyền sở hữu
        if (!post.getUser().getUserID().equals(userID)) {
            throw new RuntimeException("Bạn không có quyền xóa bài đăng này");
        }
        
        // Không cho phép xóa nếu bài đã được duyệt và đang hiển thị
        if (post.getStatus() == Post.PostStatus.APPROVED) {
            throw new RuntimeException("Không thể xóa bài đăng đã được duyệt. Vui lòng liên hệ Admin");
        }
        
        postRepository.delete(post);
        // Book sẽ tự động xóa do ON DELETE CASCADE
    }
    
    /**
     * Đánh dấu bài đăng đã bán
     */
    @Transactional
    public void markAsSold(Integer postID, Integer userID) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new ResourceNotFoundException("Bài đăng không tồn tại"));
        
        // Kiểm tra quyền sở hữu
        if (!post.getUser().getUserID().equals(userID)) {
            throw new RuntimeException("Bạn không có quyền cập nhật bài đăng này");
        }
        
        post.setStatus(Post.PostStatus.SOLD);
        postRepository.save(post);
    }
    
    /**
     * Convert Post entity sang PostResponse (dùng cho danh sách)
     */
    private PostResponse convertToResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setPostID(post.getPostID());
        response.setPostStatus(post.getStatus().name());
        response.setCreatedAt(post.getCreatedAt());
        
        if (post.getBook() != null) {
            response.setBookID(post.getBook().getBookID());
            response.setTitle(post.getBook().getTitle());
            response.setAuthor(post.getBook().getAuthor());
            response.setPrice(post.getBook().getPrice());
            response.setImage(post.getBook().getImage());
            response.setProvince(post.getBook().getProvince());
            response.setDistrict(post.getBook().getDistrict());
        }
        
        return response;
    }
    
    /**
     * Convert Post entity sang BookDetailResponse (dùng cho chi tiết)
     */
    private BookDetailResponse convertToDetailResponse(Post post, boolean isAuthenticated) {
        BookDetailResponse response = new BookDetailResponse();
        Book book = post.getBook();
        
        // Book info
        response.setBookID(book.getBookID());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setBookCondition(book.getBookCondition());
        response.setPrice(book.getPrice());
        response.setDescription(book.getDescription());
        response.setImage(book.getImage());
        response.setProvince(book.getProvince());
        response.setDistrict(book.getDistrict());
        response.setCreatedAt(book.getCreatedAt());
        
        // ẨN thông tin liên hệ nếu chưa đăng nhập
        if (isAuthenticated) {
            response.setContactInfo(book.getContactInfo());
        } else {
            response.setContactInfo("🔒 Vui lòng đăng nhập để xem thông tin liên hệ");
        }
        
        // Post info
        response.setPostID(post.getPostID());
        response.setPostDescription(post.getDescription());
        response.setPostStatus(post.getStatus().name());
        
        // User info - ẨN nếu chưa đăng nhập
        if (isAuthenticated && post.getUser() != null) {
            response.setUserID(post.getUser().getUserID());
            response.setUserName(post.getUser().getName());
        } else {
            response.setUserID(null);
            response.setUserName("🔒 Đăng nhập để xem");
        }
        
        // Category
        if (!book.getBookCategories().isEmpty()) {
            BookCategory bookCategory = book.getBookCategories().get(0);
            response.setCategoryID(bookCategory.getCategory().getCategoryID());
            response.setCategoryName(bookCategory.getCategory().getCategoryName());
        }
        
        return response;
    }
}