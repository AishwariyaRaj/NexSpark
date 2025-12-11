import React from 'react';
import { formatDateTime } from '../utils/dateFormatter';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const isUnread = notification.status === 'UNREAD';

  return (
    <div
      className={`p-4 border-b border-secondary-100 hover:bg-secondary-50 transition ${
        isUnread ? 'bg-primary-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="text-sm text-secondary-800 font-medium">
            {notification.message}
          </p>
          <p className="text-xs text-secondary-500 mt-1">
            {formatDateTime(notification.createdAt)}
          </p>
        </div>
        {isUnread && (
          <span className="ml-2 h-2 w-2 bg-primary-600 rounded-full"></span>
        )}
      </div>

      <div className="flex space-x-2">
        {isUnread && (
          <button
            onClick={() => onMarkAsRead(notification.notificationId)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark as Read
          </button>
        )}
        <button
          onClick={() => onDelete(notification.notificationId)}
          className="text-xs text-danger-600 hover:text-danger-700 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
