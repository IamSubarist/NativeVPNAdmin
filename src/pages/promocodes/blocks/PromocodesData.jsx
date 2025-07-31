import axiosInstance from "../../../axiosConfig";

export const getPromocodesData = async ({ params }) => {
  try {
    const response = await axiosInstance.get(
      "https://vpnbot.sjp-asia.group/admin_panel/api/promocode/",
      { params }
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

export const deletePromocode = async (promocodeId) => {
  try {
    const response = await axiosInstance.delete(
      `https://vpnbot.sjp-asia.group/admin_panel/api/promocode/${promocodeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении промокода:", error);
    throw error;
  }
};

export const swapPromocodesPosition = async (firstId, secondId) => {
  try {
    const response = await axiosInstance.patch(
      "https://vpnbot.sjp-asia.group/admin_panel/api/promocode/swap",
      {
        first_promocode_id: firstId,
        second_promocode_id: secondId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при смене позиции промокода:", error);
    throw error;
  }
};
