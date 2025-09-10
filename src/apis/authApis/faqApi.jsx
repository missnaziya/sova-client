import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ErrorToaster } from "../../utils/toaster";
baseUrl


export const faqApi = async () => {
    try {
        const token = localStorage.getItem("sovaToken");
      const response = await axios.get(`${baseUrl}faq/all` , {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      });
      return response;
    } catch (error) {
      ErrorToaster(error.response?.data?.message || "Faq Data not found");
      return null;
    }
  };

