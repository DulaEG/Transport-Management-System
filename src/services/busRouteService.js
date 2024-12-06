import axios from "axios";

const API_URL = "http://localhost:8080/api/bus-routes";

const busRouteService = {
  getAllRoutes: () => axios.get(API_URL),
  getRouteById: (id) => axios.get(`${API_URL}/${id}`),
  createRoute: (routeData) => axios.post(API_URL, routeData),
  updateRoute: (id, routeData) => axios.put(`${API_URL}/${id}`, routeData),
  deleteRoute: (id) => axios.delete(`${API_URL}/${id}`),
};

export default busRouteService;
