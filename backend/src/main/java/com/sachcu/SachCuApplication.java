/**
 * File: backend/src/main/java/com/sachcu/SachCuApplication.java
 * Main Spring Boot Application Class
 */
package com.sachcu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SachCuApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(SachCuApplication.class, args);
        
        System.out.println("\n" +
                "========================================\n" +
                "✅ Sách Cũ Theo Khu Vực API Started!\n" +
                "📍 API Base URL: http://localhost:8080/api\n" +
                "📚 Swagger UI: http://localhost:8080/api/swagger-ui.html\n" +
                "🗄️  H2 Console: http://localhost:8080/api/h2-console\n" +
                "========================================\n");
    }
}