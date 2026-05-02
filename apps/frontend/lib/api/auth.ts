import { api, ApiResponse } from "../api";

export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

async function requestAuth<T>(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  return api.post<T>(endpoint, body);
}

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await requestAuth<AuthResponse>("/auth/login", {
      username,
      password,
    });
    if (response.success && response.data) {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response;
  },

  register: async (username: string, password: string) => {
    const response = await requestAuth<AuthResponse>("/auth/register", {
      username,
      password,
    });
    if (response.success && response.data) {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  getUser: (): AuthUser | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};