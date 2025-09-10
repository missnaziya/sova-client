import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";

export const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("sovaToken");
    const response = await axios.get(`${baseUrl}my-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    SuccessToaster(response?.data?.message);
    return response;
  } catch (error) {
    ErrorToaster(error.response?.data?.message || "Data not found");
    return null;
  }
};

export const updateProfile = async (payload) => {
  try {
    const token = localStorage.getItem("sovaToken");
    console.log(token);
    const response = await axios.put(`${baseUrl}my-profile/update`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    SuccessToaster(response?.data?.message);
    return response;
  } catch (error) {
    ErrorToaster(error.response?.data?.message || "Data not found");
    return null;
  }
};
