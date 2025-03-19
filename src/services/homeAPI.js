import axoisBase from "./axiosBase";

const endpoint = "/home";

async function getNews() {
  try {
    const res = await axoisBase.get(`${endpoint}/news`);
    return res;
  } catch (error) {
    console.error("Error in getNews:", error);
    throw error;
  }
}

export { getNews };
