import React, { FC } from 'react';
import { Input } from 'reactstrap';
import { Field } from 'redux-form';

import { CAProvinceInput, USStateInput } from './StateChoices';

interface Props {
  val?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  state?: string;
  stateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  province?: string;
  provinceChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CountryField = () => {
  return (
    <div className='Country-Field'>
      <Field
        name='country'
        component='select'
        placeholder='Select Country'
        className='form-control'
      >
        <option value='' disabled>
          Select Country
        </option>
        <option value='US'>United States</option>
        <option value='CA' disabled>
          Canada
        </option>
      </Field>
    </div>
  );
};

export const CountryInput: FC<Props> = ({
  val,
  onChange,
  state,
  stateChange,
  province,
  provinceChange,
}) => {
  const _getContent = () => {
    switch (val) {
      case 'US':
        return <USStateInput val={state} onChange={stateChange} />;
        break;
      case 'CA':
        return <CAProvinceInput val={province} onChange={provinceChange} />;
        break;
      default:
        <></>;
    }
  };
  return (
    <div className='Country-Input'>
      <Input type='select' placeholder='Select Country' value={val} onChange={onChange}>
        <option value='' disabled>
          Select Country
        </option>
        <option value='US'>United States</option>
        <option value='CA' disabled>
          Canada
        </option>
      </Input>
      {_getContent()}
    </div>
  );
};
