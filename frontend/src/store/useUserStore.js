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
      const res = await axios.post("/auth/signup", {
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
      const response = await axios.post("/auth/login", { email, password });

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
      const res = await axios.post("/auth/logout");
      set({ user: null });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(res.data.error);
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error);
      set({ checkingAuth: false, user: null });
    }
  },
  refreshToken: async () => {
    if (get().checkingAuth) {
      // Wait until checkingAuth becomes false
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (!get().checkingAuth) {
            clearInterval(interval);
            resolve(get().user); // return updated user/token
            console.log("Refreshed after waiting");
          }
        }, 50);
      });
    }

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      console.log(response);
      set({ user: response.data.user, checkingAuth: false }); // update user/token
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      console.log(error);
      throw error;
    }
  },
}));

// let refreshPromise = null;

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.log("tuka", {
//       url: error.config?.url,
//       method: error.config?.method,
//       data: error.config?.data,
//       response: error.response?.data,
//       status: error.response?.status,
//     });
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // If a refresh is already in progress, wait for it to complete
//         if (refreshPromise) {
//           await refreshPromise;
//           return axios(originalRequest);
//         }

//         // Start a new refresh process
//         refreshPromise = useUserStore.getState().refreshToken();
//         await refreshPromise;
//         refreshPromise = null;

//         return axios(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login or handle as needed
//         useUserStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
