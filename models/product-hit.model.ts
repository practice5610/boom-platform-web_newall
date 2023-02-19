/**
 * This File is probably gonna be removed
 */

import { Geolocation, Offer, Product } from '@boom-platform/globals';
// TODO: double check this ProductHit interface seems that it needs some rework
export interface ProductHit extends Product {
  categoryName?: string;
  subCategoryName?: string;
  hasOffer?: boolean;
  item: Product | Offer;
  _geoloc?: Geolocation;
  _rankingInfo?: Record<string, unknown>;
}
