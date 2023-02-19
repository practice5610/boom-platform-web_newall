import { ShippingBox, ShippingPolicy } from '@boom-platform/globals';
import { Action } from 'redux';

import { ShippingActionTypes } from '../actionTypes';

export type ShippingAction =
  | RequestBoxesType
  | SetBoxesType
  | SetBoxDetailsType
  | RequestPoliciesType
  | SetPoliciesType
  | SetPolicyDetailsType;

export interface RequestBoxesType extends Action {
  type: ShippingActionTypes.SHIPPING_BOXES_REQUEST;
}

export interface SetBoxesType extends Action {
  type: ShippingActionTypes.SHIPPING_BOXES_SET;
  payload: { shippingBoxes: ShippingBox[] };
}

export interface SetBoxDetailsType extends Action {
  type: ShippingActionTypes.SHIPPING_BOX_DETAILS_SET;
  payload: { shippingBox: ShippingBox };
}

export interface RequestPoliciesType extends Action {
  type: ShippingActionTypes.SHIPPING_POLICIES_REQUEST;
}

export interface SetPoliciesType extends Action {
  type: ShippingActionTypes.SHIPPING_POLICIES_SET;
  payload: { shippingPolicies: ShippingPolicy[] };
}

export interface SetPolicyDetailsType extends Action {
  type: ShippingActionTypes.SHIPPING_POLICY_DETAILS_SET;
  payload: { shippingPolicy: ShippingPolicy };
}

export const requestShippingBoxes = (): RequestBoxesType => {
  return { type: ShippingActionTypes.SHIPPING_BOXES_REQUEST };
};

export const setShippingBoxes = (boxes: ShippingBox[]): SetBoxesType => {
  return {
    type: ShippingActionTypes.SHIPPING_BOXES_SET,
    payload: { shippingBoxes: boxes },
  };
};

export const createShippingBox = (box: ShippingBox): SetBoxDetailsType => {
  return {
    type: ShippingActionTypes.SHIPPING_BOX_DETAILS_SET,
    payload: { shippingBox: box },
  };
};

export const requestShippingPolicies = (): RequestPoliciesType => {
  return {
    type: ShippingActionTypes.SHIPPING_POLICIES_REQUEST,
  };
};

export const setShippingPolicies = (policies: ShippingPolicy[]): SetPoliciesType => {
  return {
    type: ShippingActionTypes.SHIPPING_POLICIES_SET,
    payload: { shippingPolicies: policies },
  };
};

export const createShippingPolicy = (policy: ShippingPolicy): SetPolicyDetailsType => {
  return {
    type: ShippingActionTypes.SHIPPING_POLICY_DETAILS_SET,
    payload: { shippingPolicy: policy },
  };
};
