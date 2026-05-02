import axios from "axios";
import { getBaseUrl } from "../lib/api/getBaseURl";

export const auth = axios.create({
  baseURL: getBaseUrl(),
})