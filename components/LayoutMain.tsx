import { AllOptionalExceptFor, Booking, BoomUser } from '@boom-platform/globals';
import { css } from '@emotion/core';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { connect, useDispatch } from 'react-redux';
import { Spinner } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

//import useGeolocation from 'react-hook-geolocation';
import actionCreators from '../redux/actions';
import { requestBookings } from '../redux/actions/account-member';
import { setGeolocation } from '../redux/actions/app';
import { AppState } from '../redux/reducers';
import { getIsMerchant } from '../redux/selectors';
import Footer from './Footer';
import NavBar from './NavBar';
import {
  initSearch,
  ProductSearchControlsCtx,
  ProductSearchQuery,
  SearchQuery,
  useProductSearch,
} from './search';

type Props = {
  children: any;
  className?: string;
  style?: Record<string, unknown>;
  isUserSignedIn?: boolean;
  requestBookings?: typeof requestBookings;
  bookings?: Booking[];
  loading?: boolean;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  isMerchant?: boolean;
  isShowingLoadingOverlay?: boolean;
  appVersion?: string;
};

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  margin: 0 auto;
`;

const LayoutMain: FunctionComponent<Props> = ({
  children,
  className,
  style,
  isMerchant,
  isUserSignedIn,
  requestBookings,
  isShowingLoadingOverlay,
  appVersion,
}) => {
  // const location = useGeolocation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState<boolean>(true);

  useEffect(() => {
    if (isUserSignedIn && !isMerchant) {
      requestBookings?.();
    }
  }, [isUserSignedIn, isMerchant, requestBookings]);

  const reviewRouterPath = useCallback((url) => {
    switch (url) {
      case '/signup/merchant':
        setShowHeaderAndFooter(showHeaderAndFooter === false);
        break;
      case '/account/merchant/register':
        setShowHeaderAndFooter(showHeaderAndFooter === false);
        break;
      case '/signup/customer':
        setShowHeaderAndFooter(showHeaderAndFooter === false);
        break;
      default:
        setShowHeaderAndFooter(showHeaderAndFooter === true);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: any, { shallow }) => {
      reviewRouterPath(url);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    reviewRouterPath(router.pathname);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [reviewRouterPath, router]);

  return (
    <SearchWrapper>
      <LoadingOverlay
        active={isShowingLoadingOverlay}
        spinner={<Spinner color='white' />}
        styles={{
          content: (base: any) => ({
            ...base,
            marginTop: '50vh',
          }),
        }}
        text='Please wait...'
      >
        <div style={style} className={className}>
          {showHeaderAndFooter && (
            <header>
              <NavBar />
            </header>
          )}
          {children}
          {showHeaderAndFooter && <Footer appVersion={appVersion} />}
        </div>
      </LoadingOverlay>
    </SearchWrapper>
  );
};

const mapStateToProps = (state: AppState) => ({
  firebasIsInitialized: state.app.firebaseIsInitialized,
  isUserSignedIn: state.auth.isUserSignedIn,
  user: state.auth.user,
  isMerchant: getIsMerchant(state),
  isShowingLoadingOverlay: state.app.isShowingLoadingOverlay,
  appVersion: state.app.appVersion,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LayoutMain);

const SearchWrapper: React.FC<{}> = ({ children }) => {
  const baseSearch: SearchQuery<ProductSearchQuery> = React.useMemo<
    SearchQuery<ProductSearchQuery>
  >(() => {
    return initSearch({ location: { lat: 33, lon: 33 }, distance_km: undefined });
  }, []);
  const controls = useProductSearch(baseSearch);

  return (
    //<>{children}</>
    <ProductSearchControlsCtx.Provider value={controls}>
      {children}
    </ProductSearchControlsCtx.Provider>
  );
};
