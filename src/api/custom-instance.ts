import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

import { API_BASE_URL } from '@/constants/config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data);
};

export default customInstance;
