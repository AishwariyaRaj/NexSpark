package com.rental.availability.service;

import com.rental.availability.entity.Vehicle;
import com.rental.availability.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private VehicleCacheService cacheService;
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public List<Vehicle> getAllVehicles() {
        return cacheService.getCachedVehicles();
    }
    
    public List<Vehicle> searchAvailableVehicles(LocalDate startDate, LocalDate endDate, String location) {
        List<Vehicle> vehicles = vehicleRepository.findAvailableVehicles(startDate, endDate, location);
        
        return vehicles.stream()
                .filter(v -> !isLockedInRedis(v.getId()))
                .collect(Collectors.toList());
    }
    
    public Optional<Vehicle> getVehicleDetails(Long vehicleId) {
        return vehicleRepository.findById(vehicleId);
    }
    
    private boolean isLockedInRedis(Long vehicleId) {
        String key = "vehicle:lock:" + vehicleId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
