/**
 * API Service for CropSync Kiosk
 * Replaces Supabase with MySQL backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * API client for making HTTP requests
 */
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Set the authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get the authentication token
   */
  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  /**
   * Make an HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login with user ID
   * @param {string} userId - The user ID to login with
   * @returns {Promise<{success: boolean, message: string, user: object|null, token: string|null}>}
   */
  async login(userId) {
    try {
      const response = await apiClient.post('/api/auth/login', { user_id: userId });
      
      if (response.success && response.token) {
        apiClient.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed. Please try again.',
        user: null,
        token: null,
      };
    }
  },

  /**
   * Login with NFC card UID
   * @param {string} cardUid - The NFC card UID
   * @returns {Promise<{success: boolean, message: string, user: object|null, token: string|null}>}
   */
  async loginByCard(cardUid) {
    try {
      const response = await apiClient.post(`/api/auth/login-by-card?card_uid=${encodeURIComponent(cardUid)}`, {});
      
      if (response.success && response.token) {
        apiClient.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Card login failed. Please try again.',
        user: null,
        token: null,
      };
    }
  },

  /**
   * Logout - clear token
   */
  logout() {
    apiClient.setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  /**
   * Verify if the current token is valid
   * @returns {Promise<{valid: boolean, user_id: string|null}>}
   */
  async verifyToken() {
    const token = apiClient.getToken();
    if (!token) {
      return { valid: false, user_id: null };
    }

    try {
      const response = await apiClient.post(`/api/auth/verify-token?token=${encodeURIComponent(token)}`, {});
      return response;
    } catch (error) {
      return { valid: false, user_id: null };
    }
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Store user in localStorage
   */
  storeUser(user) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!apiClient.getToken() && !!this.getStoredUser();
  },
};

/**
 * Users API
 */
export const usersApi = {
  /**
   * Get user by ID
   * @param {string} userId - The user ID
   * @returns {Promise<object>}
   */
  async getUser(userId) {
    return apiClient.get(`/api/users/${userId}`);
  },
};

/**
 * Health check API
 */
export const healthApi = {
  /**
   * Check API health
   */
  async check() {
    return apiClient.get('/api/health');
  },
};

export default apiClient;
