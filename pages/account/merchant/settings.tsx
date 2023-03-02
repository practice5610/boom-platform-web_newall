import { AllOptionalExceptFor, BoomUser, Category, Store } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

//import { getLayout } from '../../../components/LayoutAccount';
import MerchantSettings from '../../../components/MerchantSettings';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import { requestStore, requestUpdateStore } from '../../../redux/actions/account-merchant';
import { setLoadingOverlay } from '../../../redux/actions/app';
import { uploadImage } from '../../../redux/actions/image';
import { AppState } from '../../../redux/reducers';
import { getIsMerchant } from '../../../redux/selectors';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

interface Props {
  requestUpdateStore?: typeof requestUpdateStore;
  store?: Store | null;
  categories?: Category[];
  requestStore?: typeof requestStore;
  uploadImage?: typeof uploadImage;
  user?: AllOptionalExceptFor<BoomUser, 'uid'> | null;
  error?: string | undefined;
  isStoreUpdated?: boolean;
  isUserSignedIn?: boolean;
  isInitialized?: boolean;
  isMerchant?: boolean;
  setLoadingOverlay?: typeof setLoadingOverlay;
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  requestUpdateStore,
  categories,
  store,
  requestStore,
  uploadImage,
  user,
  error,
  isStoreUpdated,
  isInitialized,
  isUserSignedIn,
  isMerchant,
  setLoadingOverlay,
}) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  useEffect(() => {
    if (isInitialized) {
      if (isUserSignedIn && isMerchant && !store) {
        requestStore?.();
      }
      if (error || isStoreUpdated) {
        setLoadingOverlay?.(false);
      }
    }
  }, [isInitialized, isStoreUpdated]); // FIXME: missing dependencies: 'error', 'isMerchant', 'isUserSignedIn', 'requestCategories', 'requestStore', and 'store'

  // TODO: check if _updateStore, _uploadMerchantImage and _uploadMerchantCoverImage can be converted to callbacks
  const _updateStore = (values) => {
    if (store) {
      const id: string = store._id || '';
      setLoadingOverlay?.(true);
      requestUpdateStore?.(_updateStoreDetails(values), id);
    }
  };

  const _uploadMerchantImage = (formData) => {
    if (user) {
      const imageName = `${user.uid}-logo`;
      uploadImage?.(formData, imageName, true);
    }
  };

  const _uploadMerchantCoverImage = (formData) => {
    if (user) {
      const imageName = `${user.uid}_cover`;
      uploadImage?.(formData, imageName, true);
    }
  };

  // TODO: Remove this function and its reference whenever data stable and correct
  // this is only fallback function to grab first name and lastname from merchant.name
  // as merchant is a boomUser and it holds BoomUser partial data but data in this time is incorrect
  // thus writing this function
  const _getNames = (merchant) => {
    let firstName = '';
    let lastName = '';
    if (merchant.name) {
      const names: string[] = merchant.name.split(' ');
      firstName = names[0];
      if (names.length >= 2) {
        lastName = names.slice(1).join(' ');
      }
    } else {
      firstName = merchant.firstName;
      lastName = merchant.lastName;
    }
    return {
      firstName,
      lastName,
    };
  };

  const _getLinks = (links: string[], linkType: string) => {
    if (linkType === 'website') {
      return links
        .filter((link) => {
          return (
            link.indexOf('facebook') < 0 &&
            link.indexOf('twitter') < 0 &&
            link.indexOf('linkedin') < 0 &&
            link.indexOf('pinterest') < 0 &&
            link.indexOf('yelp') < 0 &&
            link.indexOf('youtube') < 0 &&
            link.indexOf('instagram') < 0
          );
        })
        .join(', ');
    } else {
      return links.find((link) => link.indexOf(linkType) >= 0) || '';
    }
  };
  const _updateStoreDetails = (values) => {
    const updatedStore: Store = { ...store } as Store;
    updatedStore.merchant && (updatedStore.merchant.firstName = values.firstName);
    updatedStore.merchant && (updatedStore.merchant.lastName = values.lastName);
    updatedStore.number = values.number; // TODO: Review this, <MerchantSettings> needs to be updated to handle these new values number, street1 and street2
    updatedStore.street1 = values.street1;
    updatedStore.street2 = values.street2;
    updatedStore.city = values.city;
    updatedStore.state = values.state;
    updatedStore.zip = values.zip;
    updatedStore.country = values.country;
    updatedStore.companyType = values.companyType;
    updatedStore.companyName = values.companyName;
    updatedStore.companyDescription = values.companyDescription;
    updatedStore.phoneNumber = values.phoneNumber;

    if (values.companyLogoUrl) {
      updatedStore.companyLogoUrl = values.companyLogoUrl;
    }

    if (values.coverImageUrl) {
      updatedStore.coverImageUrl = values.coverImageUrl;
    }

    if (updatedStore.emails && updatedStore.emails.length) {
      updatedStore.emails[0] = values.email;
    } else {
      updatedStore.emails = [values.email];
    }
    updatedStore.links = [];
    if (values.website) {
      updatedStore.links = values.website.split(',');
    }
    if (values.companyFacebookUrl) {
      updatedStore.links?.push(values.companyFacebookUrl);
    }
    if (values.companyTwitterUrl) {
      updatedStore.links?.push(values.companyTwitterUrl);
    }
    if (values.companyLinkedInUrl) {
      updatedStore.links?.push(values.companyLinkedInUrl);
    }
    if (values.companyPinterestUrl) {
      updatedStore.links?.push(values.companyPinterestUrl);
    }
    if (values.companyYelpUrl) {
      updatedStore.links?.push(values.companyYelpUrl);
    }
    if (values.companyYouTubeUrl) {
      updatedStore.links?.push(values.companyYouTubeUrl);
    }
    if (values.companyInstagramUrl) {
      updatedStore.links?.push(values.companyInstagramUrl);
    }
    return updatedStore;
  };
  const _getStoreDetails = () => {
    if (!store) {
      return {};
    } else {
      const { firstName, lastName } = _getNames(store.merchant);
      return {
        firstName,
        lastName,
        number: store.number, // TODO: Review if this change to address is correct - AddressInfo
        street1: store.street1,
        street2: store.street2,
        city: store.city,
        state: store.state,
        zip: store.zip,
        country: store.country,
        companyType: store.companyType,
        companyName: store.companyName,
        email: store.emails && store.emails.length ? store.emails[0] : '',
        website: _getLinks(store.links || [], 'website'),
        phoneNumber: store.phoneNumber,
        faxNumber: '', // TODO: field faxNumber not defined in store yet
        companyDescription: store.companyDescription,
        companyFacebookUrl: _getLinks(store.links || [], 'facebook'),
        companyTwitterUrl: _getLinks(store.links || [], 'twitter'),
        companyLinkedInUrl: _getLinks(store.links || [], 'linkedin'),
        companyPinterestUrl: _getLinks(store.links || [], 'pinterest'),
        companyYelpUrl: _getLinks(store.links || [], 'yelp'),
        companyYouTubeUrl: _getLinks(store.links || [], 'youtube'),
        companyInstagramUrl: _getLinks(store.links || [], 'instagram'),
        companyLogoUrl: store.companyLogoUrl,
        coverImageUrl: store.coverImageUrl,
      };
    }
  };

  console.log(store);

  return (
    <>
      {
        // TODO: For some reason user or store could be undefined if that's the case probably MerchantSettings doesn't need to be shown or internally provide a better way to deal with these cases
        // FIXME: handleSubmit is never sent so it is no clear how this thing is update
      }
      <MerchantSettings
        categories={categories}
        initialValues={_getStoreDetails()}
        onSubmit={_updateStore}
        uploadImage={_uploadMerchantImage}
        uploadCoverImage={_uploadMerchantCoverImage}
        imageName={user ? `${user.uid}-logo` : ''}
        coverImageName={user ? `${user.uid}_cover` : ''}
        companyLogoUrl={store ? store.companyLogoUrl : ''}
        coverImageUrl={store ? store.coverImageUrl : ''}
      />
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    store: state.accountMerchant.store,
    categories: state.publicData.categories,
    user: state.auth.user,
    error: state.errors.apiError,
    isStoreUpdated: state.accountMerchant.isStoreUpdated,
    isMerchant: getIsMerchant(state),
    isUserSignedIn: state.auth.isUserSignedIn,
    isInitialized: state.app.isInitialized,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_MERCHANT_SETTINGS,
    },
    globalProps: {
      headTitle: 'Merchant Settings',
    },
  };
};

//Page.getLayout = getLayout; // TODO: Rework to remove toolbar and properly use whole area available. SECURITY ISSUE

export default connect(mapStateToProps, mapDispatchToProps)(Page);
