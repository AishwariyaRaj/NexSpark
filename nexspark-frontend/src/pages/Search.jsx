import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { vehicleService } from '../services/vehicleService';
import SearchFilters from '../components/SearchFilters';
import VehicleCard from '../components/VehicleCard';

const Search = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [allVehicles, setAllVehicles] = useState([]); // Store all vehicles for filtering

  const vehicleTypes = [
    { value: '', label: 'All Types', icon: '🚗' },
    { value: 'Sedan', label: 'Sedans', icon: '🚘' },
    { value: 'SUV', label: 'SUVs', icon: '🚙' },
    { value: 'Hatchback', label: 'Hatchbacks', icon: '🚗' },
    { value: 'Luxury', label: 'Luxury', icon: '🏎️' },
    { value: 'Sports', label: 'Sports', icon: '🏁' },
    { value: 'Van', label: 'Vans', icon: '🚐' },
    { value: 'Truck', label: 'Trucks', icon: '🚚' },
  ];

  useEffect(() => {
    // Load all vehicles on mount
    loadAllVehicles();
  }, []);

  const loadAllVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
      setAllVehicles(data); // Store all vehicles
    } catch (error) {
      toast.error('Failed to load vehicles');
      console.error('Load vehicles error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFilter = (type) => {
    setSelectedType(type);
    if (type === '') {
      setVehicles(allVehicles);
    } else {
      const filtered = allVehicles.filter((vehicle) => vehicle.type === type);
      setVehicles(filtered);
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setSearched(true);

      const data = await vehicleService.searchVehicles(
        filters.startDate,
        filters.endDate,
        filters.location
      );

      // Apply client-side vehicle type filter if specified
      let filteredData = data;
      if (filters.vehicleType) {
        filteredData = data.filter(
          (vehicle) => vehicle.type === filters.vehicleType
        );
      }

      setVehicles(filteredData);

      if (filteredData.length === 0) {
        toast.error('No vehicles found matching your criteria');
      } else {
        toast.success(`Found ${filteredData.length} available vehicle(s)`);
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Search Filters */}
        <div className="mb-10">
          <SearchFilters onSearch={handleSearch} />
        </div>

        {/* Quick Filter by Vehicle Type */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Quick Filter by Vehicle Type
          </h3>
          <div className="flex flex-wrap gap-3">
            {vehicleTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleQuickFilter(type.value)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md flex items-center space-x-2 ${
                  selectedType === type.value
                    ? 'bg-orange-600 text-white transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span>{type.label}</span>
                {selectedType === type.value && (
                  <span className="ml-2 text-xs bg-white text-orange-600 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searched ? 'Search Results' : 'All Vehicles'}
            </h2>
            {vehicles.length > 0 && (
              <span className="px-5 py-2 bg-orange-600 text-white rounded-lg font-bold shadow-lg">
                {vehicles.length} vehicle(s) found
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching vehicles...</p>
              </div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 text-lg">
                {searched
                  ? 'No vehicles available for the selected criteria'
                  : 'No vehicles available at the moment'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search filters or check back later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
