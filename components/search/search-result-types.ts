import { Money } from '@boom-platform/globals';
import { AxiosError } from 'axios';
import { InfiniteQueryResult } from 'react-query';

import { ElasticError } from './search-query-types';

export type ElasticSearchResult<T> = {
  scroll_id?: string;
  data: T[];
  aggregations?: any;
};

export interface Geolocation {
  lat: number | null;
  lng: number | null;
}

export interface GeoPoint {
  lat: number;
  lon: number;
}
export type SearchableGeoObject = GeoPoint;

export type SearchableGeoArray = [number, number];

export type SearchableGeoLocation = SearchableGeoObject | SearchableGeoArray;

export interface EntityCreateUpdateTimestamp {
  createdAt?: number | string | Date;
  updatedAt?: number | string | Date;
}
export type ElasticIndex = {
  name: string;
};

export type Searchable = EntityCreateUpdateTimestamp & {
  id: string;
  backingType: string;
};

export type SearchableJoinField = {
  name: string;
  parent?: string;
};

export type SearchableResult = Searchable | Searchable[];

export type SearchableAddress = {
  address?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
};

export type SearchableProduct = Searchable & {
  merchantUID: string;
  storeUID: string;
  category: string;
  subCategory: string;
  hasOffer: boolean;
  imageUrl?: string;
  name: string;
  description: string;
  location: SearchableGeoLocation;
  price: Money;
  tags?: string[];
  offer?: { cashBackPerVisit: Money; _id: string; expiration: number; startDate: number };

  'price.amount': string;
  'attributes.brand_name.keyword': string;
  'categoryName.keyword': string;
};

export type SearchableProductKeywords = SearchableProduct & {
  'category.keyword': string;
  'subCategoryName.keyword': string;
};

export type ProductSearchResult =
  | InfiniteQueryResult<
      ElasticSearchResult<SearchableProduct | undefined>,
      AxiosError<ElasticError>
    >
  | undefined;

export type ElasticProductQueryScroll = Promise<ElasticSearchResult<SearchableProduct>>;

export enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
  None = -1,
  Always = Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday,
}

export enum HourOfDayExtension {
  None = -1,
  Always = 0 |
    1 |
    2 |
    3 |
    4 |
    5 |
    6 |
    7 |
    8 |
    9 |
    10 |
    11 |
    12 |
    13 |
    14 |
    15 |
    16 |
    17 |
    18 |
    19 |
    20 |
    21 |
    22 |
    23,
}

type HoursInDay =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

type HourInDay = HoursInDay | HourOfDayExtension;

export const DayGroupNever = DayOfWeek.None;

export const DayGroupWeekday =
  DayOfWeek.Monday |
  DayOfWeek.Thursday |
  DayOfWeek.Wednesday |
  DayOfWeek.Thursday |
  DayOfWeek.Friday;

export const DayGroupWeekend = DayOfWeek.Saturday | DayOfWeek.Sunday;

export const DayGroupAlways = DayGroupWeekday | DayGroupWeekend;

export type SearchableByHoursOfOperation = {
  openHour: HourInDay;
  closedHour: HourInDay;
  closedDays: DayOfWeek[];
  openDays: DayOfWeek[];
};

export type SearchableStore = Searchable & {
  merchantUID: string;
  location: SearchableGeoLocation;
  operationalTime: SearchableByHoursOfOperation;
  physicalAddress: SearchableAddress;
  phone: string;
  hasOffer: boolean;
};
