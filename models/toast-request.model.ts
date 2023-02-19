import { ToastTypes } from '../constants';

export interface ToastRequest {
  heading: string;
  body: string;
  type: ToastTypes;
}
