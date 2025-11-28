package com.sachcu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SachCuApplication {
    public static void main(String[] args) {
        SpringApplication.run(SachCuApplication.class, args);
        System.out.println("========================================");
        System.out.println("✅ Sách Cũ Theo Khu Vực API is running!");
        System.out.println("📍 http://localhost:8080/api");
        System.out.println("========================================");
    }
}