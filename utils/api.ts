import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

let api: AxiosInstance;
let errorHandler: ((any) => void) | null = (error): void => {
  console.log(error);
};

export const apiInitialize = () => {
  api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
      Accept: 'application/json',
    },
  } as AxiosRequestConfig);
  // Add a response interceptor
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      errorHandler?.(error);
      return Promise.reject(error);
    }
  );
};

export const onAPIError = (handleError) => {
  errorHandler = handleError;
  return () => (errorHandler = null);
};

const setAuthHeader = async (jwt) => {
  return jwt ? { Authorization: `Bearer ${jwt}` } : null;
};

export const get = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig,
  jwt: string | null = null
): Promise<R> => {
  const header: Record<string, unknown> | null = await setAuthHeader(jwt);
  return api.get(url, { headers: header, ...config });
};

export const remove = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig,
  jwt: string | null = null
): Promise<R> => {
  const header: Record<string, unknown> | null = await setAuthHeader(jwt);
  return api.delete(url, { headers: header, ...config });
};

export const patch = async <T = any, R = AxiosResponse<T>>(
  url: string,
  body: any,
  config?: AxiosRequestConfig,
  jwt: string | null = null
): Promise<R> => {
  const header: Record<string, unknown> | null = await setAuthHeader(jwt);
  return api.patch(url, body, {
    ...config,
    headers: {
      ...header,
      ...(config ? config.headers : {}),
    },
  });
};

export const post = async <T = any, R = AxiosResponse<T>>(
  url: string,
  body: any,
  config?: AxiosRequestConfig,
  jwt: string | null = null
): Promise<R> => {
  const header: Record<string, unknown> | null = await setAuthHeader(jwt);
  return api.post(url, body, {
    ...config,
    headers: {
      ...header,
      ...(config ? config.headers : {}),
    },
  });
};

export const del = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig,
  jwt: string | null = null
): Promise<R> => {
  const header: Record<string, unknown> | null = await setAuthHeader(jwt);
  return api.delete(url, { ...config, headers: { ...header, ...(config ? config.headers : {}) } });
};

export const put = async <T = any, R = AxiosResponse<T>>(
  url: string,
  body: any,
  config?: AxiosRequestConfig,
  jwt: string | null = null
): Promise<R> => {
  const header: Record<string, unknown> | null = await setAuthHeader(jwt);
  return api.put(url, body, { headers: header, ...config });
};
