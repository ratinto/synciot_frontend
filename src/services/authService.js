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
  return config;
});

export const authService = {
  signup: async (email, password, name) => {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      name,
    });
    if (response.data.token) {
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
    if (response.data.token) {
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

// IoT Rover API Methods
export const roverService = {
  // Get all rovers with stats
  getAllRovers: async () => {
    try {
      const response = await apiClient.get('/rover');
      return response.data;
    } catch (error) {
      console.error('Error fetching rovers:', error);
      throw error;
    }
  },

  // Get specific rover details
  getRoverById: async (roverId) => {
    try {
      const response = await apiClient.get(`/rover/${roverId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rover ${roverId}:`, error);
      throw error;
    }
  },

  // Send command to rover
  sendRoverCommand: async (roverId, command) => {
    try {
      const response = await apiClient.post(`/rover/${roverId}/command`, {
        command,
      });
      return response.data;
    } catch (error) {
      console.error(`Error sending command to rover ${roverId}:`, error);
      throw error;
    }
  },
};

// Sensor Logs API Methods
export const sensorService = {
  // Get sensor logs with pagination and filtering
  getSensorLogs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.roverId) params.append('roverId', filters.roverId);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.search) params.append('search', filters.search);
      if (filters.tempMin) params.append('tempMin', filters.tempMin);
      if (filters.tempMax) params.append('tempMax', filters.tempMax);
      if (filters.batteryMin) params.append('batteryMin', filters.batteryMin);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await apiClient.get('/sensor-logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor logs:', error);
      throw error;
    }
  },

  // Create new sensor log
  createSensorLog: async (logData) => {
    try {
      const response = await apiClient.post('/sensor-logs', logData);
      return response.data;
    } catch (error) {
      console.error('Error creating sensor log:', error);
      throw error;
    }
  },

  // Get aggregated sensor statistics
  getSensorStats: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.roverId) params.append('roverId', filters.roverId);
      if (filters.days) params.append('days', filters.days);

      const response = await apiClient.get('/sensor-logs/stats/aggregated', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor statistics:', error);
      throw error;
    }
  },
};

// Dashboard API Methods
export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

// Alerts API Methods
export const alertService = {
  // Get alerts with filtering
  getAlerts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.isResolved !== undefined) params.append('isResolved', filters.isResolved);
      if (filters.roverId) params.append('roverId', filters.roverId);

      const response = await apiClient.get('/alerts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  // Get specific alert
  getAlertById: async (alertId) => {
    try {
      const response = await apiClient.get(`/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alert ${alertId}:`, error);
      throw error;
    }
  },

  // Resolve alert
  resolveAlert: async (alertId) => {
    try {
      const response = await apiClient.post(`/alerts/${alertId}/resolve`);
      return response.data;
    } catch (error) {
      console.error(`Error resolving alert ${alertId}:`, error);
      throw error;
    }
  },

  // Create new alert
  createAlert: async (alertData) => {
    try {
      const response = await apiClient.post('/alerts', alertData);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  },
};

export default apiClient;
