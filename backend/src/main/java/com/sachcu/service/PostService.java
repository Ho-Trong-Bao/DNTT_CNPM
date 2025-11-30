/**
 * File: backend/src/main/java/com/sachcu/service/PostService.java
 * Post Service - Xử lý logic nghiệp vụ liên quan đến bài đăng
 */
package com.sachcu.service;

import com.sachcu.model.Post;
import com.sachcu.model.User;
import com.sachcu.model.Book;
import com.sachcu.repository.PostRepository;
import com.sachcu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    /**
     * Tạo bài đăng mới
     */
    public Post createPost(Post post, Integer userID) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        
        post.setUser(user);
        post.setStatus(Post.PostStatus.PENDING); // Mặc định là pending
        
        return postRepository.save(post);
    }
    
    /**
     * Cập nhật bài đăng
     */
    public Post updatePost(Integer postID, Post updatedPost) {
        Post existingPost = postRepository.findById(postID)
                .orElseThrow(() -> new RuntimeException("Bài đăng không tồn tại"));
        
        // Chỉ cho phép update description và book info
        if (updatedPost.getDescription() != null) {
            existingPost.setDescription(updatedPost.getDescription());
        }
        
        if (updatedPost.getBook() != null) {
            Book book = existingPost.getBook();
            Book updatedBook = updatedPost.getBook();
            
            if (updatedBook.getTitle() != null) book.setTitle(updatedBook.getTitle());
            if (updatedBook.getAuthor() != null) book.setAuthor(updatedBook.getAuthor());
            if (updatedBook.getBookCondition() != null) book.setBookCondition(updatedBook.getBookCondition());
            if (updatedBook.getPrice() != null) book.setPrice(updatedBook.getPrice());
            if (updatedBook.getDescription() != null) book.setDescription(updatedBook.getDescription());
            if (updatedBook.getProvince() != null) book.setProvince(updatedBook.getProvince());
            if (updatedBook.getDistrict() != null) book.setDistrict(updatedBook.getDistrict());
        }
        
        return postRepository.save(existingPost);
    }
    
    /**
     * Xóa bài đăng
     */
    public void deletePost(Integer postID) {
        postRepository.deleteById(postID);
    }
    
    /**
     * Lấy tất cả bài đăng của user
     */
    public List<Post> getMyPosts(Integer userID) {
        return postRepository.findByUser_UserID(userID);
    }
    
    /**
     * Lấy bài đăng theo ID
     */
    public Optional<Post> getPostById(Integer postID) {
        return postRepository.findById(postID);
    }
    
    /**
     * Admin duyệt bài đăng
     */
    public Post approvePost(Integer postID) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new RuntimeException("Bài đăng không tồn tại"));
        
        post.setStatus(Post.PostStatus.APPROVED);
        return postRepository.save(post);
    }
    
    /**
     * Admin từ chối bài đăng
     */
    public Post declinePost(Integer postID) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new RuntimeException("Bài đăng không tồn tại"));
        
        post.setStatus(Post.PostStatus.DECLINED);
        return postRepository.save(post);
    }
    
    /**
     * Lấy tất cả bài đăng pending (cho Admin)
     */
    public List<Post> getPendingPosts() {
        return postRepository.findByStatus(Post.PostStatus.PENDING);
    }
    
    /**
     * Lấy tất cả bài đăng approved
     */
    public Page<Post> getApprovedPosts(Pageable pageable) {
        return postRepository.findByStatus(Post.PostStatus.APPROVED, pageable);
    }
    
    /**
     * Đánh dấu sách đã bán
     */
    public Post markAsSold(Integer postID) {
        Post post = postRepository.findById(postID)
                .orElseThrow(() -> new RuntimeException("Bài đăng không tồn tại"));
        
        post.setStatus(Post.PostStatus.SOLD);
        return postRepository.save(post);
    }
}