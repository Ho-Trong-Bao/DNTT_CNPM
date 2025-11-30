/**
 * File: backend/src/main/java/com/sachcu/repository/UserRepository.java
 * User Repository Interface
 */
package com.sachcu.repository;

import com.sachcu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByEmail(String email);
    
    Optional<User> findByUserID(Integer userID);
}