import axios from "axios";
import { baseUrl } from "../utils/constants";

// Axios instance for the API
const api = axios.create({
  baseURL: baseUrl + "/users",
  headers: {
    "Content-Type": "application/json",
  },
});

// User service object for CRUD operations
const userService = {
  // Fetch all users
  getAllUsers: async () => {
    try {
      const response = await api.get("/");
      return response.data; // Return the list of users
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error; // Handle error
    }
  },

  // Fetch a user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data; // Return the user data
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Handle error
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post("/", userData);
      return response.data; // Return the newly created user
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Handle error
    }
  },

  // Update a user by ID
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/${id}`, userData);
      return response.data; // Return the updated user
    } catch (error) {
      console.error("Error updating user:", error);
      throw error; // Handle error
    }
  },

  // Delete a user by ID
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data; // Return confirmation of deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error; // Handle error
    }
  },
};

export default userService;
