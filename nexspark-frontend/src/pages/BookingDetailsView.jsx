import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingService } from '../services/bookingService';
import { vehicleService } from '../services/vehicleService';
import { formatDate, formatCurrency, calculateDays } from '../utils/dateFormatter';
import { getVehicleImage } from '../constants/vehicleImages';

const BookingDetailsView = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vehicle image mapping
  const vehicleImages = {
    'Toyota Fortuner': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Fortuner/10903/1695787797420/front-left-side-47.jpg',
    'Honda City': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/10676/1689588133475/front-left-side-47.jpg',
    'Hyundai Creta': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Creta/10745/1697698686328/front-left-side-47.jpg',
    'Toyota Camry': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Camry/9747/1676447200342/front-left-side-47.jpg'
  };

  const statusColors = {
    PENDING: 'bg-warning-100 text-warning-800',
    CONFIRMED: 'bg-success-100 text-success-800',
    CANCELLED: 'bg-danger-100 text-danger-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const bookingData = await bookingService.getBooking(parseInt(bookingId));
      setBooking(bookingData);

      // Fetch vehicle details
      try {
        const vehicleData = await vehicleService.getVehicleById(bookingData.vehicleId);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Failed to fetch vehicle details:', error);
      }
    } catch (error) {
      toast.error('Failed to load booking details');
      console.error('Fetch booking error:', error);
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(parseInt(bookingId));
        toast.success('Booking cancelled successfully');
        navigate('/my-bookings');
      } catch (error) {
        toast.error('Failed to cancel booking');
        console.error('Cancel error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const days = calculateDays(booking.startDate, booking.endDate);

  return (
    <div className="min-h-screen bg-secondary-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/my-bookings')}
          className="mb-4 text-primary-600 hover:text-primary-700 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to My Bookings
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">Booking Details</h1>
                <p className="mt-2">Booking #{booking.id || booking.bookingId}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  statusColors[booking.status] || 'bg-secondary-100 text-secondary-800'
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          {/* Vehicle Image and Info */}
          {vehicle && (
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-800 mb-4">Vehicle Information</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  {getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl) ? (
                    <img
                      src={getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl)}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-md flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-20 h-20 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>
                        </svg>
                        <p className="text-xl font-bold">{vehicle.make} {vehicle.model}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-800">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-secondary-600">{vehicle.type} • {vehicle.year}</p>
                    </div>
                    <div className="flex items-center text-secondary-700">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{vehicle.location}</span>
                    </div>
                    <div className="text-secondary-700">
                      <span className="text-sm">Daily Rate:</span>
                      <div className="text-2xl font-bold text-primary-600">
                        {formatCurrency(vehicle.dailyRate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Information */}
          <div className="p-6 border-b border-secondary-200">
            <h2 className="text-xl font-bold text-secondary-800 mb-4">Booking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-secondary-600 mb-1">Start Date</div>
                <div className="text-lg font-medium text-secondary-800">
                  {formatDate(booking.startDate)}
                </div>
              </div>
              <div>
                <div className="text-sm text-secondary-600 mb-1">End Date</div>
                <div className="text-lg font-medium text-secondary-800">
                  {formatDate(booking.endDate)}
                </div>
              </div>
              <div>
                <div className="text-sm text-secondary-600 mb-1">Duration</div>
                <div className="text-lg font-medium text-secondary-800">{days} day(s)</div>
              </div>
              <div>
                <div className="text-sm text-secondary-600 mb-1">Booking Status</div>
                <div className="text-lg font-medium text-secondary-800">{booking.status}</div>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="p-6 border-b border-secondary-200 bg-secondary-50">
            <h2 className="text-xl font-bold text-secondary-800 mb-4">Cost Summary</h2>
            <div className="space-y-2">
              {vehicle && (
                <div className="flex justify-between text-secondary-700">
                  <span>Daily Rate:</span>
                  <span>{formatCurrency(vehicle.dailyRate)}</span>
                </div>
              )}
              <div className="flex justify-between text-secondary-700">
                <span>Duration:</span>
                <span>{days} day(s)</span>
              </div>
              <div className="border-t border-secondary-300 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold text-primary-600">
                  <span>Total Cost:</span>
                  <span>{formatCurrency(booking.totalCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6">
            <div className="flex space-x-4">
              {booking.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => navigate(`/payment/${booking.id || booking.bookingId}`)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded transition"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-danger-500 hover:bg-danger-600 text-white font-medium py-3 px-4 rounded transition"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              {booking.status === 'CONFIRMED' && (
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded transition"
                >
                  Back to My Bookings
                </button>
              )}
              {booking.status === 'CANCELLED' && (
                <button
                  onClick={() => navigate('/search')}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded transition"
                >
                  Search for New Vehicle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;
