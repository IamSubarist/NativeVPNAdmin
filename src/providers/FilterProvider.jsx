import React, { createContext, useState, useMemo } from "react";
import axiosInstance from "@/axiosConfig";
import { usePagination } from "@/providers/PaginationContext";

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const { setTotalPages } = usePagination();
  const [filters, setFilters] = useState({});
  // const [filterOptions, setFilterOptions] = useState({});
  const [isUpdating, setUpdating] = useState(false);
  const [newListUsers, setNewListUsers] = useState([]);

  // const addFilter = (key, option) => {
  //   setFilterOptions((prevOptions) => {
  //     const newOptions = { ...prevOptions, [key]: option };
  //     return newOptions;
  //   });
  // };

  const addFilter = (key, option) => {
    setFilters((prev) => ({
      ...prev,
      [key]: option,
    }));
  };

  const removeFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  // Обновление списка пользователей
  // const updateUserList = async (newfilters, page) => {
  //   const searchParamBackup = JSON.parse(JSON.stringify(newfilters));
  //   let obj = {};

  //   // Сохраняем searchParam, если он существует
  //   if (
  //     newfilters.searchParamType &&
  //     newfilters.searchParamInput !== undefined
  //   ) {
  //     obj[newfilters.searchParamType] = newfilters.searchParamInput;
  //   }
  //   if (newfilters.searchParamType !== undefined) {
  //     delete newfilters.searchParamType;
  //   }
  //   if (newfilters.searchParamInput !== undefined) {
  //     delete newfilters.searchParamInput;
  //   }

  //   try {
  //     const params = {
  //       page: page,
  //       ...newfilters, // Дополнительные параметры
  //       ...obj, // Параметр поиска (если есть)
  //     };
  //     const response = await axios.get(`${BASE_URL}/users/`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       params: params,
  //     });
  //     console.log("updateUserList", response.data);
  //     setNewListUsers(response.data);
  //     setUpdating(false);
  //     console.log("response.data.total_pages!!!!!!", response.data.total_pages);

  //     setTotalPages(response.data.total_pages);
  //     setFilterOptions((prevOptions) => ({
  //       ...prevOptions,
  //       ...searchParamBackup,
  //     }));

  //     console.log(filterOptions, "filterOptions updateUserList");
  //   } catch (error) {
  //     console.error("Error fetching giveaways:", error);
  //   }
  // };

  const updateUserList = async (
    finalFilters = filters,
    page,
    per_page,
    retries = 5
  ) => {
    try {
      // Преобразуем параметры из page/per_page в offset/limit
      const params = { ...finalFilters };
      if (page !== undefined) {
        params.offset = (page - 1) * (per_page || 10); // offset как смещение элементов (0, 10, 20...)
      }
      if (per_page !== undefined) {
        params.limit = per_page;
      }

      const response = await axiosInstance.get(
        "https://vpnbot.sjp-asia.group/admin_panel/api/users/",
        { params }
      );

      setNewListUsers(response.data);
      setTotalPages(response.data.total_pages || 1);
      setUpdating(false);
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying updateUserList, attempts left: ${retries}`);
        return updateUserList(finalFilters, page, per_page, retries - 1);
      }
      console.log("Filters params:", finalFilters);
      console.error("Ошибка при загрузке пользователей:", error);
      setNewListUsers({ items: [], total_items: 0, total_pages: 1 });
    }
  };

  // Очистка всех фильтров
  // const clearFilters = () => {
  //   setFilterOptions({});
  //   setNewListUsers([]); // Очищаем список пользователей
  // };

  const clearFilters = () => {
    setFilters({});
    setNewListUsers([]);
  };

  const filterOptions = useMemo(() => filters, [filters]);

  return (
    <FilterContext.Provider
      value={{
        filterOptions,
        newListUsers,
        addFilter,
        clearFilters,
        setUpdating,
        removeFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
