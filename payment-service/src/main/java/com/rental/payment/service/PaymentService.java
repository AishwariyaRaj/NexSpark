package com.rental.payment.service;

import com.rental.payment.entity.Payment;
import com.rental.payment.kafka.PaymentEventProducer;
import com.rental.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private PaymentEventProducer eventProducer;
    
    @Transactional
    public Payment processPayment(Long bookingId, BigDecimal amount, String paymentMethod) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        
        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        
        payment = paymentRepository.save(payment);
        
        // Auto-success for MVP
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment = paymentRepository.save(payment);
        
        eventProducer.publishPaymentCompleted(payment.getId(), bookingId);
        
        return payment;
    }
    
    public Optional<Payment> getPayment(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }
    
    public List<Payment> getPaymentsByBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
    
    @Transactional
    public Payment refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Only completed payments can be refunded");
        }
        
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        payment = paymentRepository.save(payment);
        
        eventProducer.publishPaymentRefunded(payment.getId(), payment.getBookingId());
        
        return payment;
    }
}
