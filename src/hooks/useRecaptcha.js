import { useState } from "react";

let length = 4;

export default function useRecaptcha() {
  const [recaptcha, setRecaptcha] = useState(generateRecaptcha());

  function validateCaptcha(captcha, reload = true) {
    reload && resetRecaptcha();
    return captcha === recaptcha;
  }

  function resetRecaptcha() {
    const generatedCaptcha = generateRecaptcha();
    setRecaptcha(generatedCaptcha);
  }

  return { recaptcha, resetRecaptcha, validateCaptcha, setRecaptchaLength };
}

function generateRecaptcha() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

function setRecaptchaLength(newLength) {
  length = newLength;
}
