import axios from "axios";

// const API_URL = "https://api-website-delta.vercel.app/api/v1/user"; // Sesuaikan dengan URL backend
const API_URL = "http://localhost:5000/api/v1/user";

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData, {
    withCredentials: true,
  });
  return response.data;
};

// Login user
export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/login`, loginData, {
    withCredentials: true,
  });
  return response.data;
};

// Verify OTP
export const verifyOtp = async (otpData) => {
  const response = await axios.post(`${API_URL}/verify-otp`, otpData, {
    withCredentials: true,
  });
  return response.data;
};

// Resend OTP
export const resendOtp = async (email) => {
  const response = await axios.post(
    `${API_URL}/resend-otp`,
    { email },
    { withCredentials: true }
  );
  return response.data;
};

// Get user data
export const me = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "No valid session found" };
  }
};

//get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/get/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "No valid session found" };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, null, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
