// services/tripBookingService.js
import axios from "axios";
import { baseUrl } from "../utils/constants";

const BASE_URL = baseUrl;

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a new trip booking
export const createTripBooking = async (tripData) => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const response = await api.post("/trips", {
      ...tripData,
      userId: user["_id"],
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Get all trip bookings
export const getAllTripBookings = async () => {
  try {
    const response = await api.get("/trips");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Get a trip booking by ID
export const getTripBookingById = async (id) => {
  try {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Update a trip booking by ID
export const updateTripBooking = async (id, tripData) => {
  try {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

// Delete (soft delete) a trip booking by ID
export const deleteTripBooking = async (id) => {
  try {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};
