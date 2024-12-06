import axios from "axios";
import { baseUrl } from "../utils/constants";

const API_BASE_URL = baseUrl;

const inquiryService = {
  createInquiry: async (inquiryData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/inquiries`,
        inquiryData
      );
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while creating the inquiry");
    }
  },

  getAllInquiries: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inquiries`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while fetching inquiries");
    }
  },

  getInquiryById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while fetching the inquiry");
    }
  },

  updateInquiry: async (id, inquiryData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/inquiries/${id}`,
        inquiryData
      );
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while updating the inquiry");
    }
  },

  deleteInquiry: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while deleting the inquiry");
    }
  },
};

export default inquiryService;
