package com.rental.availability.repository;

import com.rental.availability.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    @Query("SELECT v FROM Vehicle v WHERE v.location = :location " +
           "AND v.id NOT IN (" +
           "  SELECT b.vehicleId FROM Booking b " +
           "  WHERE b.status IN ('PENDING', 'CONFIRMED') " +
           "  AND ((b.startDate <= :endDate AND b.endDate >= :startDate))" +
           ")")
    List<Vehicle> findAvailableVehicles(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("location") String location);
}
