import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const SearchFilterDropDown: React.FC<{
  items: string[];
  initial: string;
  onChange: (item: string) => void;
}> = ({ items, initial, onChange }) => {
  const [selected, setSelected] = useState<string>(initial);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown style={{}} isOpen={isOpen} toggle={() => setIsOpen((s) => !s)}>
      <DropdownToggle style={{ width: '100%', backgroundColor: 'gray' }} caret>
        {selected}
      </DropdownToggle>
      <DropdownMenu>
        {items.map((item) => (
          <DropdownItem
            key={item}
            onClick={() => {
              setSelected(item);
              onChange(item);
            }}
          >
            {item}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SearchFilterDropDown;
