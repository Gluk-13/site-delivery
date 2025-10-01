class ApiClient {
  constructor() {
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }

    if (process.env.NODE_ENV === 'production') {
      return '/api';
    }

    return 'http://localhost:4200/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken')
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, data) {
    return this.request(endpoint, {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  getCart(userId) {
    return this.request(`/cart?userId=${userId}`);
  }
}

export const apiClient = new ApiClient();