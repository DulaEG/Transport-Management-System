import axios from "axios";
import { baseUrl } from "../utils/constants";

const url = baseUrl + "/maintenance";

const maintenanceService = {
  // Fetch all maintenance records
  getAllMaintenances: async () => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      throw error;
    }
  },

  // Fetch a specific maintenance record by ID
  getMaintenanceById: async (id) => {
    try {
      const response = await axios.get(`${url}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenance with ID: ${id}`, error);
      throw error;
    }
  },

  // Create a new maintenance record
  createMaintenance: async (maintenanceData) => {
    try {
      const response = await axios.post(url, maintenanceData);
      return response.data;
    } catch (error) {
      console.error("Error creating maintenance:", error);
      throw error;
    }
  },

  // Update an existing maintenance record
  updateMaintenance: async (id, maintenanceData) => {
    try {
      const response = await axios.put(`${url}/${id}`, maintenanceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating maintenance with ID: ${id}`, error);
      throw error;
    }
  },

  // Delete a maintenance record
  deleteMaintenance: async (id) => {
    try {
      const response = await axios.delete(`${url}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting maintenance with ID: ${id}`, error);
      throw error;
    }
  },
};

export default maintenanceService;
