import { createApiInstance } from "../lib/api/createApiInstance";
import { getBaseUrl } from "../lib/api/getBaseURl";

export const api = createApiInstance ({
  baseURL: getBaseUrl(),
  withCredentials: true,
})

export function setApiBaseUrl(baseURL: string): void {
  api.setBaseUrl(baseURL)
}
