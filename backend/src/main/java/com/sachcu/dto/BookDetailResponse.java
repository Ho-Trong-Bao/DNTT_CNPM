package com.sachcu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDetailResponse {
    private Integer bookID;
    private String title;
    private String author;
    private String bookCondition;
    private String description;
    private String image;
    private Double price;
    private String province;
    private String district;
    private String contactInfo; // Sẽ trả về null hoặc "Đăng nhập để xem" nếu chưa đăng nhập
    private Integer sellerUserID; // Sẽ trả về null nếu chưa đăng nhập
}
