package com.sachcu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDetailResponse {

    private Integer postID;
    private String title;
    private String content;
    private String status;
    private String createdAt;

    private String sellerName;
    private Integer sellerUserID;

    private String contactInfo; // null hoặc "Đăng nhập để xem"

    private Object book; // Có thể là BookDetailResponse hoặc thông tin tóm tắt sách
}
