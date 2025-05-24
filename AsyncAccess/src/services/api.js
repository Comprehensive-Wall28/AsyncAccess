import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api', // Adjust to your backend URL
  withCredentials: true, // Important for cookies
});

export default api;
