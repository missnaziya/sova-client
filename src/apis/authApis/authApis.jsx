import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";

// eslint-disable-next-line react-refresh/only-export-components
export const signUpApi = async (data, navigate) => {
  try {
    const response = await axios.post(`${baseUrl}auth/register`, data);
    SuccessToaster(response.data.message);
    navigate("/signin");
  } catch (error) {
    ErrorToaster(error.response?.data?.message || "Signup failed. Try again.");
    return null;
  }
};

export const LoginApi = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}auth/login`, data);
    SuccessToaster(response?.data?.message);
 
    return response;
  } catch (error) {
    ErrorToaster(error.response?.data?.message || "Login failed. Try again.");
    return null;
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const forgotPasswordReqApi = async (data ) => {
    try {
        const response = await axios.post(`${baseUrl}auth/forget-password/request`, data);
        SuccessToaster(response.data.message);
        return response;
    } catch (error) {
        ErrorToaster(error.response?.data?.message || "Otp failed. Try again.");
        return null;

    }
};



// eslint-disable-next-line react-refresh/only-export-components
export const otpVerifyApi = async (data ) => {
    try {
        const response = await axios.post(`${baseUrl}auth/forget-password/verify`, data);
        SuccessToaster(response.data.message);
        return response;
    } catch (error) {
        ErrorToaster(error.response?.data?.message || "Verification failed. Try again.");
        return null;

    }
};



// eslint-disable-next-line react-refresh/only-export-components
export const changePasswordApi = async (data ) => {
    try {
        const response = await axios.post(`${baseUrl}auth/forget-password/update`, data);
        SuccessToaster(response.data.message);
        return response;
    } catch (error) {
        ErrorToaster(error.response?.data?.message || "Verification failed. Try again.");
        return null;

    }
};




