import React, { useContext, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { Col, Container, Form, FormGroup, Input, Row } from 'reactstrap';

import { SearchControlActions, SearchControllerI } from '../../hooks/useSearchControls';
import { ProductSearchResultMetadataCtx } from '.';
import SearchFilterDropDown from './SearchFilterDropDown';
enum PriceFilterTypes {
  SELECT_RANGE = 'SELECT_RANGE',
  INPUT_RANGE = 'INPUT',
}
const SearchFilterPrice: React.FC<{ controls: SearchControllerI }> = ({ controls }) => {
  const metaData = useContext(ProductSearchResultMetadataCtx);
  const [selectedOption, setSelectedOption] = useState<PriceFilterTypes>();
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>();

  return (
    <div>
      <div>Price</div>
      {/* <div className={'display-flex top-space justify-content-center align-items-center'}>
        <div className={'width15 display-flex justify-content-end'}>
          <input type={'checkbox'} checked={selectedOption === PriceFilterTypes.SELECT_RANGE} />
        </div>
        <div className={'flex1 pad-container '}>
          <SearchFilterDropDown
            initial={'Any'}
            items={[
              'Any',
              ...(metaData?.prices.buckets
                ?.map((b) => (b.count > 0 ? b.label + ` (${b.count})` : ''))
                .filter((p) => p !== '') ?? []),
            ]}
            onChange={(item) => {
              if (item === 'Any') {
                controls.dispatch(SearchControlActions.clearFilter(['price']));
              } else {
                const p = item.replace(/$/g, '').split('-');
                controls.dispatch(
                  SearchControlActions.changePrice(parseInt(p?.[0]), parseInt(p?.[1]))
                );
              }
            }}
          />
        </div>
      </div>
      <div className={'display-flex top-space  justify-content-center align-items-center'}>
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
        </div>
      </div> */}
    </div>
  );
};

export default SearchFilterPrice;
