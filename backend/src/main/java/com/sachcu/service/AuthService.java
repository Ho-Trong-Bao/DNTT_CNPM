/**
 * File: backend/src/main/java/com/sachcu/service/AuthService.java
 * Authentication Service - Xử lý đăng ký, đăng nhập
 */
package com.sachcu.service;

import com.sachcu.config.JwtUtil;
import com.sachcu.dto.LoginRequest;
import com.sachcu.dto.LoginResponse;
import com.sachcu.dto.RegisterRequest;
import com.sachcu.model.User;
import com.sachcu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    /**
     * Đăng ký user mới
     */
    public User register(RegisterRequest request) {
        // Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        
        // Tạo user mới
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setProvince(request.getProvince());
        user.setDistrict(request.getDistrict());
        user.setWard(request.getWard());
        user.setStatus(User.UserStatus.ACTIVE);
        
        return userRepository.save(user);
    }
    
    /**
     * Đăng nhập user
     */
    public LoginResponse login(LoginRequest request) {
        // Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));
        
        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }
        
        // Kiểm tra trạng thái tài khoản
        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản đã bị khóa hoặc chưa được kích hoạt");
        }
        
        // Tạo JWT token
        String token = jwtUtil.generateToken(user.getEmail());
        
        return new LoginResponse(token, user.getUserID(), user.getEmail(), user.getName());
    }
}