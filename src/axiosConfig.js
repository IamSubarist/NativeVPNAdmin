import axios from "axios";
import axiosRetry from "axios-retry";

// Создаем axios instance с базовой конфигурацией
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_APP_API_URL_TEST ||
    "https://vpnbot.sjp-asia.group/admin_panel/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем retry логику
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    const delay = retryCount * 1000;
    console.log(`Retry attempt #${retryCount}, delaying request by ${delay}ms`);
    return delay;
  },
  retryCondition: (error) => {
    const shouldRetry = error.response?.status === 504;
    console.log(`Retry condition checked: ${shouldRetry}`);
    return shouldRetry;
  },
});

// Интерцептор для автоматического добавления токена авторизации
axiosInstance.interceptors.request.use(
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

// Интерцептор для обработки ошибок авторизации
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
