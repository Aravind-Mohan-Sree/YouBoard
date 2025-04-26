import axios from "axios";
import store from "../store/store";
import { resetAuth } from "../store/authSlice";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Interceptor for handling 401 and 403 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const resData = error.response?.data;
    const status = error.response?.status;

    if (store.getState().auth.isAuthenticated) {
      if (status === 401) {
        store.dispatch(resetAuth());

        toast.error(resData.message, {
          id: "toast",
        });
      }

      if (status === 403) {
        toast.error(resData.message, {
          id: "toast",
        });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
