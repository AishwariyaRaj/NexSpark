package com.rental.apigateway.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        // Check for DATABASE_URL (Render format: postgres://user:pass@host:port/dbname)
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            System.out.println("Using DATABASE_URL for connection");
            try {
                URI dbUri = new URI(databaseUrl);
                
                String username = null;
                String password = null;
                
                if (dbUri.getUserInfo() != null) {
                    String[] userInfo = dbUri.getUserInfo().split(":");
                    username = userInfo[0];
                    password = userInfo.length > 1 ? userInfo[1] : "";
                }
                
                String host = dbUri.getHost();
                int port = dbUri.getPort();
                String path = dbUri.getPath();
                
                // Build JDBC URL
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d%s", host, port, path);
                
                System.out.println("Connecting to: " + jdbcUrl.replaceAll(":[^:]+@", ":****@"));
                
                return DataSourceBuilder.create()
                        .url(jdbcUrl)
                        .username(username)
                        .password(password)
                        .driverClassName("org.postgresql.Driver")
                        .build();
                        
            } catch (URISyntaxException e) {
                System.err.println("Failed to parse DATABASE_URL: " + e.getMessage());
                throw new RuntimeException("Invalid DATABASE_URL format", e);
            }
        }
        
        // Fallback to Spring Boot properties
        String jdbcUrl = System.getenv("SPRING_DATASOURCE_URL");
        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");
        
        if (jdbcUrl == null) {
            jdbcUrl = "jdbc:postgresql://localhost:5432/auth_db";
            username = "postgres";
            password = "postgres";
        }
        
        System.out.println("Using fallback connection to: " + jdbcUrl);
        
        return DataSourceBuilder.create()
                .url(jdbcUrl)
                .username(username != null ? username : "postgres")
                .password(password != null ? password : "postgres")
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
