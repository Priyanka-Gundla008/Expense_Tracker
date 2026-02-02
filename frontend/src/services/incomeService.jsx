import api from "./api";

export const saveIncome = async (data) => {
    try {
        const response = await api.post("income/save-income", data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const getSummaryData = async (year, month) => {
  try {
    const response = await api.get("/income", {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching income:", error);
    throw error;
  }
};