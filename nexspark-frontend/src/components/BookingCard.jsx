import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency, calculateDays } from '../utils/dateFormatter';

const BookingCard = ({ booking, onCancel }) => {
  const navigate = useNavigate();

  const statusColors = {
    PENDING: 'bg-warning-100 text-warning-800',
    CONFIRMED: 'bg-success-100 text-success-800',
    CANCELLED: 'bg-danger-100 text-danger-800',
  };

  const handleViewDetails = () => {
    navigate(`/booking-details/${booking.bookingId || booking.id}`);
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await onCancel(booking.bookingId);
    }
  };

  const days = calculateDays(booking.startDate, booking.endDate);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-secondary-800">
            Booking #{booking.bookingId}
          </h3>
          <p className="text-sm text-secondary-500">
            Vehicle ID: {booking.vehicleId}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            statusColors[booking.status] || 'bg-secondary-100 text-secondary-800'
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-secondary-600">Start Date</div>
          <div className="font-medium text-secondary-800">
            {formatDate(booking.startDate)}
          </div>
        </div>
        <div>
          <div className="text-sm text-secondary-600">End Date</div>
          <div className="font-medium text-secondary-800">
            {formatDate(booking.endDate)}
          </div>
        </div>
        <div>
          <div className="text-sm text-secondary-600">Duration</div>
          <div className="font-medium text-secondary-800">{days} days</div>
        </div>
        <div>
          <div className="text-sm text-secondary-600">Total Cost</div>
          <div className="font-medium text-primary-600 text-lg">
            {formatCurrency(booking.totalCost)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handleViewDetails}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition"
        >
          View Details
        </button>
        {booking.status === 'PENDING' && (
          <button
            onClick={handleCancel}
            className="bg-danger-500 hover:bg-danger-600 text-white font-medium py-2 px-4 rounded transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
