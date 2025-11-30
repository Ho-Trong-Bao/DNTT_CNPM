/**
 * File: backend/src/main/java/com/sachcu/service/UserService.java
 * User Service - Xử lý logic nghiệp vụ liên quan đến user
 */
package com.sachcu.service;

import com.sachcu.model.User;
import com.sachcu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Lấy user theo ID
     */
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }
    
    /**
     * Lấy user theo email
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Cập nhật thông tin user
     */
    public User updateUser(Integer userID, User updatedUser) {
        User existingUser = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getProvince() != null) {
            existingUser.setProvince(updatedUser.getProvince());
        }
        if (updatedUser.getDistrict() != null) {
            existingUser.setDistrict(updatedUser.getDistrict());
        }
        if (updatedUser.getWard() != null) {
            existingUser.setWard(updatedUser.getWard());
        }
        
        return userRepository.save(existingUser);
    }
    
    /**
     * Đổi mật khẩu
     */
    public void changePassword(Integer userID, String oldPassword, String newPassword) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    /**
     * Lấy tất cả users (Admin)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Xóa user (Admin)
     */
    public void deleteUser(Integer userID) {
        userRepository.deleteById(userID);
    }
}