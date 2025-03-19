import axios from "axios";
import { logoutHelper } from "../utils/helper";

const axoisBase = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axoisBase.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axoisBase.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      if (error.response.data.error === -3) {
        logoutHelper();
        window.location.href = "/";
      }

      if (error.response.data.error === -4) {
        //TODO: refresh token
      }
    }
    return Promise.reject(error);
  }
);

export default axoisBase;
