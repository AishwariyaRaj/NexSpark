package com.rental.notification.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rental.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class PaymentEventListener {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @KafkaListener(topics = "payment-events", groupId = "notification-service")
    public void handlePaymentEvent(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String eventType = event.get("event").asText();
            Long bookingId = event.get("bookingId").asLong();
            Long paymentId = event.get("paymentId").asLong();
            
            // Note: In a real system, we'd fetch the booking to get userId
            // For MVP, using bookingId as userId for demonstration
            Long userId = bookingId;
            
            String notificationMessage = "";
            
            switch (eventType) {
                case "payment_completed":
                    notificationMessage = "Payment successful for booking " + bookingId;
                    break;
                case "payment_failed":
                    notificationMessage = "Payment failed for booking " + bookingId;
                    break;
                case "payment_refunded":
                    notificationMessage = "Payment refunded for booking " + bookingId;
                    break;
            }
            
            if (!notificationMessage.isEmpty()) {
                notificationService.createNotification(userId, eventType, notificationMessage);
            }
        } catch (Exception e) {
            System.err.println("Failed to process payment event: " + e.getMessage());
        }
    }
}
