import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method.toUpperCase(), config.baseURL + config.url);
  console.log('Request data:', config.data);
  return config;
});

// Add response interceptor to log errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data);
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICE ====================
export const authService = {
  signup: async (email, password, name) => {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      name,
    });
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

// ==================== ROBOT SERVICE ====================
export const robotService = {
  // Get all robots (for dashboard list)
  getAllRobots: async () => {
    try {
      const response = await apiClient.get('/robots');
      return response.data;
    } catch (error) {
      console.error('Error fetching robots:', error);
      throw error;
    }
  },

  // Get specific robot with all its sensors
  getRobotById: async (robotId) => {
    try {
      const response = await apiClient.get(`/robots/${robotId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching robot ${robotId}:`, error);
      throw error;
    }
  },

  // Add new robot
  addRobot: async (robotData) => {
    try {
      const response = await apiClient.post('/robots', robotData);
      return response.data;
    } catch (error) {
      console.error('Error adding robot:', error);
      throw error;
    }
  },

  // Update robot
  updateRobot: async (robotId, robotData) => {
    try {
      const response = await apiClient.put(`/robots/${robotId}`, robotData);
      return response.data;
    } catch (error) {
      console.error(`Error updating robot ${robotId}:`, error);
      throw error;
    }
  },

  // Delete robot
  deleteRobot: async (robotId) => {
    try {
      const response = await apiClient.delete(`/robots/${robotId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting robot ${robotId}:`, error);
      throw error;
    }
  },
};

// ==================== SENSOR SERVICE ====================
export const sensorService = {
  // Get all sensors for a specific robot
  getRobotSensors: async (robotId) => {
    try {
      const response = await apiClient.get(`/robots/${robotId}/sensors`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sensors for robot ${robotId}:`, error);
      throw error;
    }
  },

  // Get single sensor
  getSensorById: async (sensorId) => {
    try {
      const response = await apiClient.get(`/sensors/${sensorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // Add sensor to robot
  addSensor: async (robotId, sensorData) => {
    try {
      const response = await apiClient.post(`/robots/${robotId}/sensors`, sensorData);
      return response.data;
    } catch (error) {
      console.error(`Error adding sensor to robot ${robotId}:`, error);
      throw error;
    }
  },

  // Update sensor
  updateSensor: async (sensorId, sensorData) => {
    try {
      const response = await apiClient.put(`/sensors/${sensorId}`, sensorData);
      return response.data;
    } catch (error) {
      console.error(`Error updating sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // Delete sensor
  deleteSensor: async (sensorId) => {
    try {
      const response = await apiClient.delete(`/sensors/${sensorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting sensor ${sensorId}:`, error);
      throw error;
    }
  },
};

export default apiClient;
