/* eslint-disable no-unused-vars */
import axios from "axios";
import axiosInstance from "@/axiosConfig";
import { createContext, useEffect, useState } from "react";
import * as authHelper from "../_helpers";
const API_URL = import.meta.env.VITE_APP_API_URL;
const API_URL_TEST = import.meta.env.VITE_APP_API_URL_TEST;
// export const LOGIN_URL = `${API_URL}/login`;
export const LOGIN_URL = `${API_URL_TEST}/auth`;
export const REGISTER_URL = `${API_URL}/register`;
export const FORGOT_PASSWORD_URL = `${API_URL}/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/reset-password`;
// export const GET_USER_URL = `${API_URL}/user`;
export const GET_USER_URL = `/api/dashboard`;

const sectionRedirectMap = {
  Дашборды: "/dashboard",
  Статистика: "/statistics",
  Пользователи: "/users",
  Конкурсы: "/giveaways",
  Задания: "/tasks",
  FAQ: "/faq",
  "Документы и правила": "/documentation",
  Рассылки: "/mailing",
  Доступы: "/access",
};

const AuthContext = createContext(null);
const MOCK_EMAIL = "admin@mail.com";
const MOCK_PASSWORD = "123456";
const MOCK_AUTH = { token: "mock-token", adminId: 1 };
const MOCK_USER = {
  id: 1,
  email: MOCK_EMAIL,
  permissions: [
    { name: "Дашборды" },
    { name: "Статистика" },
    { name: "Пользователи" },
    { name: "Конкурсы" },
    { name: "Задания" },
    { name: "FAQ" },
    { name: "Документы и правила" },
    { name: "Рассылки" },
    { name: "Доступы" },
  ],
};
const DEFAULT_REDIRECT = "/dashboard";
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState();
  const verify = async () => {
    if (auth && auth.token) {
      try {
        const response = await axiosInstance.get(`${API_URL_TEST}/auth/login`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (response.data && response.data.user) {
          setCurrentUser(response.data.user);
        } else {
          setCurrentUser(MOCK_USER);
        }
      } catch (error) {
        console.error("Ошибка проверки токена:", error);
        // Если токен недействителен, очищаем авторизацию
        if (error.response && error.response.status === 401) {
          saveAuth(undefined);
          setCurrentUser(undefined);
        } else {
          // При других ошибках используем моковые данные
          setCurrentUser(MOCK_USER);
        }
      }
    } else {
      setCurrentUser(undefined);
    }
  };
  useEffect(() => {
    verify();
    setLoading(false);
    // eslint-disable-next-line
  }, []);
  const saveAuth = (auth) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
      // Сохраняем токен в localStorage для axios instance
      localStorage.setItem("token", auth.token);
    } else {
      authHelper.removeAuth();
      // Удаляем токен из localStorage
      localStorage.removeItem("token");
    }
  };
  const login = async (email, password) => {
    try {
      console.log("Отправляем запрос на авторизацию:", {
        url: `https://vpnbot.sjp-asia.group/admin_panel/api/auth/login`,
        username: email,
        password: password,
      });

      // Отправляем данные в формате form-data как требует сервер
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axiosInstance.post(
        `https://vpnbot.sjp-asia.group/admin_panel/api/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Ответ сервера:", response.data);

      if (response.data && response.data.access_token) {
        const authData = {
          token: response.data.access_token,
          adminId: response.data.adminId || 1,
        };
        saveAuth(authData);
        setCurrentUser(response.data.user || MOCK_USER);
        return DEFAULT_REDIRECT;
      } else {
        throw new Error("Неверный ответ от сервера");
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      console.error("Детали ошибки:", error.response?.data);

      saveAuth(undefined);
      setCurrentUser(undefined);

      if (error.response) {
        // Сервер вернул ошибку
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.detail ||
          "Ошибка авторизации";
        throw new Error(errorMessage);
      } else if (error.request) {
        // Запрос был отправлен, но ответ не получен
        throw new Error("Ошибка соединения с сервером");
      } else {
        // Ошибка при настройке запроса
        throw new Error("Ошибка при отправке запроса");
      }
    }
  };
  // Остальные методы — фиктивные
  const register = async () => {
    throw new Error("Регистрация недоступна в демо-режиме");
  };
  const requestPasswordResetLink = async () => {
    throw new Error("Восстановление пароля недоступно в демо-режиме");
  };
  const changePassword = async () => {
    throw new Error("Смена пароля недоступна в демо-режиме");
  };
  const getUser = async () => {
    if (auth && auth.token) {
      try {
        const response = await axiosInstance.get(`${API_URL_TEST}/auth/user`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        return response;
      } catch (error) {
        console.error("Ошибка получения данных пользователя:", error);
        throw new Error("Ошибка получения данных пользователя");
      }
    } else {
      throw new Error("Нет авторизации");
    }
  };
  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
    // Дополнительно очищаем localStorage
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider
      value={{
        isLoading: loading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        getUser,
        logout,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };
