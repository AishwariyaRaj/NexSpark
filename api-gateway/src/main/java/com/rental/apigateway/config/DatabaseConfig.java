package com.rental.apigateway.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            // Convert Render's DATABASE_URL format to JDBC format
            databaseUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            
            // Parse URL to extract user, password, host, port, and database
            try {
                java.net.URI dbUri = new java.net.URI(databaseUrl.replace("jdbc:postgresql://", "http://"));
                String username = dbUri.getUserInfo().split(":")[0];
                String password = dbUri.getUserInfo().split(":")[1];
                String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
                
                return DataSourceBuilder.create()
                        .url(dbUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse DATABASE_URL", e);
            }
        }
        
        // Fallback to default Spring Boot configuration
        String jdbcUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (jdbcUrl == null) {
            jdbcUrl = "jdbc:postgresql://localhost:5432/auth_db";
        }
        
        return DataSourceBuilder.create()
                .url(jdbcUrl)
                .username(System.getenv("SPRING_DATASOURCE_USERNAME") != null ? 
                    System.getenv("SPRING_DATASOURCE_USERNAME") : "postgres")
                .password(System.getenv("SPRING_DATASOURCE_PASSWORD") != null ? 
                    System.getenv("SPRING_DATASOURCE_PASSWORD") : "postgres")
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
