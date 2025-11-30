/**
 * File: backend/src/main/java/com/sachcu/controller/PostController.java
 * Post Controller - API quản lý bài đăng
 */
package com.sachcu.controller;

import com.sachcu.dto.MessageResponse;
import com.sachcu.model.Post;
import com.sachcu.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    
    private final PostService postService;
    
    /**
     * POST /api/posts
     * Tạo bài đăng mới
     */
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody Post post,
            @RequestParam Integer userID) {
        try {
            Post savedPost = postService.createPost(post, userID);
            return ResponseEntity.ok(savedPost);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }
    
    /**
     * GET /api/posts/my-posts
     * Lấy tất cả bài đăng của user hiện tại
     */
    @GetMapping("/my-posts")
    public ResponseEntity<List<Post>> getMyPosts(@RequestParam Integer userID) {
        List<Post> posts = postService.getMyPosts(userID);
        return ResponseEntity.ok(posts);
    }
    
    /**
     * GET /api/posts/{id}
     * Lấy chi tiết bài đăng
     */
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Integer id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * PUT /api/posts/{id}
     * Cập nhật bài đăng
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Integer id,
            @RequestBody Post post) {
        try {
            Post updatedPost = postService.updatePost(id, post);
            return ResponseEntity.ok(updatedPost);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/posts/{id}
     * Xóa bài đăng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /api/posts/approved
     * Lấy tất cả bài đăng đã duyệt (public)
     */
    @GetMapping("/approved")
    public ResponseEntity<Page<Post>> getApprovedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size, 
                Sort.by("createdAt").descending());
        
        Page<Post> posts = postService.getApprovedPosts(pageable);
        return ResponseEntity.ok(posts);
    }
    
    /**
     * GET /api/posts/pending
     * Lấy tất cả bài đăng pending (Admin only)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Post>> getPendingPosts() {
        List<Post> posts = postService.getPendingPosts();
        return ResponseEntity.ok(posts);
    }
    
    /**
     * PUT /api/posts/{id}/approve
     * Admin duyệt bài đăng
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<Post> approvePost(@PathVariable Integer id) {
        Post post = postService.approvePost(id);
        return ResponseEntity.ok(post);
    }
    
    /**
     * PUT /api/posts/{id}/decline
     * Admin từ chối bài đăng
     */
    @PutMapping("/{id}/decline")
    public ResponseEntity<Post> declinePost(@PathVariable Integer id) {
        Post post = postService.declinePost(id);
        return ResponseEntity.ok(post);
    }
    
    /**
     * PUT /api/posts/{id}/mark-sold
     * Đánh dấu sách đã bán
     */
    @PutMapping("/{id}/mark-sold")
    public ResponseEntity<Post> markAsSold(@PathVariable Integer id) {
        Post post = postService.markAsSold(id);
        return ResponseEntity.ok(post);
    }
}