import { AxiosResponse } from "axios";
import { Prettify } from "../utils";

export type BaseResponse<T> = Promise<AxiosResponse<Prettify<T>>>