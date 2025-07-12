const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    _id: string;
    email: string;
    username: string;
    avatar?: string;
    name?: string;
    location?: string;
    rating?: number;
    skillsOffered?: string[];
    skillsWanted?: string[];
    availability?: string;
    bio?: string;
    experience?: string;
    completedSwaps?: number;
    isAdmin?: boolean;
    profileCompleted?: boolean;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    _id: string;
    email: string;
    username: string;
    avatar?: string;
    profileCompleted?: boolean;
  };
}

const apiService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await fetch(${API_BASE_URL}/api/auth/login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const result = await response.json();
    console.log('[API] Login response:', result);
    return result;
  },

  async register(data: FormData): Promise<RegisterResponse> {
    const response = await fetch(${API_BASE_URL}/api/auth/register, {
      method: 'POST',
      credentials: 'include', // Important for cookies
      body: data, // FormData for file upload
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const result = await response.json();
    console.log('[API] Register response:', result);
    return result;
  },

  async getCurrentUser() {
    const response = await fetch(${API_BASE_URL}/api/auth/me, {
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch current user');
    }

    const result = await response.json();
    console.log('[API] Current user response:', result);
    return result;
  },

  async logout() {
    const response = await fetch(${API_BASE_URL}/api/auth/logout, {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Logout failed');
    }

    const result = await response.json();
    console.log('[API] Logout response:', result);
    return result;
  },

  async updateProfile(data: FormData) {
    const response = await fetch(${API_BASE_URL}/api/auth/profile, {
      method: 'PUT',
      credentials: 'include', // Important for cookies
      body: data, // FormData for file upload
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Profile update failed');
    }

    const result = await response.json();
    console.log('[API] Profile update response:', result);
    return result;
  },

  // User management APIs
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(${API_BASE_URL}/api/users?${queryString}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch users');
    }

    return await response.json();
  },

  async getUserById(id: string) {
    const response = await fetch(${API_BASE_URL}/api/users/${id}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }

    return await response.json();
  },

  async updateUserProfile(id: string, data: any) {
    const response = await fetch(${API_BASE_URL}/api/users/${id}, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update user profile');
    }

    return await response.json();
  },

  async deleteUser(id: string) {
    const response = await fetch(${API_BASE_URL}/api/users/${id}, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete user');
    }

    return await response.json();
  },

  // Skills management APIs
  async addOfferedSkill(skill: string) {
    const response = await fetch(${API_BASE_URL}/api/skills/offer, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ skill }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add offered skill');
    }

    return await response.json();
  },

  async addWantedSkill(skill: string) {
    const response = await fetch(${API_BASE_URL}/api/skills/request, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ skill }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add wanted skill');
    }

    return await response.json();
  },

  async removeOfferedSkill(skill: string) {
    const response = await fetch(${API_BASE_URL}/api/skills/offer/${encodeURIComponent(skill)}, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove offered skill');
    }

    return await response.json();
  },

  async removeWantedSkill(skill: string) {
    const response = await fetch(${API_BASE_URL}/api/skills/request/${encodeURIComponent(skill)}, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove wanted skill');
    }

    return await response.json();
  },

  async searchSkills(name: string) {
    const response = await fetch(${API_BASE_URL}/api/skills/search?name=${encodeURIComponent(name)}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search skills');
    }

    return await response.json();
  },

  // Swap APIs
  async createSwap(data: any) {
    const response = await fetch(${API_BASE_URL}/api/swaps, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create swap request');
    }

    return await response.json();
  },

  async getSwaps() {
    const response = await fetch(${API_BASE_URL}/api/swaps, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch swaps');
    }

    return await response.json();
  },

  async getSwap(id: string) {
    const response = await fetch(${API_BASE_URL}/api/swaps/${id}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch swap');
    }

    return await response.json();
  },

  async acceptSwap(id: string) {
    const response = await fetch(${API_BASE_URL}/api/swaps/${id}/accept, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to accept swap');
    }

    return await response.json();
  },

  async rejectSwap(id: string) {
    const response = await fetch(${API_BASE_URL}/api/swaps/${id}/reject, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to reject swap');
    }

    return await response.json();
  },

  async cancelSwap(id: string) {
    const response = await fetch(${API_BASE_URL}/api/swaps/${id}, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel swap');
    }

    return await response.json();
  },

  // Feedback APIs
  async submitFeedback(swapId: string, data: any) {
    const response = await fetch(${API_BASE_URL}/api/feedback/${swapId}, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit feedback');
    }

    return await response.json();
  },

  async getUserFeedback(userId: string) {
    const response = await fetch(${API_BASE_URL}/api/feedback/user/${userId}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user feedback');
    }

    return await response.json();
  },

  async getSwapFeedback(swapId: string) {
    const response = await fetch(${API_BASE_URL}/api/feedback/swap/${swapId}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch swap feedback');
    }

    return await response.json();
  },

  // Admin APIs
  async getAdminUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(${API_BASE_URL}/api/admin/users?${queryString}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch admin users');
    }

    return await response.json();
  },

  async banUser(userId: string) {
    const response = await fetch(${API_BASE_URL}/api/admin/users/${userId}/ban, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to ban user');
    }

    return await response.json();
  },

  async unbanUser(userId: string) {
    const response = await fetch(${API_BASE_URL}/api/admin/users/${userId}/unban, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to unban user');
    }

    return await response.json();
  },

  async getAdminSwaps(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(${API_BASE_URL}/api/admin/swaps?${queryString}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch admin swaps');
    }

    return await response.json();
  },

  async deleteSkill(skillId: string) {
    const response = await fetch(${API_BASE_URL}/api/admin/skills/${skillId}, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete skill');
    }

    return await response.json();
  },

  async sendAdminMessage(data: any) {
    const response = await fetch(${API_BASE_URL}/api/admin/messages, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send admin message');
    }

    return await response.json();
  },

  async getAdminReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(${API_BASE_URL}/api/admin/reports?${queryString}, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch admin reports');
    }

    return await response.json();
  },

  // Data fetching APIs
  async getSkills() {
    const response = await fetch(${API_BASE_URL}/api/skills, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch skills');
    }

    return await response.json();
  },

  async getProjects() {
    const response = await fetch(${API_BASE_URL}/api/projects, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch projects');
    }

    return await response.json();
  },

  async getRequests() {
    const response = await fetch(${API_BASE_URL}/api/requests, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch requests');
    }

    return await response.json();
  },

  async healthCheck() {
    const response = await fetch(${API_BASE_URL}/health, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Health check failed');
    }

    return await response.json();
  },
};

export default apiService;
