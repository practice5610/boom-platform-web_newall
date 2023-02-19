import { ShippingBox, ShippingPolicy } from '@boom-platform/globals';
import { Reducer } from 'redux';

import { ShippingAction } from '../actions/shipping';
import { ShippingActionTypes } from '../actionTypes';

export interface ShippingState {
  shippingBoxes: ShippingBox[] | [];
  shippingBoxDetails: ShippingBox | null;
  shippingPolicies: ShippingPolicy[] | [];
  shippingPolicyDetails: ShippingPolicy | null;
}

const initState = {
  shippingBoxes: [],
  shippingBoxDetails: null,
  shippingPolicies: [],
  shippingPolicyDetails: null,
};

export const shipping: Reducer<ShippingState, ShippingAction> = (state = initState, action) => {
  switch (action.type) {
    case ShippingActionTypes.SHIPPING_BOXES_SET:
      return {
        ...state,
        shippingBoxes: action.payload.shippingBoxes,
      };
    case ShippingActionTypes.SHIPPING_BOX_DETAILS_SET:
      return {
        ...state,
        shippingBoxDetails: action.payload.shippingBox,
      };
    case ShippingActionTypes.SHIPPING_POLICIES_SET:
      return {
        ...state,
        shippingPolicies: action.payload.shippingPolicies,
      };
    case ShippingActionTypes.SHIPPING_POLICY_DETAILS_SET:
      return {
        ...state,
        shippingPolicyDetails: action.payload.shippingPolicy,
      };
  }
  return state;
};
