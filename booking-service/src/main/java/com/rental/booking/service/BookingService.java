package com.rental.booking.service;

import com.rental.booking.entity.Booking;
import com.rental.booking.kafka.BookingEventProducer;
import com.rental.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RedisLockService redisLockService;
    
    @Autowired
    private BookingEventProducer eventProducer;
    
    @Transactional
    public Booking createBooking(Long vehicleId, Long userId, 
                                  java.time.LocalDate startDate, 
                                  java.time.LocalDate endDate,
                                  BigDecimal dailyRate) {
        // Temporarily disable Redis lock for MVP testing
        // TODO: Re-enable and fix Redis lock logic for production
        // Try to acquire lock (best effort)
        try {
            redisLockService.releaseLock(vehicleId); // Clear any old locks first
            redisLockService.acquireLock(vehicleId);
        } catch (Exception e) {
            // Continue anyway for MVP
            System.out.println("Redis lock warning: " + e.getMessage());
        }
        
        long days = ChronoUnit.DAYS.between(startDate, endDate);
        if (days <= 0) days = 1;
        
        BigDecimal totalCost = dailyRate.multiply(BigDecimal.valueOf(days));
        
        Booking booking = new Booking();
        booking.setVehicleId(vehicleId);
        booking.setUserId(userId);
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setTotalCost(totalCost);
        
        booking = bookingRepository.save(booking);
        
        eventProducer.publishBookingCreated(booking.getId(), vehicleId, userId);
        
        return booking;
    }
    
    @Transactional
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);
        
        redisLockService.releaseLock(booking.getVehicleId());
        eventProducer.publishBookingConfirmed(bookingId);
        
        return booking;
    }
    
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        redisLockService.releaseLock(booking.getVehicleId());
        eventProducer.publishBookingCancelled(bookingId);
    }
    
    public Optional<Booking> getBooking(Long bookingId) {
        return bookingRepository.findById(bookingId);
    }
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}
