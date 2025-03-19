import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function PhoneInputField({ onChange, value, ...rest }) {
  const [phoneNumber, setPhoneNumber] = useState("+84");
  const [error, setError] = useState("");

  useEffect(() => {
    setPhoneNumber(value);
  }, [value]);

  const handlePhoneChange = (value, country) => {
    const phoneNumberWithoutCountry = value.slice(country.dialCode.length);

    if (!phoneNumberWithoutCountry.trim()) {
      setError("Phone number is required");
      setPhoneNumber(value);
      return value;
    }

    if (phoneNumberWithoutCountry.replace(/\D/g, "").length > 9) {
      setError("Phone number cannot be longer than 9 digits");
      return phoneNumber || country.dialCode;
    }

    if (!phoneNumberWithoutCountry.startsWith("0")) {
      if (!value.startsWith("+")) {
        value = "+" + value;
      } else {
        value = value.slice(1);
      }

      if (!value.startsWith("+84")) {
        setError("Country code must be +84");
        setPhoneNumber("+84");
        return "+84";
      }

      typeof onChange === "function" && onChange(value);
      setError("");
      setPhoneNumber(value);
      return value;
    } else {
      setPhoneNumber(phoneNumber || country.dialCode);
      return phoneNumber || country.dialCode;
    }
  };

  const handlePaste = (e) => {
    const countryCodeLength = e.target.value.indexOf(" ") + 1;
    const pastedText = e.clipboardData.getData("text");

    if (pastedText.startsWith("0")) {
      e.preventDefault();

      const cleanedPastedText = pastedText.replace(/^0+/, "");

      if (cleanedPastedText.replace(/\D/g, "").length > 9) {
        setError("Phone number cannot be longer than 9 digits");
        return;
      }

      if (cleanedPastedText) {
        const newValue =
          e.target.value.slice(0, countryCodeLength) + cleanedPastedText;

        const inputEvent = new Event("input", { bubbles: true });
        e.target.value = newValue;
        e.target.dispatchEvent(inputEvent);
      }
    }
  };

  return (
    <div>
      <PhoneInput
        disableDropdown
        country={"vn"}
        onlyCountries={["vn"]}
        value={phoneNumber}
        onChange={handlePhoneChange}
        inputClass="!h-12 !bg-white/10 focus:!bg-white !border !border-gray-600 !rounded-lg !w-full"
        inputProps={{
          name: "phone",
          onPaste: handlePaste,
          value: phoneNumber,
        }}
        {...rest}
      />
      {error && <div style={{ color: "red", marginTop: "5px" }}>{error}</div>}
    </div>
  );
}

export default PhoneInputField;
