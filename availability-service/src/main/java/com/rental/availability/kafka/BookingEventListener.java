package com.rental.availability.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.availability.entity.Booking;
import com.rental.availability.repository.BookingRepository;
import com.rental.availability.service.VehicleCacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class BookingEventListener {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private VehicleCacheService cacheService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @KafkaListener(topics = "booking-events", groupId = "availability-service")
    public void handleBookingEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String eventType = event.get("event").asText();
            
            switch (eventType) {
                case "booking_created":
                case "booking_confirmed":
                case "booking_cancelled":
                    cacheService.refreshCache();
                    break;
            }
        } catch (Exception e) {
            System.err.println("Failed to process booking event: " + e.getMessage());
        }
    }
}
