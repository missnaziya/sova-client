import axios from "axios";
import { baseUrlHeader } from "../../utils/baseUrl";
import { ErrorToaster } from "../../utils/toaster";


export const headerApi = async () => {
    try {
      const response = await axios.get(`${baseUrlHeader}header`);
      return response;
    } catch (error) {
      ErrorToaster(error.response?.data?.message || "Header Data not found");
      return null;
    }
  };

