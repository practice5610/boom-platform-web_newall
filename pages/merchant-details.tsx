import { getComposedAddressFromStore, Store } from '@boom-platform/globals';
import moment from 'moment';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import GridProductSearchResults from '../components/GridProductSearchResults';
import Map, { SimpleMarker } from '../components/Map';
import NotFound from '../components/NotFound';
import RenderIf from '../components/utils/RenderIf';
import { DefaultCoords } from '../constants';
import { ProductHit } from '../models/product-hit.model';
import actionCreators from '../redux/actions';
import { requestStoreDetails } from '../redux/actions/stores';
import { AppState } from '../redux/reducers';
import { getStoreOffers } from '../redux/selectors';
import { GlobalProps, NextLayoutPage } from '../types';
import { getSocialIconClassForUrl, urlIsSocialMedia } from '../utils/common';
import { isServer } from '../utils/environment';
import { replaceDomain } from '../utils/images';

interface Props {
  id: string;
  store?: Store;
  results?: ProductHit[];
  storeStatus?: string;
  globalProps: GlobalProps;
}

/**
 * Shows merchant detail after selected from map
 */
const Page: NextLayoutPage<Props> = ({ id, store, results, storeStatus }) => {
  const lat = store?._geoloc?.lat || DefaultCoords.LAT;
  const lng = store?._geoloc?.lng || DefaultCoords.LNG;

  const router = useRouter();

  useEffect(() => {
    if (id === '' && router) {
      router.replace('/');
    }
  }, [id, router]);

  const _goBack = () => {
    if (window.document.referrer.indexOf(window.location.host) < 0 || window.history.length <= 1) {
      window.location.href = `${window.location.protocol}//${window.location.host}`;
    } else {
      window.history.go(-1);
    }
  };

  const _checkStoreOpen = (
    closingTime: number | undefined,
    openingTime: number | undefined,
    days: string[] | undefined
  ): boolean => {
    const currentTime = parseInt(moment().format('hh'));

    let day = moment().format('ddd').toLowerCase();

    if (day === 'thu') {
      day = 'thr';
    }
    if (
      closingTime &&
      openingTime &&
      days &&
      days.length &&
      days.includes(day) &&
      currentTime < closingTime &&
      currentTime > openingTime
    ) {
      return true;
    } else {
      return false;
    }
  };

  const _getStoreTime = (time: number | undefined) => {
    return moment(time, 'HH').format('hA');
  };

  return (
    <>
      {(storeStatus === 'loaded' || storeStatus === 'loading') && store ? (
        <>
          {storeStatus === 'loading' ? <div className='loading'>Loading</div> : null}
          <div className='merchant-header'>
            <div
              className='merchant-businesscover-photo'
              style={{
                backgroundImage: 'url("https://via.placeholder.com/1440x403")',
                height: '403px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                position: 'relative',
              }}
            />
          </div>

          <div className='merchant-container'>
            <div className='d-flex'>
              <div className='merchant-image'>
                <div className='merchant-profile'>
                  <img
                    width='330px'
                    src={
                      replaceDomain(store.companyLogoUrl)
                        ? `${replaceDomain(store.companyLogoUrl)}?width=330&height=330`
                        : 'https://via.placeholder.com/330'
                    }
                    alt='Company Logo'
                  />
                </div>
                {/* Start Online Store always open as they have not time defined for store */}
                <RenderIf condition={!store.closingTime && !store.openingTime}>
                  <div className='hours-unavailable-profile d-flex  align-items-right'>
                    <i className='fa fa-clock-o fa-2x fa-fw' aria-hidden='true' />
                    <span>Hours Available</span>
                  </div>
                </RenderIf>
                {/* End Online Store always open as they have not time defined for store */}
                {/* Start Conditions for Physical stores checking store is opened or closed */}
                <RenderIf
                  condition={!!_checkStoreOpen(store.closingTime, store.openingTime, store.days)}
                >
                  <div className='hours-unavailable-profile d-flex  align-items-right'>
                    <i className='fa fa-clock-o fa-2x fa-fw' aria-hidden='true' />
                    <span>
                      Hours{' '}
                      {`${_getStoreTime(store.openingTime)} - ${_getStoreTime(store.closingTime)}`}
                    </span>
                  </div>
                </RenderIf>
                <RenderIf
                  condition={!_checkStoreOpen(store.closingTime, store.openingTime, store.days)}
                >
                  <div className='store-closed d-flex  align-items-right'>
                    <i className='fa fa-clock-o fa-2x fa-fw' aria-hidden='true' />
                    <span>
                      Hours{' '}
                      {`${_getStoreTime(store.openingTime)}-${_getStoreTime(store.closingTime)}`}
                    </span>
                  </div>
                </RenderIf>
                {/* End Conditions for Physical stores checking store is opened or closed */}
                <div className='back-to-listings-profile d-flex  align-items-right'>
                  <i className='fa fa-bars fa-2x fa-fw' aria-hidden='true' />
                  <span>
                    <button onClick={_goBack}>Back To listings</button>
                  </span>
                </div>
                {/* <div className="save-as-favorites d-flex  align-items-right">
                  <i className="fa fa-star fa-2x fa-fw" aria-hidden="true" />
                  <span>Save as Favorites</span>
                </div> */}
                <div style={{ width: '330px', height: '324px' }}>
                  <Map
                    mapProps={{
                      center: {
                        lat,
                        lng,
                      },
                      zoom: 11,
                    }}
                    markers={[
                      {
                        id: '1',
                        lat,
                        lng,
                      },
                    ]}
                  >
                    {({ id, lat, lng }) => {
                      return <SimpleMarker key={id} lat={lat} lng={lng} />;
                    }}
                  </Map>
                </div>
              </div>

              <div className='merchant-details'>
                <div className='merch-header-reviews-btn'>
                  <section>
                    <h1>{store.companyName}</h1>
                  </section>
                  {/* <aside>
                    <span className="">Reviews</span>
                  </aside> */}
                </div>
                <div className='merch-contact-info'>
                  <div className='d-flex align-items-center'>
                    <i className='fa fa-tag fa-flip-horizontal fa-2x mr-2' aria-hidden='true' />
                    <span>{store.companyType}</span>
                  </div>
                  <div className='d-flex align-items-center'>
                    <i className='fa fa-phone fa-2x mr-2' aria-hidden='true' />
                    <span>{store.phoneNumber}</span>
                  </div>
                  <div className='d-flex align-items-center'>
                    <i className='fa fa-map-marker fa-2x mr-3 ' aria-hidden='true' />
                    <span>
                      {
                        // TODO: Review if this change to address is correct - AddressInfo
                        getComposedAddressFromStore(store)
                      }
                    </span>
                  </div>
                  {store.links && store.links.length
                    ? store.links.map((link, index) => {
                        return urlIsSocialMedia(link) ? null : (
                          <div
                            className='d-flex align-items-center merchant-links'
                            key={`store_link_${index}`}
                          >
                            <i className='fa fa-globe fa-2x mr-2' aria-hidden='true' />
                            <a href={link} target='_blank' rel='noopener noreferrer'>
                              <span>{link}</span>
                            </a>
                          </div>
                        );
                      })
                    : ''}
                </div>
                <div className='merch-social-media-icons'>
                  {store.links && store.links.length
                    ? store.links.map((link, index) => {
                        return !urlIsSocialMedia(link) ? null : (
                          <a href={link} key={link}>
                            <i
                              className={`fa ${getSocialIconClassForUrl(link)} fa-3x ml-3`}
                              aria-hidden='true'
                            />
                          </a>
                        );
                      })
                    : ''}
                </div>

                {/* <!-- Details & Conditions --> */}
                <div className='merchant-details-conditions'>
                  <div className='odc-header'>
                    <span>Details</span>
                  </div>
                  <p>{store.companyDescription}</p>
                  <br />
                </div>
                <br />
              </div>
            </div>
            <div className='odc-header offers-header d-flex align-items-center'>
              <span>Offers</span>
            </div>
            <GridProductSearchResults results={results || ([] as ProductHit[])} />
          </div>
        </>
      ) : storeStatus === 'error' && !store ? (
        <NotFound />
      ) : (
        <div style={{ minHeight: '400px', textAlign: 'center' }}>
          <div className='loading'>Loading</div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    results: getStoreOffers(state, 'storesConfig'),
    store: state.storesConfig.storeDetails,
    storeStatus: state.storesConfig.storeStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext): Promise<Props> => {
  let id: string = '';
  if (reduxContext?.query?.id) {
    id = reduxContext.query.id.toString();
    reduxContext.store.dispatch(requestStoreDetails(id));
  } else if (isServer && reduxContext?.res) {
    reduxContext.res.writeHead(302, { Location: '/' });
    reduxContext.res.end();
  }
  return {
    id,
    globalProps: {
      headTitle: 'Merchant Details',
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
