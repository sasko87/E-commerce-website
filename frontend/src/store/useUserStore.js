import { create } from "zustand";
import axios from "../components/lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });

      set({
        user: res.data.user,
        loading: false,
      });

      toast.success(res.data.message);
    } catch (error) {
      set({ loading: false });
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred, try again"
      );
    }
  },
  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      set({
        user: response.data.user,
        loading: false,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      set({ loading: false });
      toast.error(error.response?.data?.error || error.message);
    }
  },
  logout: async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/logout");
      set({ user: null });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(res.data.error);
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile");
      console.log(response);
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("http://localhost:5000/api/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
