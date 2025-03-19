import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  login as loginAPI,
  signup as signupAPI,
  refeshToken as refeshTokenAPI,
} from "../services/authAPI";
import { toast } from "react-toastify";
import { logoutHelper } from "../utils/helper";
import { useLocation, useNavigate } from "react-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { UserType } from "../utils/constant";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const isUserPage = pathName.startsWith("/user");

  const [fpHash, setFpHash] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") !== null
  );
  const [isIdol, setIsIdol] = useState(
    localStorage.getItem("userType") === UserType.IDOL
  );

  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();

      const { visitorId } = await fp.get();

      setFpHash(visitorId);
    };

    setFp();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && isUserPage) {
      navigate("/");
      toast.error("Vui lòng đăng nhập");
    }
  }, [isAuthenticated, isUserPage, navigate]);

  const logout = useCallback(async () => {
    try {
      logoutHelper();
      setIsAuthenticated(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Error in logout:", error);
      throw error;
    }
  }, []);

  const handleAuthUser = useCallback(async (res, message) => {
    if (res.status === 200) {
      const { token, refreshToken, userId, displayName, userType } =
        res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("displayName", displayName);
      localStorage.setItem("userType", userType);
      setIsIdol(userType == UserType.IDOL);
      setIsAuthenticated(true);
      if (message) {
        toast.success(message);
      }

      return;
    }
  }, []);

  const refeshToken = useCallback(async () => {
    try {
      const res = await refeshTokenAPI();
      await handleAuthUser(res, null);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error in refeshToken:", error);
      throw error;
    }
  }, [handleAuthUser]);

  const handleUnauthenticated = useCallback(
    async (res) => {
      if (res.status === 401) {
        if (res.data.error === -3) {
          await refeshToken();
        }

        if (res.data.error === -4) {
          await logout();
        }
        setIsAuthenticated(false);

        return;
      }
    },
    [logout, refeshToken]
  );

  const signup = useCallback(
    async (data) => {
      try {
        const res = await signupAPI(data);
        await handleAuthUser(res, "Đăng ký thành công!");
      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Error in signup:", error);
        throw error;
      }
    },
    [handleAuthUser]
  );

  const login = useCallback(
    async (data) => {
      try {
        const res = await loginAPI(data);
        await handleAuthUser(res, res.data.message);
        return res;
      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Error in login:", error);
        handleUnauthenticated(error.response);
        throw error;
      }
    },
    [handleAuthUser, handleUnauthenticated]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        handleAuthUser,
        fpHash,
        refeshToken,
        isIdol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
