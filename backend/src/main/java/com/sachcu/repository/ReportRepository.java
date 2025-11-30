/**
 * File: backend/src/main/java/com/sachcu/repository/ReportRepository.java
 * Report Repository Interface
 */
package com.sachcu.repository;

import com.sachcu.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    
    List<Report> findByStatus(Report.ReportStatus status);
    
    List<Report> findByPost_PostID(Integer postID);
    
    Long countByStatus(Report.ReportStatus status);
}