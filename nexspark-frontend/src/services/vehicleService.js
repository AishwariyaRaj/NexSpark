import api from './api';

const AVAILABILITY_BASE_URL = process.env.REACT_APP_AVAILABILITY_URL || 'http://localhost:8082';

export const vehicleService = {
  searchVehicles: async (startDate, endDate, location = '') => {
    const url = `${AVAILABILITY_BASE_URL}/availability/search`;
    const params = { startDate, endDate };
    if (location && location !== '') {
      params.location = location;
    }
    const response = await fetch(url + '?' + new URLSearchParams(params));
    if (!response.ok) {
      throw new Error(`Failed to search vehicles: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },

  getAllVehicles: async () => {
    const response = await fetch(`${AVAILABILITY_BASE_URL}/availability/vehicles`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },

  getVehicleById: async (vehicleId) => {
    const response = await fetch(`${AVAILABILITY_BASE_URL}/availability/vehicles/${vehicleId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle: ${response.status}`);
    }
    const data = await response.json();
    return data;
  },
};
