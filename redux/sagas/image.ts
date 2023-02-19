import { call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { del, get, post } from '../../utils/api';
import * as errorActions from '../actions/errors';
import * as imageActions from '../actions/image';
import { ImageActionTypes } from '../actionTypes';
import { getAuthState } from '../selectors';

export function* imageSave(imageData: any, imageName: string, override: boolean) {
  const { jwt }: { jwt: string } = yield select(getAuthState);
  // Override === true
  if (override === true) {
    try {
      yield call(
        del,
        `/images/${imageName}`,
        { headers: { 'Content-Type': 'multipart/form-data' } },
        jwt
      );
    } catch (error: any) {
      yield put(errorActions.setAPIError(error.toString()));
    }
  }
  // Override ==== false
  try {
    yield call(
      post,
      `/images/${imageName}`,
      // proxyurl + url,
      imageData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
      jwt
    );
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* imageRemove(imageName: string) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    if (imageName.length === 0) return;
    yield call(
      del,
      `/images/${imageName}`,
      { headers: { 'Content-Type': 'multipart/form-data' } },
      jwt
    );
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* imageGet(action: imageActions.GetImage) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const imagename = action.payload.name;
    const width = action.payload.width ? action.payload.width : 0;
    const height = action.payload.height ? action.payload.height : 0;
    if (width > 0 && height > 0) {
      yield call(get, `/images/${imagename}?width=${width}&height=${height}`, {}, jwt);
    } else {
      yield call(get, `/images/${imagename}`, {}, jwt);
    }
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* imageUpload(action: imageActions.UploadImage) {
  const data = action.payload.imagedata;
  const imageName = action.payload.name;
  const override = action.payload.override ? action.payload.override : false;
  yield call(imageSave, data, imageName, override);
}

export function* imageDelete(action: imageActions.DeleteImage) {
  const imageName = action.payload.name;
  yield call(imageRemove, imageName);
}

export function* watchRequests() {
  yield takeEvery(ImageActionTypes.IMAGE_UPLOAD, imageUpload);
  yield takeLatest(ImageActionTypes.IMAGE_GET, imageGet);
  yield takeEvery(ImageActionTypes.IMAGE_DELETE, imageDelete);
}

export default function* root() {
  yield fork(watchRequests);
}
