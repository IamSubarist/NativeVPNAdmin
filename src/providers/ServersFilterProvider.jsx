import React, { createContext, useContext, useState } from "react";
import axiosInstance from "@/axiosConfig";
import { usePagination } from "@/providers/PaginationContext";
import { BASE_URL } from "../static";

export const ServersFilterContext = createContext();

export const ServersFilterProvider = ({ children }) => {
  const { setTotalPages } = usePagination();
  const [filterOptions, setFilterOptions] = useState({});
  const [isUpdating, setUpdating] = useState(false);
  const [newListServers, setNewListServers] = useState([]);

  const addFilter = (key, option) => {
    console.log("addFilter:", key, option);
    setFilterOptions((prevOptions) => {
      const newOptions = { ...prevOptions, [key]: option };
      console.log("Новые filterOptions:", newOptions);
      return newOptions;
    });
  };

  // Обновление списка серверов
  const updateServersList = async (
    finalFilters = filterOptions,
    page,
    per_page
  ) => {
    try {
      const params = {
        start: page || 0,
        limit: per_page || 10,
        ...finalFilters,
      };

      const response = await axiosInstance.get(`${BASE_URL}/servers/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: params,
      });

      console.log("updateServersList", response.data);
      setNewListServers(response.data);
      setUpdating(false);
      setTotalPages(response.data.total_pages);

      // Обновляем filterOptions только если переданы новые фильтры
      if (finalFilters && Object.keys(finalFilters).length > 0) {
        setFilterOptions(finalFilters);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching servers:", error);
      return null;
    }
  };

  // Очистка всех фильтров
  const clearFilters = () => {
    setFilterOptions({});
    setNewListServers([]); // Очищаем список серверов
  };

  const removeFilter = (key) => {
    console.log("removeFilter:", key);
    setFilterOptions((prevOptions) => {
      const newOptions = { ...prevOptions };
      delete newOptions[key];
      console.log("Новые filterOptions после удаления:", newOptions);
      return newOptions;
    });
  };

  return (
    <ServersFilterContext.Provider
      value={{
        filterOptions,
        newListServers,
        addFilter,
        removeFilter,
        updateServersList,
        clearFilters,
        setUpdating,
      }}
    >
      {children}
    </ServersFilterContext.Provider>
  );
};
