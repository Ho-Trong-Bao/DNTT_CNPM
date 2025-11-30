/**
 * File: backend/src/main/java/com/sachcu/repository/BookRepository.java
 * Book Repository Interface
 */
package com.sachcu.repository;

import com.sachcu.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    
    // Tìm kiếm sách với nhiều filter
    @Query("SELECT DISTINCT b FROM Book b " +
           "LEFT JOIN b.categories c " +
           "LEFT JOIN b.post p " +
           "WHERE (:search IS NULL OR " +
           "   LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "   LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:province IS NULL OR b.province = :province) " +
           "AND (:categoryID IS NULL OR c.categoryID = :categoryID) " +
           "AND (:minPrice IS NULL OR b.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR b.price <= :maxPrice) " +
           "AND (p.status = 'APPROVED' OR p.status IS NULL)")
    Page<Book> searchBooksWithFilters(
            @Param("search") String search,
            @Param("province") String province,
            @Param("categoryID") Integer categoryID,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );
    
    // Tìm sách theo User
    @Query("SELECT b FROM Book b JOIN b.post p WHERE p.user.userID = :userID")
    List<Book> findByUserId(@Param("userID") Integer userID);
    
    // Tìm sách theo tỉnh/thành
    List<Book> findByProvince(String province);
    
    // Tìm sách theo khoảng giá
    List<Book> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Sách mới nhất (approved)
    @Query("SELECT b FROM Book b JOIN b.post p " +
           "WHERE p.status = 'APPROVED' " +
           "ORDER BY b.createdAt DESC")
    Page<Book> findLatestApprovedBooks(Pageable pageable);
}