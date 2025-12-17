package com.rental.availability.controller;

import com.rental.availability.entity.Vehicle;
import com.rental.availability.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/availability")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AvailabilityController {
    
    @Autowired
    private AvailabilityService availabilityService;
    
    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = availabilityService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchAvailableVehicles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam String location) {
        List<Vehicle> vehicles = availabilityService.searchAvailableVehicles(startDate, endDate, location);
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/vehicles/{vehicleId}")
    public ResponseEntity<Vehicle> getVehicleDetails(@PathVariable Long vehicleId) {
        return availabilityService.getVehicleDetails(vehicleId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/vehicles")
    public ResponseEntity<Vehicle> addVehicle(@RequestBody Vehicle vehicle) {
        Vehicle savedVehicle = availabilityService.addVehicle(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }
    
    @PutMapping("/vehicles/{vehicleId}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long vehicleId, @RequestBody Vehicle vehicle) {
        Vehicle updatedVehicle = availabilityService.updateVehicle(vehicleId, vehicle);
        return ResponseEntity.ok(updatedVehicle);
    }
    
    @DeleteMapping("/vehicles/{vehicleId}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long vehicleId) {
        availabilityService.deleteVehicle(vehicleId);
        return ResponseEntity.ok().build();
    }
}
