package com.rental.payment.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentEventProducer {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    private static final String TOPIC = "payment-events";
    
    public void publishPaymentCompleted(Long paymentId, Long bookingId) {
        String message = String.format("{\"event\":\"payment_completed\",\"paymentId\":%d,\"bookingId\":%d}", 
                paymentId, bookingId);
        kafkaTemplate.send(TOPIC, message);
    }
    
    public void publishPaymentFailed(Long paymentId, Long bookingId) {
        String message = String.format("{\"event\":\"payment_failed\",\"paymentId\":%d,\"bookingId\":%d}", 
                paymentId, bookingId);
        kafkaTemplate.send(TOPIC, message);
    }
    
    public void publishPaymentRefunded(Long paymentId, Long bookingId) {
        String message = String.format("{\"event\":\"payment_refunded\",\"paymentId\":%d,\"bookingId\":%d}", 
                paymentId, bookingId);
        kafkaTemplate.send(TOPIC, message);
    }
}
