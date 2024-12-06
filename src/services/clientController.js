import axios from "axios";
import { baseUrl } from "../utils/constants";

const API_BASE_URL = baseUrl;

const bookingUserService = {
  createUser: async (userData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/booking-users`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while creating the user");
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/booking-users`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while fetching users");
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/booking-users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while fetching the user");
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/booking-users/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while updating the user");
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/booking-users/${id}`
      );
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while deleting the user");
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/booking-users/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while logging in");
    }
  },
};

export default bookingUserService;
