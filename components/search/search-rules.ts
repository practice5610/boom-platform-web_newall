export type NotSet = 0;
export enum SearchMatchRestriction {
  None = '',
  Must = 'musts',
  MustNot = 'mustNot',
  Should = 'should',
  Nested = 'nested',
  // None='', disabled unless need need a safe zero value
}

export enum SearchFilterType {
  None = '',
  Keyword = 'keyword',
  Location = 'location',
  // None='', disabled unless need need a safe zero value
}

export enum SearchFilterQualifier {
  None = '',
  Exact = 'exact',
  Wildcard = 'wildcard',
  // None='', disabled unless need need a safe zero value
}
