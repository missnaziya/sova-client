import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";

export const contactFormApi = async (data, token) => {
  try {
    const response = await axios.post(`${baseUrl}contact`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    SuccessToaster(response?.data?.message);
    return response;
  } catch (error) {
    ErrorToaster(
      error.response?.data?.message || "Error submission. Try again."
    );
    return null;
  }
};
