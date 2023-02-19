import React from 'react';
import { Input } from 'reactstrap';

const SearchFilterInput: React.FC<{
  value: string;
  onChange: (item: string) => void;
}> = ({ value, onChange }) => {
  return (
    <Input
      className={'width100'}
      type={'text'}
      value={value}
      onChange={(e) => {
        onChange(e.target.value.replace(/\D/g, ''));
      }}
    />
  );
};

export default SearchFilterInput;
