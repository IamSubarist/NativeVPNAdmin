import axios from "axios";
import { BASE_URL } from "../../../../static";
import axiosInstance from "@/axiosConfig";

export const getDocumentationData = async ({
  start = 1,
  filterOptions = {},
  limit = 10,
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/docs_and_rules/`,
      {
        params: {
          start,
          limit,
          ...filterOptions,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};



export const swapDocumentationPosition = async (firstId, secondId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/docs_rules/swap`,
      {
        first_doc_id: firstId,
        second_doc_id: secondId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при смене позиции:", error);
    throw error;
  }
};

export const deleteDocumentation = async (documentationId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/docs_rules/${documentationId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении вопроса:", error);
    throw error;
  }
};
