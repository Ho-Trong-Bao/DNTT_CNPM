package com.sachcu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Book")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookID;
    
    @Column(nullable = false, length = 150)
    private String title;
    
    @Column(length = 100)
    private String author;
    
    @Column(length = 50)
    private String bookCondition;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 255)
    private String image;
    
    @Column(length = 100)
    private String contactInfo;
    
    @Column(length = 50)
    private String province;
    
    @Column(length = 50)
    private String district;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @OneToOne(mappedBy = "book", cascade = CascadeType.ALL)
    private Post post;
    
    @ManyToMany
    @JoinTable(
        name = "BookCategory",
        joinColumns = @JoinColumn(name = "bookID"),
        inverseJoinColumns = @JoinColumn(name = "categoryID")
    )
    private Set<Category> categories = new HashSet<>();
}