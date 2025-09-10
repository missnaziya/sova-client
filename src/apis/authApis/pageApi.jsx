import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ErrorToaster } from "../../utils/toaster";


export const pageApi = async () => {
    try {
        const token = localStorage.getItem("sovaToken");
      const response = await axios.get(`${baseUrl}page/all` , {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      });
      return response;
    } catch (error) {
      ErrorToaster(error.response?.data?.message || "Page not found");
      return null;
    }
  };

