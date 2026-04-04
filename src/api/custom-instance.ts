import { axiosInstance } from "./axios-instance";

import type { AxiosRequestConfig } from "axios";

// Orval mutator — all generated API functions call this
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data);
};

export default customInstance;
