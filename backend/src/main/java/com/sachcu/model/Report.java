/**
 * File: backend/src/main/java/com/sachcu/model/Report.java
 * Report Entity - Bảng Report trong database
 */
package com.sachcu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "Report")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportID;
    
    @ManyToOne
    @JoinColumn(name = "postID", nullable = false)
    private Post post;
    
    @ManyToOne
    @JoinColumn(name = "adminID")
    private Admin admin;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @CreatedDate
    @Column(name = "reportDate", updatable = false)
    private LocalDateTime reportDate;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ReportStatus status = ReportStatus.OPEN;
    
    public enum ReportStatus {
        OPEN, RESOLVED, DISMISSED
    }
}