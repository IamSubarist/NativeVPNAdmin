import axiosInstance from "@/axiosConfig";

export const getUsersData = async ({ params }) => {
  console.log("token", localStorage.getItem("token"));
  try {
    // Преобразуем параметры из page/per_page в offset/limit
    const apiParams = { ...params };
    if (apiParams.page !== undefined) {
      apiParams.offset = (apiParams.page - 1) * (apiParams.per_page || 10); // offset как смещение элементов (0, 10, 20...)
      delete apiParams.page;
    }
    if (apiParams.per_page !== undefined) {
      apiParams.limit = apiParams.per_page;
      delete apiParams.per_page;
    }

    const response = await axiosInstance.get(
      "https://vpnbot.sjp-asia.group/admin_panel/api/users/",
      { params: apiParams }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return {
      items: [],
      total_items: 0,
      total_pages: 1,
    };
  }
};
