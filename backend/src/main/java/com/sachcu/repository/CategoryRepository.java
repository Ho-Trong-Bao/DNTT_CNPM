/**
 * File: backend/src/main/java/com/sachcu/repository/CategoryRepository.java
 * Category Repository Interface
 */
package com.sachcu.repository;

import com.sachcu.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    Optional<Category> findByCategoryName(String categoryName);
    
    Boolean existsByCategoryName(String categoryName);
}