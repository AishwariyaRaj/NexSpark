package com.rental.websocket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketService {
    
    @Autowired
    private SessionManager sessionManager;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public void broadcastBookingUpdate(String type, Long bookingId, String status) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", type);
        
        Map<String, Object> payload = new HashMap<>();
        payload.put("bookingId", bookingId);
        payload.put("status", status);
        
        message.put("payload", payload);
        message.put("timestamp", ZonedDateTime.now().format(DateTimeFormatter.ISO_INSTANT));
        
        broadcastMessage(message);
    }
    
    public void broadcastPaymentUpdate(String type, Long paymentId, Long bookingId, String status) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", type);
        
        Map<String, Object> payload = new HashMap<>();
        payload.put("paymentId", paymentId);
        payload.put("bookingId", bookingId);
        payload.put("status", status);
        
        message.put("payload", payload);
        message.put("timestamp", ZonedDateTime.now().format(DateTimeFormatter.ISO_INSTANT));
        
        broadcastMessage(message);
    }
    
    private void broadcastMessage(Map<String, Object> message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            TextMessage textMessage = new TextMessage(json);
            
            sessionManager.getAllSessions().values().forEach(session -> {
                try {
                    if (session.isOpen()) {
                        session.sendMessage(textMessage);
                    }
                } catch (IOException e) {
                    System.err.println("Failed to send message to session: " + session.getId());
                }
            });
        } catch (Exception e) {
            System.err.println("Failed to broadcast message: " + e.getMessage());
        }
    }
}
