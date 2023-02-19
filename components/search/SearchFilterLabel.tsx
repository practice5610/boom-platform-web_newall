import React from 'react';

const SearchFilterLabel: React.FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => {
  return (
    <div className={'activeFilter  width100'}>
      <div className={'name'}>{text}</div>
      <div className={'delete'} onClick={onClick}>
        &#128473;
      </div>
    </div>
  );
};

export default SearchFilterLabel;
