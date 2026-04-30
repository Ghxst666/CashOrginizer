import { createApiInstance } from "../lib/api/createApiInstance";

export const api = createApiInstance ({
  baseURL: import.meta.env.VITE_API_URL,
})