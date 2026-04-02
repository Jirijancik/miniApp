import type { AxiosRequestConfig } from 'axios';

import { axiosInstance } from './axios-instance';

// Orval mutator — all generated API functions call this
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data);
};

export default customInstance;
