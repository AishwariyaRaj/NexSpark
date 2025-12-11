package com.rental.websocket.handler;

import com.rental.websocket.service.SessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class BookingWebSocketHandler extends TextWebSocketHandler {
    
    @Autowired
    private SessionManager sessionManager;
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessionManager.addSession(session);
        System.out.println("New WebSocket connection: " + session.getId());
        System.out.println("Total active connections: " + sessionManager.getSessionCount());
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages if needed
        System.out.println("Received message from " + session.getId() + ": " + message.getPayload());
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessionManager.removeSession(session.getId());
        System.out.println("WebSocket connection closed: " + session.getId());
        System.out.println("Total active connections: " + sessionManager.getSessionCount());
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("WebSocket error for session " + session.getId() + ": " + exception.getMessage());
        sessionManager.removeSession(session.getId());
    }
}
