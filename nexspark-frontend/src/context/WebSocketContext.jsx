import React, { createContext, useContext, useEffect, useState } from 'react';
import websocketClient from '../utils/websocket';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Connect WebSocket
      websocketClient.connect();

      // Subscribe to messages
      const unsubscribe = websocketClient.subscribe((data) => {
        if (data.type === 'connection') {
          setConnected(data.status === 'connected');
        } else {
          setMessages((prev) => [...prev, data]);
        }
      });

      return () => {
        unsubscribe();
        websocketClient.disconnect();
      };
    }
  }, [isAuthenticated]);

  const sendMessage = (data) => {
    websocketClient.send(data);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value = {
    connected,
    messages,
    sendMessage,
    clearMessages,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
