/**
 * File: backend/src/main/java/com/sachcu/service/CategoryService.java
 * Category Service - Xử lý logic nghiệp vụ liên quan đến danh mục
 */
package com.sachcu.service;

import com.sachcu.model.Category;
import com.sachcu.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    /**
     * Lấy tất cả categories
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    /**
     * Lấy category theo ID
     */
    public Optional<Category> getCategoryById(Integer id) {
        return categoryRepository.findById(id);
    }
    
    /**
     * Tạo category mới
     */
    public Category createCategory(Category category) {
        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new RuntimeException("Danh mục đã tồn tại");
        }
        return categoryRepository.save(category);
    }
    
    /**
     * Cập nhật category
     */
    public Category updateCategory(Integer id, Category updatedCategory) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        
        category.setCategoryName(updatedCategory.getCategoryName());
        return categoryRepository.save(category);
    }
    
    /**
     * Xóa category
     */
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }
}