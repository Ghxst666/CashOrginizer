import { createApiInstance } from "../lib/api/createApiInstance";
import { getBaseUrl } from "../lib/api/getBaseURl";

export const api = createApiInstance ({
  baseURL: getBaseUrl(),
})