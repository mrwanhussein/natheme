// lib/useAuth.ts
import { jwtDecode } from "jwt-decode";

export const getUserFromToken = (token?: string) => {
  try {
    const t = token ?? localStorage.getItem("token");
    if (!t) return null;
    const decoded: any = jwtDecode(t);
    return decoded;
  } catch {
    return null;
  }
};
