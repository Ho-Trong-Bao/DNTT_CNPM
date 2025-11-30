/**
 * File: backend/src/main/java/com/sachcu/repository/AdminRepository.java
 * Admin Repository Interface
 */
package com.sachcu.repository;

import com.sachcu.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    
    Optional<Admin> findByEmail(String email);
    
    Boolean existsByEmail(String email);
}