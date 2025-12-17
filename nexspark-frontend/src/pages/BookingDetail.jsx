import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, calculateDays, calculateTotalCost } from '../utils/dateFormatter';
import { getVehicleImage } from '../constants/vehicleImages';

const BookingDetail = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Vehicle image mapping with proper fallback
  const vehicleImages = {
    'Toyota Fortuner': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Fortuner/10903/1695787797420/front-left-side-47.jpg',
    'Honda City': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/10676/1689588133475/front-left-side-47.jpg',
    'Hyundai Creta': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Creta/10745/1697698686328/front-left-side-47.jpg',
    'Toyota Camry': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Camry/9747/1676447200342/front-left-side-47.jpg'
  };

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
  });
  const [totalCost, setTotalCost] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && vehicle) {
      const calculatedDays = calculateDays(
        bookingData.startDate,
        bookingData.endDate
      );
      const cost = calculateTotalCost(
        vehicle.dailyRate,
        bookingData.startDate,
        bookingData.endDate
      );
      setDays(calculatedDays);
      setTotalCost(cost);
    }
  }, [bookingData, vehicle]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      console.log('Fetching vehicle with ID:', vehicleId);
      const data = await vehicleService.getVehicleById(vehicleId);
      console.log('Vehicle data received:', data);
      setVehicle(data);
    } catch (error) {
      toast.error('Failed to load vehicle details');
      console.error('Fetch vehicle error:', error);
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start >= end) {
      toast.error('End date must be after start date');
      return;
    }

    if (start < today) {
      toast.error('Start date cannot be in the past');
      return;
    }

    // Get userId from user context or localStorage
    let userId = user?.userId || user?.id;
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.userId || parsedUser.id;
        } catch (err) {
          console.error('Failed to parse stored user:', err);
        }
      }
    }

    // Check if user has auth token
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Session expired. Please login again.', {
        duration: 4000,
      });
      navigate('/login');
      return;
    }

    if (!userId) {
      toast.error('User not authenticated. Please login again.', {
        duration: 4000,
      });
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Creating booking with data:', {
        vehicleId: parseInt(vehicleId),
        userId: userId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        dailyRate: vehicle.dailyRate,
      });

      const booking = await bookingService.createBooking({
        vehicleId: parseInt(vehicleId),
        userId: userId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        dailyRate: vehicle.dailyRate,
      });

      console.log('Booking created successfully:', booking);
      toast.success('Rental booking created successfully! Proceed to payment.', {
        duration: 3000,
      });
      // Use the correct property name from backend response
      navigate(`/payment/${booking.id || booking.bookingId}`);
    } catch (error) {
      console.error('Booking error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = 'Failed to create booking. Please try again.';
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = 'Authentication failed. Please login again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/search')}
          className="mb-4 text-orange-600 hover:text-orange-700 flex items-center"
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
          Back to Search
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Vehicle Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-gray-600 mt-1">{vehicle.type} • {vehicle.year}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-success-100 text-success-800">
                AVAILABLE
              </span>
            </div>
          </div>

          {/* Vehicle Image */}
          <div className="p-6 border-b border-gray-200">
            {getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl) ? (
              <img
                src={getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl)}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.querySelector('.fallback-image').style.display = 'flex';
                }}
              />
            ) : null}
            <div className="fallback-image w-full h-64 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-md flex items-center justify-center" style={{display: getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl) ? 'none' : 'flex'}}>
              <div className="text-center text-white">
                <svg className="w-20 h-20 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>
                </svg>
                <p className="text-xl font-bold">{vehicle.make} {vehicle.model}</p>
                <p className="text-sm opacity-90">{vehicle.type}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Location</p>
                <p className="text-gray-800 font-medium">
                  {vehicle.location}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Daily Rate</p>
                <p className="text-orange-600 font-bold text-xl">
                  {formatCurrency(vehicle.dailyRate)}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          {
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-2xl font-bold text-secondary-800 mb-2">
                Rent This Vehicle
              </h2>
              <p className="text-secondary-600 mb-6">
                Select your rental dates and complete the booking to rent this vehicle
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-secondary-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-secondary-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-secondary-700 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleChange}
                    min={
                      bookingData.startDate ||
                      new Date().toISOString().split('T')[0]
                    }
                    className="w-full px-4 py-2 border border-secondary-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Cost Summary */}
              {days > 0 && (
                <div className="bg-orange-50 rounded-lg p-4 mb-6 border-2 border-orange-200">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">
                    Rental Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Daily Rental Rate:</span>
                      <span className="font-semibold">{formatCurrency(vehicle.dailyRate)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Rental Duration:</span>
                      <span className="font-semibold">{days} day(s)</span>
                    </div>
                    <div className="border-t-2 border-orange-300 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold text-orange-600">
                        <span>Total Rental Cost:</span>
                        <span>{formatCurrency(totalCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || days <= 0}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg transition flex items-center justify-center shadow-lg text-lg"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Rental...
                  </>
                ) : (
                  'Proceed to Rent & Payment'
                )}
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
