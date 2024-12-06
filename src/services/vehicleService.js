// src/services/vehicleService.js
import axios from "axios";

const baseUrl = "http://localhost:8080/api/vehicles";

class VehicleService {
  static async getAllVehicles() {
    const response = await axios.get(baseUrl);
    return response.data;
  }

  static async createVehicle(vehicleData) {
    const response = await axios.post(baseUrl, vehicleData);
    return response.data;
  }

  static async updateVehicle(id, vehicleData) {
    const response = await axios.put(`${baseUrl}/${id}`, vehicleData);
    return response.data;
  }

  static async deleteVehicle(id) {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  }
}

export default VehicleService;
