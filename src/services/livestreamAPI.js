import axoisBase from "./axiosBase";

const endpoint = "/livestreams";

async function getHotLivestreams() {
  try {
    const res = await axoisBase.get(`${endpoint}/hot`);
    return res;
  } catch (error) {
    console.error("Error in getHotLivestreams:", error);
    throw error;
  }
}

async function getDetailLivestream(livestreamId) {
  try {
    const res = await axoisBase.get(`${endpoint}/detail/${livestreamId}`);
    return res;
  } catch (error) {
    console.error("Error in getDetailLivestream:", error);
    throw error;
  }
}

async function createNewLiveSession(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/session`, data);
    return res;
  } catch (error) {
    console.error("Error in createNewLiveSession:", error);
    throw error;
  }
}

async function addBannedChat(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/hidden-chat`, data);
    return res;
  } catch (error) {
    console.error("Error in addBannedChat:", error);
    throw error;
  }
}

async function getBannedChatList() {
  try {
    const res = await axoisBase.get(`${endpoint}/hidden-user`);
    return res;
  } catch (error) {
    console.error("Error in getBannedChatList:", error);
    throw error;
  }
}

async function unBannedChat(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/open-hidden-chat`, data);
    return res;
  } catch (error) {
    console.error("Error in unBannedChat:", error);
    throw error;
  }
}

async function checkChat(data) {
  try {
    const res = await axoisBase.get(`${endpoint}/check-chat`, { params: data });
    return res;
  } catch (error) {
    console.error("Error in checkChat:", error);
    throw error;
  }
}

async function idolRate(data) {
  try {
    const res = await axoisBase.post(`${endpoint}/rate`, data);
    return res;
  } catch (error) {
    console.error("Error in idolRate:", error);
    throw error;
  }
}

export {
  getHotLivestreams,
  getDetailLivestream,
  createNewLiveSession,
  addBannedChat,
  getBannedChatList,
  unBannedChat,
  checkChat,
  idolRate,
};
