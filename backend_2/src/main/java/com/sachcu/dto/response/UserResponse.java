package com.sachcu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO Response: UserResponse
 * Mô tả: Thông tin user trả về
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private Integer userID;
    private String name;
    private String email;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String status;
    private LocalDateTime createdAt;
}