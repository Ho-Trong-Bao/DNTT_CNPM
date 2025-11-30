/**
 * File: backend/src/main/java/com/sachcu/repository/PostRepository.java
 * Post Repository Interface
 */
package com.sachcu.repository;

import com.sachcu.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    
    // Tìm tất cả bài đăng của một user
    List<Post> findByUser_UserID(Integer userID);
    
    // Tìm bài đăng theo trạng thái
    List<Post> findByStatus(Post.PostStatus status);
    
    // Tìm bài đăng của user theo trạng thái
    List<Post> findByUser_UserIDAndStatus(Integer userID, Post.PostStatus status);
    
    // Tìm tất cả bài đăng approved (phân trang)
    Page<Post> findByStatus(Post.PostStatus status, Pageable pageable);
    
    // Đếm số bài đăng pending
    Long countByStatus(Post.PostStatus status);
    
    // Query phức tạp hơn
    @Query("SELECT p FROM Post p WHERE " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:userID IS NULL OR p.user.userID = :userID)")
    Page<Post> findPostsWithFilters(
            @Param("status") Post.PostStatus status,
            @Param("userID") Integer userID,
            Pageable pageable
    );
}