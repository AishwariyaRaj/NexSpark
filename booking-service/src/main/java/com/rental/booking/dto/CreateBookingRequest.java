package com.rental.booking.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateBookingRequest {
    private Long vehicleId;
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal dailyRate;
}
