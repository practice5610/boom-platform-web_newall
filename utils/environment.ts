export const isDevelopment: boolean =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const isServer: boolean = typeof window === 'undefined';
