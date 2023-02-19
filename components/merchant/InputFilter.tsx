import React, { FC, ReactElement } from 'react';
import { useState } from 'react';
import { Button, Input } from 'reactstrap';

type Props = {
  onFilterChanged?: (filter: string) => void;
};

export const InputFilter: FC<Props> = ({ onFilterChanged }): ReactElement => {
  const [keyword, setKeyword] = useState('');
  const handleInputOnChange = (e) => {
    setKeyword(e.target.value);
  };
  return (
    <div className='Search-field d-flex justify-content-between align-items-center'>
      <Input
        type='text'
        id='inputfilter'
        autoComplete='off'
        className='search-input'
        placeholder='Search'
        defaultValue={keyword}
        onChange={handleInputOnChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onFilterChanged?.(keyword);
        }}
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          onFilterChanged?.(keyword);
        }}
      >
        <i id='search-icon' className='fa fa-search' />
      </Button>
    </div>
  );
};
