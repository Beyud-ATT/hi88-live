import axoisBase from "./axiosBase";

const endpoint = "/account";

async function getMe() {
  try {
    const res = await axoisBase.get(`${endpoint}/me`);
    return res;
  } catch (error) {
    console.error("Error in getMe:", error);
    throw error;
  }
}

async function updateAccount(data) {
  try {
    const res = await axoisBase.put(`${endpoint}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.error("Error in updateAccount:", error);
    throw error;
  }
}

async function changePassword(data) {
  try {
    const res = await axoisBase.patch(`${endpoint}/change-password`, data);
    return res;
  } catch (error) {
    console.error("Error in changePassword:", error);
    throw error;
  }
}

export { getMe, updateAccount, changePassword };
