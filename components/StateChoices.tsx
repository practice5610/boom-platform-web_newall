import React, { FC } from 'react';
import { Input } from 'reactstrap';
import { Field } from 'redux-form';

interface Props {
  val?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const states = [
  { value: '', label: 'Select State/Province' },
  { value: '', label: '-----United States-----' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'Distric of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  // { value: "", label: ""},
  // { value: "", label: "-----Canada-----" },
  // { value: "AB", label: "Alberta" },
  // { value: "BC", label: "British Columbia" },
  // { value: "MB", label: "Manitoba" },
  // { value: "NB", label: "New Brunswick" },
  // { value: 'NL', label: "Newfoundland and Labrador" },
  // { value: "NT", label: "Northwest Territories" },
  // { value: "NS", label: "Nova Scotia" },
  // { value: "NU", label: "Nunavut" },
  // { value: "ON", label: "Ontario" },
  // { value: "PE", label: "Prince Edward Island" },
  // { value: "QC", label: "Quebec" },
  // { value: "SK", label: "Saskatchewan" },
  // { value: "YT", label: "Yukon" },
];

export const StateField = () => {
  return (
    <div className='State-Field'>
      <Field
        name='state'
        component='select'
        placeholder='Select State/Province'
        className='form-control'
      >
        {states.map((state) => {
          if (state.value == '') {
            return (
              <option value={state.value} disabled key={state.label}>
                {state.label}
              </option>
            );
          }
          return (
            <option value={state.value} key={state.value}>
              {state.label}
            </option>
          );
        })}
      </Field>
    </div>
  );
};

export const USStateInput: FC<Props> = ({ val, onChange }) => {
  return (
    <div className='USState-Input'>
      <Input type='select' placeholder='Select State' value={val} onChange={onChange}>
        <option value='' disabled>
          Select State
        </option>
        <option value='AL'>Alabama</option>
        <option value='AK'>Alaska</option>
        <option value='AZ'>Arizona</option>
        <option value='AR'>Arkansas</option>
        <option value='CA'>California</option>
        <option value='CO'>Colorado</option>
        <option value='CT'>Connecticut</option>
        <option value='DE'>Delaware</option>
        <option value='DC'>District of Columbia</option>
        <option value='FL'>Florida</option>
        <option value='GA'>Georgia</option>
        <option value='HI'>Hawaii</option>
        <option value='ID'>Idaho</option>
        <option value='IL'>Illinois</option>
        <option value='IN'>Indiana</option>
        <option value='IA'>Iowa</option>
        <option value='KS'>Kansas</option>
        <option value='KY'>Kentucky</option>
        <option value='LA'>Louisiana</option>
        <option value='ME'>Maine</option>
        <option value='MD'>Maryland</option>
        <option value='MA'>Massachusetts</option>
        <option value='MI'>Michigan</option>
        <option value='MN'>Minnesota</option>
        <option value='MS'>Mississippi</option>
        <option value='MO'>Missouri</option>
        <option value='MT'>Montana</option>
        <option value='NE'>Nebraska</option>
        <option value='NV'>Nevada</option>
        <option value='NH'>New Hampshire</option>
        <option value='NJ'>New Jersey</option>
        <option value='NM'>New Mexico</option>
        <option value='NY'>New York</option>
        <option value='NC'>North Carolina</option>
        <option value='ND'>North Dakota</option>
        <option value='OH'>Ohio</option>
        <option value='OK'>Oklahoma</option>
        <option value='OR'>Oregon</option>
        <option value='PA'>Pennsylvania</option>
        <option value='RI'>Rhode Island</option>
        <option value='SC'>South Carolina</option>
        <option value='SD'>South Dakota</option>
        <option value='TN'>Tennessee</option>
        <option value='TX'>Texas</option>
        <option value='UT'>Utah</option>
        <option value='VT'>Vermont</option>
        <option value='VA'>Virginia</option>
        <option value='WA'>Washington</option>
        <option value='WV'>West Virginia</option>
        <option value='WI'>Wisconsin</option>
        <option value='WY'>Wyoming</option>
      </Input>
    </div>
  );
};

export const CAProvinceInput: FC<Props> = ({ val, onChange }) => {
  return (
    <div className='CAProvinces-Input'>
      <Input type='select' placeholder='Select Province' value={val} onChange={onChange}>
        <option value='' disabled>
          Select Province
        </option>
        <option value='AB'>Alberta</option>
        <option value='BC'>British Columbia</option>
        <option value='MB'>Manitoba</option>
        <option value='NB'>New Brunswick</option>
        <option value='NL'>Newfoundland and Labrador</option>
        <option value='NT'>Northwest Territories</option>
        <option value='NS'>Nova Scotia</option>
        <option value='NU'>Nunavut</option>
        <option value='ON'>Ontario</option>
        <option value='PE'>Prince Edward Island</option>
        <option value='QC'>Quebec</option>
        <option value='SK'>Saskatchewan</option>
        <option value='YT'>Yukon</option>
      </Input>
    </div>
  );
};
