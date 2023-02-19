import { Category } from '@boom-platform/globals';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actionCreators from '../redux/actions';
import { setGeolocation } from '../redux/actions/app';

declare let google;

type Props = {
  categories?: Category[];
  onSearchRequest(params: { type: string; lat: number | null; lng: number | null }): void;
  setGeolocation?: typeof setGeolocation;
};

const InputStoreSearch: FunctionComponent<Props> = ({
  categories,
  onSearchRequest,
  setGeolocation,
}) => {
  const [selectedType, setSelectedType] = useState(
    categories && categories[0] && categories[0].name
  );
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const inputEl = useRef(null);

  useEffect(() => {
    const autocomplete = new google.maps.places.Autocomplete(inputEl.current, {
      types: ['geocode'],
    });

    function onChangeAddress() {
      if (!autocomplete.getPlace().geometry || !autocomplete.getPlace().geometry.location) {
        alertMissingLocation();
        return;
      }
      const location = autocomplete.getPlace().geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      setLatLng({ lat: lat, lng: lng });
    }

    autocomplete.addListener('place_changed', onChangeAddress);

    return function cleanup() {
      autocomplete.unbindAll();
    };
  }, []);

  const alertMissingLocation = () => {
    window.alert('Please select a location from the search box dropdown (appears while typing)');
  };

  const onSearchClick = () => {
    if (!latLng.lat || !latLng.lng) {
      alertMissingLocation();
      return;
    }
    //console.log(latLng.lat)
    setGeolocation?.(latLng.lat, latLng.lng);
    if (selectedType) {
      onSearchRequest({ type: selectedType, lat: latLng.lat, lng: latLng.lng });
    }
  };

  return (
    <div className='InputStoreSearch'>
      <div className='d-flex flex-wrap'>
        <div>
          <i className='fa fa-search pr-2' aria-hidden='true'></i>
          <span className='pr-2'>I am searching for</span>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {categories
              ? categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              : null}
          </select>
        </div>

        <div>
          <i className='fa fa-map-marker pl-md-2 pr-2' aria-hidden='true'></i>
          <span className='pr-2'>In</span>
          <input className='mr-2 location-search-input' ref={inputEl} placeholder='Boston' />
          <button className='btn' onClick={onSearchClick}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isUserSignedIn: state.auth.isUserSignedIn,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InputStoreSearch);
