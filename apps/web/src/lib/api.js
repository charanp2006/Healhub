import axios from "axios";

export const backendURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: `${backendURL}/api` });

export function getAuthHeaders(tokenName = "token") {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(tokenName) : null;
  return token ? { [tokenName]: token } : {};
}
