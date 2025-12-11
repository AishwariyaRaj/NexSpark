package com.rental.websocket.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.websocket.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class BookingEventListener {
    
    @Autowired
    private WebSocketService webSocketService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @KafkaListener(topics = "booking-events", groupId = "websocket-service")
    public void handleBookingEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String eventType = event.get("event").asText();
            Long bookingId = event.get("bookingId").asLong();
            
            String status = "";
            String type = "booking_status_update";
            
            switch (eventType) {
                case "booking_created":
                    status = "PENDING";
                    break;
                case "booking_confirmed":
                    status = "CONFIRMED";
                    break;
                case "booking_cancelled":
                    status = "CANCELLED";
                    break;
            }
            
            if (!status.isEmpty()) {
                webSocketService.broadcastBookingUpdate(type, bookingId, status);
            }
        } catch (Exception e) {
            System.err.println("Failed to process booking event: " + e.getMessage());
        }
    }
    
    @KafkaListener(topics = "payment-events", groupId = "websocket-service")
    public void handlePaymentEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String eventType = event.get("event").asText();
            Long paymentId = event.get("paymentId").asLong();
            Long bookingId = event.get("bookingId").asLong();
            
            String status = "";
            String type = "payment_status_update";
            
            switch (eventType) {
                case "payment_completed":
                    status = "COMPLETED";
                    break;
                case "payment_failed":
                    status = "FAILED";
                    break;
                case "payment_refunded":
                    status = "REFUNDED";
                    break;
            }
            
            if (!status.isEmpty()) {
                webSocketService.broadcastPaymentUpdate(type, paymentId, bookingId, status);
            }
        } catch (Exception e) {
            System.err.println("Failed to process payment event: " + e.getMessage());
        }
    }
}
