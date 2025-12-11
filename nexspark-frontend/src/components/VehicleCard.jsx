import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/dateFormatter';
import { getVehicleImage } from '../constants/vehicleImages';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Backend returns 'id' from availability service
    navigate(`/booking/${vehicle.id}`);
  };

  // Get vehicle image from centralized mapping
  const vehicleImage = getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl);
  
  // Debug logging
  console.log('VehicleCard:', vehicle.make, vehicle.model, '-> Image:', vehicleImage);

  // Since we don't have status from backend, always show as AVAILABLE
  const statusColor = 'bg-success-100 text-success-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Vehicle Image */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {vehicleImage ? (
          <img
            src={vehicleImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center"
          style={{ display: vehicleImage ? 'none' : 'flex' }}
        >
          <svg
            className="w-20 h-20 text-white opacity-50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>
          </svg>
        </div>
        <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {vehicle.type}
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`}>
            AVAILABLE
          </span>
        </div>

        <div className="space-y-2 text-gray-600 mb-4">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-sm">{vehicle.type} • {vehicle.year}</span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm">{vehicle.location}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(vehicle.dailyRate)}
            </div>
            <div className="text-xs text-gray-500">per day</div>
          </div>

          <button
            onClick={handleBookNow}
            className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
