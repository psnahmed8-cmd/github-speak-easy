const API_BASE = '/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('auth_token');

// Set up headers for API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: getHeaders(),
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// Auth API functions
export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () => apiRequest('/user/profile'),

  updateProfile: (data: { name?: string; company?: string; role?: string }) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Projects API functions
export const projectsApi = {
  getProjects: () => apiRequest('/projects'),

  createProject: (project: { title: string; description?: string }) =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),

  getProject: (id: string) => apiRequest(`/projects/${id}`),

  updateProject: (id: string, data: any) =>
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProject: (id: string) =>
    apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    }),

  analyzeProject: (projectId: string, analysisType?: string) =>
    apiRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify({ projectId, analysisType }),
    }),
};