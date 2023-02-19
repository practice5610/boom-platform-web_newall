import { BasicSearchProps, ChangeSearchFilter, SearchQueryType } from './search-query-types';

export const initSearchState = (): BasicSearchProps => ({
  distance_km: 10,
  location: { lat: 2, lon: 3 },
});

export function setSearchFilterQuery<S extends SearchQueryType>(
  state: S,
  { name, value }: ChangeSearchFilter<S>
) {
  console.log(`setSearchFilterQuery reducer: ${name}: ${value}`);
  return { ...state, [name]: value };
}
