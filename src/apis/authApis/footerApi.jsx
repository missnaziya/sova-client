import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ErrorToaster } from "../../utils/toaster";



export const footerApi = async () => {
    try {
      const response = await axios.get(`${baseUrl}footer`);
      return response;
    } catch (error) {
      ErrorToaster(error.response?.data?.message || "Footer Data not found");
      return null;
    }
  };

