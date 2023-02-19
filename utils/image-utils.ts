import { v4 as uuidv4 } from 'uuid';

export const dataURLtoFile = (dataurl, filename): File => {
  const arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const urlToBase64 = async (url) => {
  const base64image = require('base64-image-encoder');

  const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let base64 = await base64image(url);
  base64 = base64
    .split('')
    .filter((ch) => BASE64.includes(ch))
    .join('');
  return base64;
};

export const base64ToExt = (encoded): string | null => {
  let ext: string | null = null;
  const code = encoded[0];
  if (code == '/') {
    ext = 'jpeg';
  } else if (code == 'i') {
    ext = 'png';
  } else if (code == 'R') {
    ext = 'gif';
  } else if (code == 'U') {
    ext = 'webp';
  }

  return ext;
};

export const base64ToImageSrc = (base64): string | null => {
  if (!base64) {
    return null;
  }
  const ext = base64ToExt(base64);
  if (!ext) {
    return null;
  }
  return `data:image/${ext};base64,${base64}`;
};

export const fileToBase64 = (files): Promise<any> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const existImage = (url): boolean => {
  return url && url !== '';
};

export const parseUUID = (url): string | null => {
  if (!existImage(url)) return null;
  const uuid = url.split('/').pop();
  return uuid.slice(8);
};

export const generateUUID = (): string => {
  return uuidv4();
};
