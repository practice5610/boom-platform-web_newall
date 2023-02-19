import { Store } from '@boom-platform/globals';
import React, { useState } from 'react';
import { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import Map, { SimpleMarker } from '../components/Map';
import { DefaultCoords } from '../constants';
import actionCreators from '../redux/actions';
import { requestStore, requestUpdateStore } from '../redux/actions/account-merchant';
import { AppState } from '../redux/reducers';
import { isValidPhone } from '../utils/phone';
import { validateEMail } from '../utils/validators';
// import {googlemaps} from 'googlemaps';

interface Props {
  store?: Store;
  requestUpdateStore?: typeof requestUpdateStore;
  requestStore?: typeof requestStore;
}

const componentForm = {
  street_number: 'short_name',
  route: 'short_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'short_name',
  postal_code: 'short_name',
};

const MerchantStoreProfile: FunctionComponent<Props> = ({
  store,
  requestStore,
  requestUpdateStore,
}) => {
  // TODO: Use Hook forms here
  const inputEl = React.useRef(null);
  const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete>();
  const [state, setState] = useState<Store & { isValidEmail: boolean }>({
    _id: store?._id || '',
    companyLogoUrl: store?.companyLogoUrl || '',
    companyName: store?.companyName || '',
    companyDescription: store?.companyDescription || '',
    emails: store?.emails,
    phoneNumber: store?.phoneNumber || '',
    number: store?.number || '',
    street1: store?.street1 || '',
    street2: store?.street2 || '',
    city: store?.city || '',
    country: store?.country || '',
    state: store?.state || '',
    zip: store?.zip || '',
    _geoloc: store?._geoloc || { lat: DefaultCoords.LAT, lng: DefaultCoords.LNG },
    links: store?.links,
    pin: store?.pin,
    object_id: store?.object_id || '',
    coverImageUrl: store?.coverImageUrl || '',
    companyType: store?.companyType || '',
    _tags: store?._tags || undefined,
    openingTime: store?.openingTime || undefined,
    closingTime: store?.closingTime || undefined,
    days: store?.days || undefined,
    merchant: store?.merchant || undefined,
    isValidEmail: true,
  });
  const [newAddress, setNewAddress] = useState({
    nnumber: store?.number || '',
    nstreet1: store?.street1 || '',
    nstreet2: store?.street2 || '',
    ncity: store?.city || '',
    ncountry: store?.country || '',
    nstate: store?.state || '',
    nzip: store?.zip || '',
    n_geoloc: store?._geoloc || { lat: DefaultCoords.LAT, lng: DefaultCoords.LNG },
  });

  useEffect(() => {
    const newAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete') as HTMLInputElement,
      {
        types: ['geocode'],
        componentRestrictions: { country: 'us' },
      }
    );
    newAutocomplete.setFields(['address_components', 'geometry']);
    newAutocomplete && setAutocomplete(newAutocomplete);
    requestStore?.();
  }, []);

  useEffect(() => {
    function onChangeAddress() {
      const place = autocomplete?.getPlace();

      if (place) {
        for (const component in componentForm) {
          (document.getElementById(component) as HTMLInputElement).value = '';
          (document.getElementById(component) as HTMLInputElement).disabled = false;
        }

        const selectedAddress = place.address_components as google.maps.GeocoderAddressComponent[];

        for (const component of selectedAddress) {
          const addressType = component.types[0];
          if (componentForm[addressType]) {
            const val = component[componentForm[addressType]];
            (document.getElementById(addressType) as HTMLInputElement).value = val;
          }
        }
        if (selectedAddress.length < 7) {
          return alert('Store Locator Error. Please enter a complete address.');
        } else {
          setNewAddress({
            nnumber: selectedAddress[0].short_name,
            nstreet1: selectedAddress[1].short_name,
            nstreet2: '',
            ncity: selectedAddress[2].short_name,
            ncountry: selectedAddress[5].short_name,
            nstate: selectedAddress[4].short_name,
            nzip: selectedAddress[6].short_name,
            n_geoloc: {
              lat: place.geometry?.location.lat() || DefaultCoords.LAT,
              lng: place.geometry?.location.lng() || DefaultCoords.LNG,
            },
          });
        }
      }
    }
    if (autocomplete) {
      autocomplete.addListener('place_changed', onChangeAddress);

      return function cleanup() {
        autocomplete.unbindAll();
      };
    }
  }, [autocomplete]);

  useEffect(() => {
    setState({
      _id: store?._id || '',
      companyLogoUrl: store?.companyLogoUrl || '',
      companyName: store?.companyName || '',
      companyDescription: store?.companyDescription || '',
      emails: store?.emails,
      phoneNumber: store?.phoneNumber || '',
      number: store?.number || '',
      street1: store?.street1 || '',
      street2: store?.street2 || '',
      city: store?.city || '',
      country: store?.country || '',
      state: store?.state || '',
      zip: store?.zip || '',
      _geoloc: store?._geoloc || { lat: DefaultCoords.LAT, lng: DefaultCoords.LNG },
      links: store?.links,
      pin: store?.pin,
      object_id: store?.object_id || '',
      coverImageUrl: store?.coverImageUrl || '',
      companyType: store?.companyType || '',
      _tags: store?._tags || undefined,
      openingTime: store?.openingTime || undefined,
      closingTime: store?.closingTime || undefined,
      days: store?.days || undefined,
      merchant: store?.merchant || undefined,
      isValidEmail: true,
    });
  }, [store]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      number: newAddress.nnumber,
      street1: newAddress.nstreet1,
      street2: newAddress.nstreet2,
      city: newAddress.ncity,
      country: newAddress.ncountry,
      state: newAddress.nstate,
      zip: newAddress.nzip,
      _geoloc: newAddress.n_geoloc,
    }));
  }, [newAddress]);

  const _onSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    let isValidEmail: boolean = false;

    if (state?.emails && store?.emails?.[0]) {
      isValidEmail = validateEMail(store.emails[0]);
    }
    setState((prevState) => ({ ...prevState, isValidEmail }));

    if (isValidEmail && store?._id) {
      const { isValidEmail, ...sendData } = state;
      requestUpdateStore?.({ ...store, ...sendData }, store._id);
    }
  };

  function handledFieldChanges(e) {
    setState((prevState) => ({ ...prevState, [e.target.id]: e.target.value }));
  }

  return (
    <div className='MerchantStoreProfile'>
      <div className='store-profile d-flex'>
        <Form className='StoreProfile' onSubmit={_onSubmit}>
          <Row>
            <Col lg={6}>
              <Row>
                <h3>Welcome to your Store Locator</h3>
              </Row>
              <Row>
                <p>Update or add store locations</p>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for='fullAddress'>Search for Location *</Label>
                    <Input
                      id='autocomplete'
                      placeholder='Enter address to search'
                      type='text'
                      ref={inputEl}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <FormGroup>
                    <Label for='address'>Store Address</Label>
                    <Row>
                      <Col md={3} className='padding-left'>
                        <Input id='street_number' type='text' readOnly />
                      </Col>
                      <Col md={9} className='padding-right'>
                        <Input id='route' type='text' readOnly />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={5} className='padding-left'>
                        <Input id='locality' type='text' readOnly />
                      </Col>
                      <Col md={2} className='padding-0'>
                        <Input id='administrative_area_level_1' type='text' readOnly />
                      </Col>
                      <Col md={3} className='padding-0'>
                        <Input id='postal_code' type='text' readOnly />
                      </Col>
                      <Col md={2} className='padding-right'>
                        <Input id='country' type='text' readOnly />
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for='street2'>Apt/Suite</Label>
                    <Input
                      id='street2'
                      type='text'
                      value={state?.street2}
                      onChange={handledFieldChanges}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for='phone'>Phone Number</Label>
                    <Input
                      type='number'
                      readOnly
                      style={{ backgroundColor: '#fff' }}
                      value={state?.phoneNumber}
                      onChange={(e) => {
                        const value = e.currentTarget.value;
                        setState((prevState) => ({ ...prevState, phoneNumber: value }));
                      }}
                      invalid={
                        state?.phoneNumber && !isValidPhone(state.phoneNumber) ? true : false
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for='lat'>Latitude</Label>
                    <Input
                      type='number'
                      value={state?._geoloc?.lat || ''}
                      readOnly
                      style={{ backgroundColor: '#fff' }}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for='lng'>Longitude</Label>
                    <Input
                      type='number'
                      value={state?._geoloc?.lng || ''}
                      readOnly
                      style={{ backgroundColor: '#fff' }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4} />
                <Col md={4}>
                  <Input type='submit' className='profile-btn' value='Update' />
                </Col>
                <Col md={4} />
              </Row>
            </Col>

            <Col lg={6}>
              <Row>
                <Col md={12}>
                  <div
                    style={{
                      width: 'auto',
                      height: '400px',
                      marginBottom: '15px',
                      marginTop: '15px',
                    }}
                  >
                    {state?._geoloc?.lat && state?._geoloc?.lng && (
                      <Map
                        mapProps={{
                          center: {
                            lat: state._geoloc.lat,
                            lng: state._geoloc.lng,
                          },
                          zoom: 14,
                        }}
                        markers={[
                          {
                            id: '1',
                            lat: state._geoloc.lat,
                            lng: state._geoloc.lng,
                          },
                        ]}
                      >
                        {({ id, lat, lng }) => {
                          return <SimpleMarker key={id} lat={lat} lng={lng} />;
                        }}
                      </Map>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  store: state.accountMerchant.store,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MerchantStoreProfile);
