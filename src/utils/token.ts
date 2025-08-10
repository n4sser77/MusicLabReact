// utils/token.ts
import { jwtDecode } from "jwt-decode";

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

interface JwtPayload {
  sub?: string;
  userId?: string;
  nameid?: string;
  // other claims...
}

export function getUserIdFromToken(): string | null {
  try {
   
    const token = getToken();
    console.log("token", token)
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("Decoded token",decoded)
      return  decoded.sub ?? decoded.nameid ?? null;
    }
    return null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
