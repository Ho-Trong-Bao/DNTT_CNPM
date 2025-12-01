package com.sachcu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryID;
    
    @Column(nullable = false, unique = true, length = 100)
    private String categoryName;
    
    @ManyToMany(mappedBy = "categories")
    private Set<Book> books = new HashSet<>();
}