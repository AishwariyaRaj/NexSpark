import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { formatCurrency, formatDate, calculateDays } from '../utils/dateFormatter';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');

  const paymentMethods = [
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'PAYPAL', label: 'PayPal' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  ];

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      // Fetch the specific booking
      const currentBooking = await bookingService.getBooking(parseInt(bookingId));

      if (!currentBooking) {
        toast.error('Booking not found');
        navigate('/my-bookings');
        return;
      }

      if (currentBooking.status !== 'PENDING') {
        toast.error('This booking has already been processed');
        navigate('/my-bookings');
        return;
      }

      setBooking(currentBooking);
    } catch (error) {
      toast.error('Failed to load booking details');
      console.error('Fetch booking error:', error);
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);

      // Process payment
      const payment = await paymentService.processPayment({
        bookingId: parseInt(bookingId),
        amount: booking.totalCost,
        paymentMethod,
      });

      toast.success('Payment successful!');

      // Confirm booking after successful payment
      await bookingService.confirmBooking(parseInt(bookingId));

      toast.success('Booking confirmed!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Payment failed. Please try again.'
      );
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const days = calculateDays(booking.startDate, booking.endDate);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-orange-600 text-white p-6">
            <h1 className="text-3xl font-bold">Complete Your Payment</h1>
            <p className="mt-2">Booking #{booking.bookingId}</p>
          </div>

          {/* Booking Summary */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Booking Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle ID:</span>
                <span className="font-medium text-gray-800">
                  {booking.vehicleId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium text-gray-800">
                  {formatDate(booking.startDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium text-gray-800">
                  {formatDate(booking.endDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-800">
                  {days} day(s)
                </span>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-gray-300">
                <span className="font-bold text-gray-800">
                  Total Amount:
                </span>
                <span className="font-bold text-orange-600 text-2xl">
                  {formatCurrency(booking.totalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Payment Method
            </h2>

            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:bg-orange-50 transition"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-800 font-medium">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded p-4 mb-6">
              <p className="text-orange-800 text-sm">
                <strong>Note:</strong> This is an MVP implementation. Payment
                will be automatically processed successfully.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/my-bookings')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Pay ${formatCurrency(booking.totalCost)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
