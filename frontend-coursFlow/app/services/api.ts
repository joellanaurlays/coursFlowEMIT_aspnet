import axiosInstance from './axios';

export const api = {
  get: <T>(url: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> => 
    axiosInstance.get(url, { params }).then((res: { data: T }) => res.data),
  
  post: <T>(url: string, data?: unknown): Promise<T> => 
    axiosInstance.post(url, data).then((res: { data: T }) => res.data),
  
  put: <T>(url: string, data?: unknown): Promise<T> => 
    axiosInstance.put(url, data).then((res: { data: T }) => res.data),
  
  delete: <T>(url: string): Promise<T> => 
    axiosInstance.delete(url).then((res: { data: T }) => res.data),
};