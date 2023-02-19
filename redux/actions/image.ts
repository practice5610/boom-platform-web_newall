import { Action } from 'redux';

import { ImageActionTypes } from '../actionTypes';

export type ImageAction = UploadImage | GetImage | DeleteImage;

export interface UploadImage extends Action {
  type: ImageActionTypes.IMAGE_UPLOAD;
  payload: { imagedata: FormData; name: string; imageType?: string; override?: boolean };
}

export interface GetImage extends Action {
  type: ImageActionTypes.IMAGE_GET;
  payload: { name: string; width?: number; height?: number };
}

export interface DeleteImage extends Action {
  type: ImageActionTypes.IMAGE_DELETE;
  payload: { name: string; imageType?: string };
}

//Upload Image
export const uploadImage = (imagedata: FormData, name: string, override?: boolean): UploadImage => {
  return {
    type: ImageActionTypes.IMAGE_UPLOAD,
    payload: { imagedata, name, override },
  };
};
//Get Image
export const getImage = (name: string, width?: number, height?: number): GetImage => {
  return {
    type: ImageActionTypes.IMAGE_GET,
    payload: { name, width, height },
  };
};
//Delete Image
export const deleteImage = (name: string, imageType?: string): DeleteImage => {
  return {
    type: ImageActionTypes.IMAGE_DELETE,
    payload: { name, imageType },
  };
};
