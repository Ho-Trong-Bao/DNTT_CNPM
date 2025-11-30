/**
 * File: backend/src/main/java/com/sachcu/dto/MessageResponse.java
 * Generic Message Response DTO
 */
package com.sachcu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private boolean success;
    
    public MessageResponse(String message) {
        this.message = message;
        this.success = true;
    }
}