package com.rental.notification.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class BookingEventListener {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @KafkaListener(topics = "booking-events", groupId = "notification-service")
    public void handleBookingEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String eventType = event.get("event").asText();
            Long userId = event.get("userId").asLong();
            Long bookingId = event.get("bookingId").asLong();
            
            String notificationMessage = "";
            
            switch (eventType) {
                case "booking_created":
                    Long vehicleId = event.get("vehicleId").asLong();
                    notificationMessage = "Booking created for vehicle " + vehicleId;
                    break;
                case "booking_confirmed":
                    notificationMessage = "Booking " + bookingId + " confirmed";
                    break;
                case "booking_cancelled":
                    notificationMessage = "Booking " + bookingId + " cancelled";
                    break;
            }
            
            if (!notificationMessage.isEmpty()) {
                notificationService.createNotification(userId, eventType, notificationMessage);
            }
        } catch (Exception e) {
            System.err.println("Failed to process booking event: " + e.getMessage());
        }
    }
}
