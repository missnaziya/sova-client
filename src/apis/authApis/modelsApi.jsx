import axios from "axios";
import { ErrorToaster } from "../../utils/toaster";

export const fetchAllModels = async () => {
  try {
    const token = localStorage.getItem('sovaToken'); // Retrieve token from localStorage
    const response = await axios.get('https://sova-admin.cyberxinfosolution.com/api/model-category/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    ErrorToaster(error.response?.data?.message || "Failed to fetch models");
    return null;
  }
}; 