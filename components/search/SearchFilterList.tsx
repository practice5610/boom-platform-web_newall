/* eslint-disable react/jsx-key */
import path from 'path';
import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import InputMask from 'react-input-mask';
import { Col, Container, Form, FormGroup, Input, Row } from 'reactstrap';

import {
  SearchControlActions,
  SearchControlActionsType,
  SearchControllerI,
} from '../../hooks/useSearchControls';
import { ProductSearchResultMetadataCtx } from '.';
import {
  FilterMetadataHelpersT,
  FilterMetadataListNodeI,
  FilterMetadataListParentI,
  FilterState,
  MetadataFilterTitlesT,
  MetadataProp,
  MetadataPropChild,
  PriceMetadataBucketI,
  SearchResultMetadataI,
} from './ProductSearch';
import SearchFilterDropDown from './SearchFilterDropDown';
import SearchFilterLabel from './SearchFilterLabel';

function isParent(element?: MetadataProp | MetadataPropChild): element is (
  | MetadataProp
  | MetadataPropChild
) & {
  children: MetadataProp[] | MetadataPropChild[];
} {
  if (!element) return false;
  if ((element as any).children?.length > 0) return true;
  return false;
}
function isHeader(
  element: MetadataProp
): element is MetadataProp & { title: MetadataFilterTitlesT } {
  if (!element) return false;
  if ((element as any).children?.length > 0 && (element as any).title) return true;
  return false;
}
interface Props<B extends FilterMetadataListNodeI, A extends SearchControlActionsType> {
  data: MetadataProp;
  fn: FilterMetadataHelpersT<B, A>;
  controls: SearchControllerI;
  level?: { depth: number; path: number[] };
}
const SearchFilterList = <B extends FilterMetadataListNodeI, A extends SearchControlActionsType>({
  data,
  controls,
  level = { depth: 0, path: [] },
  fn,
  children,
}: PropsWithChildren<Props<B, A>>) => {
  const [filterKey] = useState(data.filterKey);

  const filterState = useMemo(() => {
    const res = fn?.isFilterSet?.(controls.filters);
    const activeFilters: (string | null)[] = [];

    if (res) {
      let current: FilterState | undefined = res;
      while (current) {
        activeFilters.push(current.value);
        current = current.child;
      }
    }
    return activeFilters;
  }, [controls.filters, level.depth]);

  const renderChildren = () => {
    function renderLabels(d: MetadataPropChild[]) {
      let activeFilter: string | null = null;
      if (filterState && filterState?.length > level.depth && filterState[level.depth]) {
        activeFilter = filterState[level.depth];
      }
      if (activeFilter) {
        const child = d.filter((c) => c.label === activeFilter)?.[0];
        const index = d.indexOf(child);
        return (
          <div>
            <div className={'display-flex padding6'}>
              <SearchFilterLabel
                text={activeFilter}
                onClick={() => {
                  controls.dispatch(SearchControlActions.clearFilter([data.filterKey]));
                }}
              />
            </div>
            {isParent(child) &&
              (child.children as MetadataProp[])?.map((c) => (
                // eslint-disable-next-line react/jsx-key
                <SearchFilterList
                  data={c}
                  controls={controls}
                  level={{ depth: level.depth + 1, path: [...level.path, index] }}
                  fn={fn}
                >
                  {children}
                </SearchFilterList>
              ))}
          </div>
        );
      }
      return (
        <div>
          {d.map((child, index) => {
            if (child.count === 0) {
              return null;
            }
            return (
              <div>
                {child?.label && child.count && (
                  <div
                    onClick={() => {
                      const action = fn.bucketToAction?.({ ...child, filterKey: filterKey });
                      if (action) controls.dispatch(action);
                    }}
                    className={'row-mar border padding6'}
                  >
                    <div className={'display-flex qty-label'}>
                      <div className={'label-text-m width100'}>{child.label}</div>
                    </div>
                    <div className={'display-flex justify-content-end qty-label'}>
                      <div className={'label-text width30'}>({child.count})</div>
                    </div>
                  </div>
                )}
                {isParent(child) &&
                  (child.children as MetadataProp[])?.map((c) => (
                    // eslint-disable-next-line react/jsx-key
                    <SearchFilterList
                      data={c}
                      controls={controls}
                      level={{ depth: level.depth + 1, path: [...level.path, index] }}
                      fn={fn}
                    >
                      {children}
                    </SearchFilterList>
                  ))}
              </div>
            );
          })}
        </div>
      );
    }
    if (isParent(data)) {
      return <div>{renderLabels(data.children)}</div>;
    }
  };
  return (
    <div style={{ flex: 1 }} className={level.depth === 0 ? 'border width100' : ''}>
      {isHeader(data) && <div>{data.title}</div>}

      <div className={'indent qty-label'}>
        {renderChildren()}
        {level.depth === 0 && children && <div>{children}</div>}
      </div>
      {/* <div className={'display-flex top-space  justify-content-center align-items-center'}>
        <div className={'flex1 display-flex justify-content-end align-items-center'}>
          <input
            className={'justify-self-center'}
            type={'checkbox'}
            checked={selectedOption === PriceFilterTypes.INPUT_RANGE}
          />
        </div>
        <div className={'pad-container width85 display-flex justify-content-between'}>
          <div className={'width48'}>
            <InputMask
              placeholder={'$ Min'}
              mask={'$9999'}
              onChange={(e) => {
                e.target.value;
              }}
              className={'money-input'}
              type={'text'}
            />
          </div>
          <div className={'width48'}>
            <InputMask
              placeholder={'$ Max'}
              mask={'$99'}
              onChange={(e) => {
                e.target.value;
              }}
              className={'money-input'}
              type={'text'}
            />
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default SearchFilterList;
