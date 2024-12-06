import axios from "axios";
import { baseUrl } from "../utils/constants";

const BASE_URL = baseUrl + "/inventory";

const inventoryService = {
  getAllItems: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getItemById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  createItem: async (itemData) => {
    const response = await axios.post(BASE_URL, itemData);
    return response.data;
  },

  updateItem: async (id, itemData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, itemData);
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};

export default inventoryService;
