package com.rental.availability.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String make;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private BigDecimal dailyRate;
    
    @Column(nullable = false)
    private String type;
    
    private String licensePlate;
    
    private String color;
    
    private String fuelType;
    
    private String transmission;
    
    private Integer seats;
    
    private String imageUrl;
}
