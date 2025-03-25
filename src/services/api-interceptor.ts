import api from './api';

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Log all outgoing requests
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    // Log all successful responses
    console.log('API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    
    return response;
  },
  (error) => {
    // Log all error responses
    console.error('API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    
    return Promise.reject(error);
  }
);

export default api; 