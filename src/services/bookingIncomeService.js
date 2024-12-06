import axios from "axios";
import { baseUrl } from "../utils/constants";

const url = baseUrl + "/incomes";

const bookingIncomeService = {
  // Get all incomes
  getAllIncomes: async () => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching incomes");
    }
  },

  // Get a specific income by ID
  getIncomeById: async (id) => {
    try {
      const response = await axios.get(`${url}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching income with ID: ${id}`);
    }
  },

  // Create a new income
  createIncome: async (incomeData) => {
    try {
      const response = await axios.post(url, incomeData);
      return response.data;
    } catch (error) {
      throw new Error("Error creating income");
    }
  },

  // Update an existing income by ID
  updateIncome: async (id, incomeData) => {
    try {
      const response = await axios.put(`${url}/${id}`, incomeData);
      return response.data;
    } catch (error) {
      throw new Error(`Error updating income with ID: ${id}`);
    }
  },

  // Delete an income by ID
  deleteIncome: async (id) => {
    try {
      const response = await axios.delete(`${url}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error deleting income with ID: ${id}`);
    }
  },
};

export default bookingIncomeService;
