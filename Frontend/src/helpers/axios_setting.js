// src/axios.js
import axios from "axios";
import { API_URL } from "../../config";
console.log("config", API_URL)
axios.defaults.withCredentials = true; //don't remove from this line
const instance = axios.create({
  baseURL: API_URL, // Replace with your backend URL
}); 

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add common headers, authentication, etc.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Handle successful responses globally
    return response;
  },
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default instance;
