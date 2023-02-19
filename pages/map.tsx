import { Category, getComposedAddressFromStore, Store } from '@boom-platform/globals';
import { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import Map, { MarkerProps } from '../components/Map';
import actionCreators from '../redux/actions';
import { AppState } from '../redux/reducers';
import { GlobalProps } from '../types';

interface InfoWindowProps {
  store: Store;
  onClick: (val1: any, val2: number) => void;
  value: any;
}

const InfoWindow = (props: InfoWindowProps) => {
  const { store } = props;
  return (
    <div style={{ right: 0, bottom: 72 }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          transform: 'translate(-45%,-100%)',
          maxWidth: 654,
          maxHeight: 408,
          backgroundColor: 'white',
          boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
          padding: 12,
          borderRadius: 8,
          fontSize: 14,
          zIndex: 100,
          width: 'max-content',
        }}
      >
        <h3>{store.companyName ?? ''}</h3>
        <h6>{store.companyType ?? ''}</h6>
        <img src='/images/map-icon-listed.png' width='64px' height='64px' alt='Map Icon' />
        <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <strong>
            {
              // TODO: Review if this change to address is correct - AddressInfo
              getComposedAddressFromStore(store) ?? ''
            }
          </strong>
          <br />
          <strong>{store.phoneNumber ?? ''}</strong>
          <br />
          <Link href={'/merchant-details/' + store._id}>
            <a style={{ color: '#0056b3' }}>View merchant</a>
          </Link>
        </div>

        <button
          style={{
            display: 'block',
            background: 'none',
            border: 0,
            margin: 0,
            padding: 0,
            position: 'absolute',
            top: -6,
            right: -6,
            width: 30,
            height: 30,
          }}
          onClick={() => {
            props.onClick(props.value, 1);
          }}
        >
          <img src='/images/close.svg' width='14px' height='14px' alt='Close' />
        </button>
      </div>
      <div
        style={{
          backgroundColor: 'white',
          transform: 'translate(100%,-50%) rotate(-45deg)',
          zIndex: 102,
          width: 15,
          height: 15,
          boxShadow: '-2px 2px 2px 0 rgba(178,178,178,.4)',
          position: 'absolute',
          top: 0,
          left: 0,
          content: '',
        }}
      ></div>
    </div>
  );
};

const SimpleMarker = (props: any) => {
  // TODO: Move to components, check web\components\Map.tsx
  return (
    <div>
      <div
        onClick={() => {
          console.log('Marker Clicked' + props.value + props.showtitle);
          props.onClick(props.value, 0);
        }}
        aria-hidden='true'
      >
        <img width='36px' height='auto' src='/images/map-icon-listed.png' alt='Map Icon' />
      </div>
      {props.showtitle && (
        <InfoWindow onClick={props.onClick} value={props.value} store={props.store} />
      )}
    </div>
  );
};

const ClusterMarker = (props: any) => {
  // TODO: Move to components, check web\components\Map.tsx
  return (
    <div
      onClick={() => {
        console.log('Clicking');
        props.onClick(props);
      }}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        textAlign: 'center',
      }}
      aria-hidden='true'
    >
      <img width='50px' height='auto' src='/images/map-icon-group1.png' alt='Map Icon' />
      <div
        style={{
          position: 'absolute',
          fontSize: 20,
          top: 17,
          left: 0,
          textAlign: 'center',
          width: 50,
        }}
      >
        {props.numPoints}
      </div>
    </div>
  );
};

interface Props {
  globalProps: GlobalProps;
  categories?: Category[];
}

const Page: NextPage<Props> = () => {
  const [data, setData] = useState({});
  const router = useRouter();
  const [markersData, setMarkersData] = useState<MarkerProps[]>([]);
  return (
    <>
      <div style={{ height: '600px', width: '100%' }}>
        <Map markers={markersData}>
          {({
            id,
            mid,
            numPoints,
            lat,
            lng,
            onMarkerClick,
            onClusterClick,
            showtitle,
            store,
            points,
          }) => {
            return numPoints === 1 ? (
              <SimpleMarker
                key={id}
                lat={lat}
                value={mid}
                lng={lng}
                showtitle={showtitle}
                onClick={onMarkerClick}
                store={store}
              />
            ) : (
              <ClusterMarker
                key={id}
                lat={lat}
                lng={lng}
                numPoints={numPoints}
                points={points}
                onClick={onClusterClick}
              />
            );
          }}
        </Map>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

const mapStateToProps = (state: AppState) => {
  return {
    categories: state.publicData.categories,
  };
};

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (ctx: PageContext) => {
  return {
    globalProps: {
      headTitle: 'Map',
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
