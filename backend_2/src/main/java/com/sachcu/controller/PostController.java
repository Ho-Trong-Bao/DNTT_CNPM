package com.sachcu.controller;

import com.sachcu.dto.request.CreatePostRequest;
import com.sachcu.dto.request.UpdatePostRequest;
import com.sachcu.dto.response.PostResponse;
import com.sachcu.service.PostService;
import com.sachcu.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller: PostController
 * Mô tả: Xử lý các API liên quan đến Post (Bài đăng)
 * 
 * APIs:
 * - POST /posts - Đăng bài bán sách mới (Cần đăng nhập)
 * - GET /posts/{postID} - Xem chi tiết bài đăng (Public)
 * - GET /users/{userID}/posts - Xem bài đăng của User (Cần đăng nhập)
 * - PUT /posts/{postID} - Sửa bài đăng (Cần đăng nhập, chỉ chủ bài)
 * - DELETE /posts/{postID} - Xóa bài đăng (Cần đăng nhập, chỉ chủ bài)
 */
@RestController
@RequestMapping
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PostController {
    
    private final PostService postService;
    private final JwtUtil jwtUtil;
    
    /**
     * API: Đăng bài bán sách mới (Gộp Book và Post)
     * Method: POST
     * Endpoint: /posts
     * Auth: Cần đăng nhập (ROLE_USER)
     */
    @PostMapping("/posts")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostRequest request,
                                       @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            Integer userID = jwtUtil.extractUserId(jwtToken);
            
            PostResponse response = postService.createPost(userID, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * API: Xem chi tiết bài đăng
     * Method: GET
     * Endpoint: /posts/{postID}
     * Auth: KHÔNG CẦN (Public)
     */
    @GetMapping("/posts/{postID}")
    public ResponseEntity<?> getPostById(@PathVariable Integer postID) {
        try {
            PostResponse response = postService.getPostById(postID);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * API: Xem tất cả bài đăng của một User
     * Method: GET
     * Endpoint: /users/{userID}/posts
     * Auth: Cần đăng nhập (ROLE_USER)
     */
    @GetMapping("/users/{userID}/posts")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserPosts(@PathVariable Integer userID,
                                         @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            Integer tokenUserId = jwtUtil.extractUserId(jwtToken);
            
            // Chỉ cho phép user xem bài đăng của chính mình
            if (!tokenUserId.equals(userID)) {
                return ResponseEntity.status(403).body("Bạn không có quyền xem danh sách này");
            }
            
            List<PostResponse> posts = postService.getUserPosts(userID);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * API: Cập nhật bài đăng
     * Method: PUT
     * Endpoint: /posts/{postID}
     * Auth: Cần đăng nhập (ROLE_USER, chỉ chủ bài)
     */
    @PutMapping("/posts/{postID}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updatePost(@PathVariable Integer postID,
                                       @RequestBody UpdatePostRequest request,
                                       @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            Integer userID = jwtUtil.extractUserId(jwtToken);
            
            PostResponse response = postService.updatePost(postID, userID, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * API: Xóa bài đăng
     * Method: DELETE
     * Endpoint: /posts/{postID}
     * Auth: Cần đăng nhập (ROLE_USER, chỉ chủ bài)
     */
    @DeleteMapping("/posts/{postID}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deletePost(@PathVariable Integer postID,
                                       @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            Integer userID = jwtUtil.extractUserId(jwtToken);
            
            postService.deletePost(postID, userID);
            return ResponseEntity.ok("Xóa bài đăng thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}