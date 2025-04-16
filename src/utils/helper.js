import cryptoJs from "crypto-js";

function generateSignature(data) {
  const { username, displayName, phone, email, password } = data;
  const KEY = import.meta.env.VITE_HASHING_TOKEN;

  const inputString = `username_${username}&displayName_${displayName}&phone_${phone}&email_${email}&password_${password}`;

  const firstHash = cryptoJs
    .MD5(cryptoJs.enc.Utf8.parse(inputString))
    .toString();

  const signatureInput = `data_${firstHash}&key_${KEY}`;

  const signature = cryptoJs
    .MD5(cryptoJs.enc.Utf8.parse(signatureInput))
    .toString();

  return signature;
}

function logoutHelper() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("displayName");
  localStorage.removeItem("userType");
}

function detectUrls(text) {
  if (!text) return;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links = text.match(urlRegex) || [];
  return links?.join(", ");
}

export { generateSignature, logoutHelper, detectUrls };
