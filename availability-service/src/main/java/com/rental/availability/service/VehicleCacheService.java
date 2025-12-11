package com.rental.availability.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.availability.entity.Vehicle;
import com.rental.availability.repository.VehicleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class VehicleCacheService {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Value("${redis.cache.ttl}")
    private long cacheTtl;
    
    private static final String CACHE_KEY = "vehicles:all";
    
    @PostConstruct
    public void initCache() {
        refreshCache();
    }
    
    public void refreshCache() {
        try {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            String json = objectMapper.writeValueAsString(vehicles);
            redisTemplate.opsForValue().set(CACHE_KEY, json, cacheTtl, TimeUnit.SECONDS);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to cache vehicles", e);
        }
    }
    
    public List<Vehicle> getCachedVehicles() {
        String json = redisTemplate.opsForValue().get(CACHE_KEY);
        if (json == null) {
            refreshCache();
            json = redisTemplate.opsForValue().get(CACHE_KEY);
        }
        
        try {
            return objectMapper.readValue(json, 
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Vehicle.class));
        } catch (JsonProcessingException e) {
            return vehicleRepository.findAll();
        }
    }
}
