import axios from "axios";
import { baseUrl } from "../utils/constants";

const BASE_URL = baseUrl + "/vprofiles";

class VProfileService {
  // Fetch all vehicle profiles
  async getAllVProfiles() {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicle profiles:", error);
      throw new Error("Failed to fetch vehicle profiles.");
    }
  }

  // Create a new vehicle profile
  async createVProfile(vProfileData) {
    try {
      const response = await axios.post(BASE_URL, vProfileData);
      return response.data;
    } catch (error) {
      console.error("Error creating vehicle profile:", error);
      throw new Error("Failed to create vehicle profile.");
    }
  }

  // Update an existing vehicle profile
  async updateVProfile(id, vProfileData) {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, vProfileData);
      return response.data;
    } catch (error) {
      console.error("Error updating vehicle profile:", error);
      throw new Error("Failed to update vehicle profile.");
    }
  }

  // Delete a vehicle profile
  async deleteVProfile(id) {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting vehicle profile:", error);
      throw new Error("Failed to delete vehicle profile.");
    }
  }
}

export default new VProfileService();
