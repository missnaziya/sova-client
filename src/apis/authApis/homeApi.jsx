import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ErrorToaster } from "../../utils/toaster";

export const homeApi = async () => {
  try {
  

    const response = await axios.get(`${baseUrl}home/all`,);
    return response;
  } catch (error) {
    ErrorToaster(error.response?.data?.message || "Home Data not found");
    return null;
  }
};
