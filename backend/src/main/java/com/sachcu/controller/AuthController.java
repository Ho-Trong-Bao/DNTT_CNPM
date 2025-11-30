/**
 * File: backend/src/main/java/com/sachcu/controller/AuthController.java
 * Authentication Controller - API đăng ký, đăng nhập
 */
package com.sachcu.controller;

import com.sachcu.dto.LoginRequest;
import com.sachcu.dto.LoginResponse;
import com.sachcu.dto.MessageResponse;
import com.sachcu.dto.RegisterRequest;
import com.sachcu.model.User;
import com.sachcu.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * POST /api/auth/register
     * Đăng ký user mới
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);
            return ResponseEntity.ok(new MessageResponse("Đăng ký thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }
    
    /**
     * POST /api/auth/login
     * Đăng nhập
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }
}