import axoisBase from "./axiosBase";
import { toast } from "react-toastify";

const endpoint = "/users";

async function getListFollowing(userId) {
  try {
    const res = await axoisBase.get(`${endpoint}/follow/${userId}`);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in getListFollowing:", error);
    throw error;
  }
}

async function getFollowCount(userId) {
  try {
    const res = await axoisBase.get(`${endpoint}/count-follow/${userId}`);
    return res;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error in getFollowCount:", error);
    throw error;
  }
}

export { getListFollowing, getFollowCount };
