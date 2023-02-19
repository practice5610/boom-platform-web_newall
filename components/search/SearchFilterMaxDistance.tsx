import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'reactstrap';

import SearchFilterDropDown from './SearchFilterDropDown';
import SearchFilterInput from './SearchFilterInput';

const SearchFilterMaxDistance: React.FC<{
  distance: string;
  units: string;
  onSubmit: (state: { distance: string; units: string }) => void;
}> = ({ distance, units, onSubmit }) => {
  const [state, setState] = useState({ distance: distance, units: units });
  return (
    <div>
      <div className={'display-flex border'}>
        <div className={'flex1'}>Max Distance</div>
      </div>
      <div className={'display-flex rowCenter'}>
        <div className={'flex1 border'}>
          <SearchFilterInput
            value={state.distance}
            onChange={(val) => setState({ ...state, distance: val })}
          />
        </div>
        <SearchFilterDropDown
          initial={units}
          items={['km', 'miles']}
          onChange={(selected) => {
            setState({ ...state, units: selected });
          }}
        />
      </div>
      {(state.distance !== distance || state.units !== units) && (
        <div className={'row rowJustEnd'}>
          <Button
            className={'width40 margin'}
            disabled={state.distance === distance && state.units === units}
            onClick={() => {
              onSubmit(state);
            }}
          >
            &#10003;
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilterMaxDistance;
