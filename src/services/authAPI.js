import { toast } from "react-toastify";
import axoisBase from "./axiosBase";
import { generateSignature } from "../utils/helper";

const endpoint = "/auth";

async function login(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/login`, data);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in login:", error);
    throw error;
  }
}

async function loginWithGoogle(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/login/google`, data);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in login:", error);
    throw error;
  }
}

async function signup(data) {
  try {
    const signature = generateSignature(data);
    data.signature = signature;
    const res = await axoisBase.post(`${endpoint}/signup`, data);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

async function refeshToken() {
  try {
    const res = await axoisBase.post(`${endpoint}/refresh`, {
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken"),
    });
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in refeshToken:", error);
    throw error;
  }
}

async function forgotPassword(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/reset-password`, data);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in forgotPassword:", error);
    throw error;
  }
}

export { login, signup, refeshToken, loginWithGoogle, forgotPassword };
