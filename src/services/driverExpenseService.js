import axios from "axios";
import { baseUrl } from "../utils/constants";

const BASE_URL = baseUrl + "/expenses";

const driverExpenseService = {
  getAllExpenses: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getExpenseById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await axios.post(BASE_URL, expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};

export default driverExpenseService;
