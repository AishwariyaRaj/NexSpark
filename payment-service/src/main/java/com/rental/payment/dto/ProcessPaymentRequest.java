package com.rental.payment.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProcessPaymentRequest {
    private Long bookingId;
    private BigDecimal amount;
    private String paymentMethod;
}
