import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatIcon = ({ onClick, hasUnread = false }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-300 z-50 group"
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Unread indicator */}
      {hasUnread && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      )}
      
      {/* Hover tooltip */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Chat with NexSpark AI
      </span>
    </button>
  );
};

export default ChatIcon;
