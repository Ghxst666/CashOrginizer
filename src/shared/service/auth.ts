import axios from "axios";
import { getBaseUrl } from "../lib/api/getBaseURl";

export const auth = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
})

export function setAuthBaseUrl(baseURL: string): void {
  auth.defaults.baseURL = baseURL
}
