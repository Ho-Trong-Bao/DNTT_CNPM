/**
 * File: backend/src/main/java/com/sachcu/dto/LoginResponse.java
 * Login Response DTO
 */
package com.sachcu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Integer userId;
    private String email;
    private String name;
    
    public LoginResponse(String token, Integer userId, String email, String name) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
    }
}