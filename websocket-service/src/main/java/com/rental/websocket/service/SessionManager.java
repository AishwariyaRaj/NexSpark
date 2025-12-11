package com.rental.websocket.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionManager {
    
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    
    public void addSession(WebSocketSession session) {
        sessions.put(session.getId(), session);
    }
    
    public void removeSession(String sessionId) {
        sessions.remove(sessionId);
    }
    
    public Map<String, WebSocketSession> getAllSessions() {
        return sessions;
    }
    
    public int getSessionCount() {
        return sessions.size();
    }
}
