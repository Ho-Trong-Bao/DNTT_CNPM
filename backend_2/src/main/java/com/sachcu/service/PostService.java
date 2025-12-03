package com.sachcu.service;

import com.sachcu.dto.request.CreatePostRequest;
import com.sachcu.dto.request.UpdatePostRequest;
import com.sachcu.dto.response.PostResponse;
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
 * - POST /posts - Đăng bài bán sách mới (Gộp Book & Post)
 * - GET /posts/{postID} - Xem chi tiết bài đăng
 * - GET /users/{userID}/posts - Xem bài đăng của User
 * - PUT /posts/{postID} - Sửa bài đăng
 * - DELETE /posts/{postID} - Xóa bài đăng
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
     * Lấy tất cả bài đăng của một User
     */
    public List<PostResponse> getUserPosts(Integer userID) {
        List<Post> posts = postRepository.findByUser_UserID(userID);
        return posts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy chi tiết bài đăng
     */
    public PostResponse getPostById(Integer postID) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new ResourceNotFoundException("Bài đăng không tồn tại"));
        return convertToResponse(post);
    }
    
    /**
     * Cập nhật bài đăng (chỉ User sở hữu mới được cập nhật)
     */
    @Transactional
    public PostResponse updatePost(Integer postID, Integer userID, UpdatePostRequest request) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new ResourceNotFoundException("Bài đăng không tồn tại"));
        
        // Kiểm tra quyền sở hữu
        if (!post.getUser().getUserID().equals(userID)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa bài đăng này");
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
        }
        
        Post updatedPost = postRepository.save(post);
        return convertToResponse(updatedPost);
    }
    
    /**
     * Xóa bài đăng (chỉ User sở hữu mới được xóa)
     */
    @Transactional
    public void deletePost(Integer postID, Integer userID) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new ResourceNotFoundException("Bài đăng không tồn tại"));
        
        // Kiểm tra quyền sở hữu
        if (!post.getUser().getUserID().equals(userID)) {
            throw new RuntimeException("Bạn không có quyền xóa bài đăng này");
        }
        
        postRepository.delete(post);
        // Book sẽ tự động xóa do ON DELETE CASCADE
    }
    
    /**
     * Convert Post entity sang PostResponse
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
}