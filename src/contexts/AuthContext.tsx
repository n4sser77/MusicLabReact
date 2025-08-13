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

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userIdFromToken = getUserIdFromToken();
    console.log("userIdFromToken", userIdFromToken);
    // setUserId(userIdFromToken);
    console.log("user id is set")
    
  }, [token]);

  useEffect(() => console.log(" second effect UserId", userId))

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
      value={{ userId,token, login, logout, isAuthenticated: !!token }}
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
