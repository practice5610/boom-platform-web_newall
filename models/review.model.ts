import { ModelBase, Store } from '@boom-platform/globals';

export interface Review extends ModelBase {
  content: string;
  date: number;
  memberUID: string;
  merchantUID: string;
  rating: number;
  store: Partial<Store>;
}
