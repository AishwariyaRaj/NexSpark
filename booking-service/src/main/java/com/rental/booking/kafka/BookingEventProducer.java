package com.rental.booking.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class BookingEventProducer {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    private static final String TOPIC = "booking-events";
    
    public void publishBookingCreated(Long bookingId, Long vehicleId, Long userId) {
        String message = String.format("{\"event\":\"booking_created\",\"bookingId\":%d,\"vehicleId\":%d,\"userId\":%d}", 
                bookingId, vehicleId, userId);
        kafkaTemplate.send(TOPIC, message);
    }
    
    public void publishBookingConfirmed(Long bookingId) {
        String message = String.format("{\"event\":\"booking_confirmed\",\"bookingId\":%d}", bookingId);
        kafkaTemplate.send(TOPIC, message);
    }
    
    public void publishBookingCancelled(Long bookingId) {
        String message = String.format("{\"event\":\"booking_cancelled\",\"bookingId\":%d}", bookingId);
        kafkaTemplate.send(TOPIC, message);
    }
}
