import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Gauge, AlertTriangle, Clock, TrendingUp, MapPinned } from 'lucide-react';
import toast from 'react-hot-toast';

const VehicleTracking = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [vehicleLocation, setVehicleLocation] = useState({ lat: 40.7589, lng: -73.9851 });
  const [mileage, setMileage] = useState(0);
  const [geofenceAlerts, setGeofenceAlerts] = useState([]);
  const [trackingActive, setTrackingActive] = useState(false);

  // Simulated active bookings
  useEffect(() => {
    const mockBookings = [
      {
        id: 1,
        vehicle: 'Toyota Camry 2023',
        licensePlate: 'ABC-1234',
        startDate: '2025-12-15',
        endDate: '2025-12-20',
        initialMileage: 15420,
        currentMileage: 15567,
        location: { lat: 40.7589, lng: -73.9851 },
        status: 'active'
      },
      {
        id: 2,
        vehicle: 'Honda CR-V 2024',
        licensePlate: 'XYZ-5678',
        startDate: '2025-12-16',
        endDate: '2025-12-18',
        initialMileage: 8920,
        currentMileage: 8965,
        location: { lat: 40.7489, lng: -73.9680 },
        status: 'active'
      }
    ];
    setActiveBookings(mockBookings);
    if (mockBookings.length > 0) {
      setSelectedBooking(mockBookings[0]);
      setVehicleLocation(mockBookings[0].location);
      setMileage(mockBookings[0].currentMileage);
    }
  }, []);

  // Simulate real-time location updates
  useEffect(() => {
    if (trackingActive && selectedBooking) {
      const interval = setInterval(() => {
        setVehicleLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }));
        
        // Simulate mileage increase
        setMileage(prev => prev + Math.random() * 0.5);

        // Random geofence alerts
        if (Math.random() > 0.95) {
          const alert = {
            id: Date.now(),
            type: 'warning',
            message: 'Vehicle approaching geofence boundary',
            timestamp: new Date().toISOString()
          };
          setGeofenceAlerts(prev => [alert, ...prev].slice(0, 5));
          toast(alert.message, {
            icon: '⚠️',
            style: {
              background: '#FEF3C7',
              color: '#92400E',
            },
          });
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [trackingActive, selectedBooking]);

  const handleStartTracking = () => {
    setTrackingActive(true);
    toast.success('Real-time tracking activated');
  };

  const handleStopTracking = () => {
    setTrackingActive(false);
    toast('Tracking paused');
  };

  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
    setVehicleLocation(booking.location);
    setMileage(booking.currentMileage);
    setTrackingActive(false);
    setGeofenceAlerts([]);
  };

  const calculateDistance = () => {
    if (selectedBooking) {
      return (mileage - selectedBooking.initialMileage).toFixed(1);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vehicle Tracking</h1>
          <p className="text-gray-600">Real-time GPS tracking and monitoring for your rented vehicles</p>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Active Rentals</h2>
            <p className="text-gray-600">You don't have any active vehicle rentals to track right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Active Bookings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  Active Rentals
                </h2>
                <div className="space-y-3">
                  {activeBookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => handleBookingSelect(booking)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedBooking?.id === booking.id
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{booking.vehicle}</div>
                      <div className="text-sm text-gray-600 mt-1">{booking.licensePlate}</div>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mileage Stats */}
              {selectedBooking && (
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-orange-600" />
                    Mileage Stats
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600">Initial Mileage</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedBooking.initialMileage.toLocaleString()} mi
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Current Mileage</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {mileage.toFixed(1)} mi
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">Distance Traveled</div>
                      <div className="text-3xl font-bold text-green-600 flex items-center">
                        {calculateDistance()} mi
                        <TrendingUp className="w-6 h-6 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content - Map and Tracking */}
            <div className="lg:col-span-2">
              {selectedBooking && (
                <>
                  {/* Vehicle Info Header */}
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedBooking.vehicle}</h2>
                        <p className="text-gray-600">{selectedBooking.licensePlate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Rental Period</div>
                        <div className="text-gray-900 font-semibold">
                          {new Date(selectedBooking.startDate).toLocaleDateString()} - {new Date(selectedBooking.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Tracking Controls */}
                    <div className="flex space-x-3">
                      {!trackingActive ? (
                        <button
                          onClick={handleStartTracking}
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center"
                        >
                          <Navigation className="w-5 h-5 mr-2" />
                          Start Real-Time Tracking
                        </button>
                      ) : (
                        <button
                          onClick={handleStopTracking}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center"
                        >
                          <MapPinned className="w-5 h-5 mr-2" />
                          Pause Tracking
                        </button>
                      )}
                    </div>

                    {trackingActive && (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                        <span className="text-green-800 font-medium">Live tracking active</span>
                      </div>
                    )}
                  </div>

                  {/* Map */}
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                      GPS Location
                    </h3>
                    <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
                      <iframe
                        title="Vehicle Location"
                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6173828125647!2d${vehicleLocation.lng}!3d${vehicleLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcyMC4wIk4gNzPCsDU5JzA2LjQiVw!5e0!3m2!1sen!2sus!4v1621234567890!5m2!1sen!2sus`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        className="w-full h-full"
                      ></iframe>
                      
                      {/* Live Location Overlay */}
                      {trackingActive && (
                        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2">
                          <div className="text-xs text-gray-600">Current Location</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {vehicleLocation.lat.toFixed(6)}, {vehicleLocation.lng.toFixed(6)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Geofence Alerts */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                      Geofence Alerts
                    </h3>
                    {geofenceAlerts.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MapPin className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-gray-600">No geofence alerts</p>
                        <p className="text-sm text-gray-500 mt-1">Vehicle is within designated area</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {geofenceAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                          >
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{alert.message}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleTracking;
