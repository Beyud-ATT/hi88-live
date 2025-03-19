import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { createContext, useContext } from "react";
import { loginWithGoogle } from "../services/authAPI";
import { useAuth } from "./AuthContext";

const GoogleAuthContext = createContext();

function GoogleAuthProvider({ children }) {
  const { handleAuthUser } = useAuth();
  const successCallback = async (response) => {
    console.log(response);
    try {
      const res = await loginWithGoogle({
        token: response.credential,
      });
      handleAuthUser(res, "Đăng nhập với Google thành công!");
    } catch (error) {
      console.error("Error in Google login:", error);
    }
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleAuthContext.Provider value={{ successCallback, errorCallback }}>
        {children}
      </GoogleAuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);
  if (context === undefined) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider");
  }
  return context;
}

function GoogleLoginButton(props) {
  const { successCallback, errorCallback } = useGoogleAuth();
  return (
    <GoogleLogin
      theme="outline"
      onSuccess={successCallback}
      onError={errorCallback}
    />
  );
}

function GoogleOneTap() {
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return <button>One Tap Login</button>;
}

GoogleAuthProvider.GoogleLoginButton = GoogleLoginButton;

export { GoogleAuthProvider, useGoogleAuth };
