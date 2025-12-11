package com.rental.booking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisLockService {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Value("${redis.lock.ttl}")
    private long lockTtl;
    
    public boolean acquireLock(Long vehicleId) {
        String key = "vehicle:lock:" + vehicleId;
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "locked", lockTtl, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }
    
    public void releaseLock(Long vehicleId) {
        String key = "vehicle:lock:" + vehicleId;
        redisTemplate.delete(key);
    }
    
    public boolean isLocked(Long vehicleId) {
        String key = "vehicle:lock:" + vehicleId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
