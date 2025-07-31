/* eslint-disable no-unused-vars */
import axios from "axios";
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
    if (auth) {
      setCurrentUser(MOCK_USER);
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
    } else {
      authHelper.removeAuth();
    }
  };
  const login = async (email, password) => {
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      saveAuth(MOCK_AUTH);
      setCurrentUser(MOCK_USER);
      // Можно выбирать редирект по permissions, но для моковой версии просто dashboard
      return DEFAULT_REDIRECT;
    } else {
      saveAuth(undefined);
      setCurrentUser(undefined);
      throw new Error("Неверный логин или пароль");
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
    if (auth) return { data: MOCK_USER };
    throw new Error("Нет авторизации");
  };
  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
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
