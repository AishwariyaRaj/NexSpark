import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { vehicleService } from '../services/vehicleService';
import SearchFilters from '../components/SearchFilters';
import VehicleCard from '../components/VehicleCard';

const Search = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Load all vehicles on mount
    loadAllVehicles();
  }, []);

  const loadAllVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      toast.error('Failed to load vehicles');
      console.error('Load vehicles error:', error);
    } finally {
      setLoading(false);
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

      setVehicles(data);

      if (data.length === 0) {
        toast.error('No vehicles found matching your criteria');
      } else {
        toast.success(`Found ${data.length} available vehicle(s)`);
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12">
      <div className="container mx-auto px-6">
        {/* Search Filters */}
        <div className="mb-10">
          <SearchFilters onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {searched ? 'Search Results' : 'All Vehicles'}
            </h2>
            {vehicles.length > 0 && (
              <span className="px-5 py-2 bg-accent text-white rounded-lg font-bold shadow-md">
                {vehicles.length} vehicle(s) found
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                <p className="mt-4 text-gray-400">Searching vehicles...</p>
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
              <p className="text-gray-300 text-lg">
                {searched
                  ? 'No vehicles available for the selected criteria'
                  : 'No vehicles available at the moment'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
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
