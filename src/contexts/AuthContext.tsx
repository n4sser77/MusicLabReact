// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  setToken,
  getToken,
  removeToken,
  getUserIdFromToken,
} from "../utils/token";
import api from "@/lib/api";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userId: string | null;
  getSignedUrl: (fileName: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userIdFromToken = getUserIdFromToken();
    console.log("userIdFromToken", userIdFromToken);
    // setUserId(userIdFromToken);
    console.log("user id is set");
  }, [token]);

  useEffect(() => console.log(" second effect UserId", userId));

  const getSignedUrl = async (fileName: string): Promise<string> => {
    const storageKey = `signedUrl-${fileName}`;

    // 1. Check localStorage first
const cachedUrl = localStorage.getItem(storageKey);
if (cachedUrl) {
  try {
    const url = new URL(cachedUrl);
    const expiresParam = url.searchParams.get("exp");

    if (expiresParam) {
      const expiresUnix = parseInt(expiresParam, 10) * 1000; // convert to ms
      const now = Date.now();

      if (now < expiresUnix) {
        console.log("Using cached signed URL:", cachedUrl);
        return cachedUrl;
      } else {
        console.log("Cached signed URL expired, removing...");
        localStorage.removeItem(storageKey);
      }
    } else {
      // If no Expires param, assume invalid and clear it
      console.log("Cached signed URL missing expiry, removing...");
      localStorage.removeItem(storageKey);
    }
  } catch (err) {
    console.warn("Invalid cached signed URL, removing...");
    localStorage.removeItem(storageKey);
  }
}


    // 2. If not in cache, request from backend
    try {
      const res = await api.get(`audios/signed-url/${fileName}`);
      console.log("api response from signed url endpoint", res);

      if (res.status !== 200 || !res.data) {
        console.error("Failed to get signed URL");
        return "";
      }

      const signedUrl = res.data;
      console.log("Fetched new signed URL:", signedUrl);

      // 3. Save it to localStorage for later use
      localStorage.setItem(storageKey, signedUrl);

      return signedUrl;
    } catch (err) {
      console.error("Error while fetching signed URL:", err);
      return "";
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        getSignedUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
