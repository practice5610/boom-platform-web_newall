import {
  AllOptionalExceptFor,
  BoomUser,
  Category,
  fromMoney,
  Money,
  Offer,
  Product,
  Store,
  toMoney,
} from '@boom-platform/globals';
import Dinero from 'dinero.js';
import parser from 'fast-xml-parser';
import moment from 'moment';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../../../components/LayoutAccount';
import actionCreators from '../../../redux/actions';
import { requestStore } from '../../../redux/actions/account-merchant';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, NextLayoutPage } from '../../../types';
import { post } from '../../../utils/api';

interface Props {
  jwt: string;
  requestStore: typeof requestStore;
  user: AllOptionalExceptFor<BoomUser, 'uid'>;
  store: Store;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({ jwt, requestStore, user, store }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [fileReader, setFileReader] = useState<FileReader | null>(null);
  const [currentFile, setCurrentFile] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      requestStore();
    }
  }, [user, requestStore]);

  const _onChange = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    const type = file.type;

    setCurrentType(type);

    if (type === 'application/json') {
      setFileReader(reader);
      reader.readAsText(file);
    } else {
      setCurrentFile(file);
      setFileReader(reader);
      reader.readAsText(file);
    }
  };

  const _decodeHTMLEntities = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  const _handleSubmit = async (useOffers) => {
    try {
      setMessage(`Please wait...`);

      if (!fileReader) {
        console.error('No reader');
        return;
      }
      const data = parser.parse(fileReader.result as string);
      if (currentType === 'application/json') {
        console.log('Is JSON');
        const products: Product[] = data.itemList.map((product) => {
          let tempPrice = product.price;
          if (product.price.toString().indexOf('.') === -1) {
            tempPrice = `${product.price.toString()}.00`;
          }
          const amount = toMoney(tempPrice);
          return {
            ...product,
            merchantUID: user.uid,
            price: amount,
            store: {
              _id: user.store?._id ?? '',
              companyName: user.store?.companyName ?? '',
              number: user.store?.number ?? '', // TODO: Review if this change to address is correct - AddressInfo
              street1: user.store?.street1 ?? '',
              street2: user.store?.street2 ?? '',
              _geoloc: store._geoloc,
              merchant: { uid: user.uid, firstName: user.firstName, lastName: user.lastName }, // Why not just user?
            } as Store,
          } as Product;
        });

        console.log(products);

        const result = await post('/products', products, { timeout: 60000 }, jwt);
        if (result.data.successful.length && !useOffers) {
          setMessage(
            `Success, created ${result.data.successful.length} products. ${result.data.failed.length} products failed.`
          );
        } else if (result.data.successful.length && useOffers) {
          setMessage(
            `Success, created ${result.data.sucessful.length} products. Now will create the offers...`
          );
          const offers = _createOfferObjects(result.data.successful);
          await _createOffers(offers);
          setMessage(`Success, created offers.`);
        } else {
          setMessage(`No products were created. ${result.data.failed.length} products failed.`);
        }
      } else {
        console.log('is XML');
        const products: Product[] = data.itemlist.item.map((product) => {
          console.log(product);
          let tempPrice = product.price;

          if (tempPrice.toString().indexOf('.') === -1) {
            tempPrice = `${product.price.toString()}.00`;
          }

          const amount = toMoney(tempPrice);
          const categoriesDecoded = _decodeHTMLEntities(product.categories);
          const categoriesArray = categoriesDecoded.split('||');
          const mainCategory = categoriesArray[0];
          const subCategory = categoriesArray[1];

          return {
            attributes: {
              upc: product.upc,
              product_id: product.product_id,
              item_id: product.item_id,
              stock: product.stock,
              supplier_id: product.supplier_id,
              supplier_name: product.supplier_name,
              brand_name: product.brand_name,
              item_sku: product.item_sku,
              ship_weight: product.ship_weight,
              warranty: product.warranty,
            },
            category: { name: mainCategory, subCategories: [subCategory] } as Category,
            imageUrl: product.image_file || product.additional_images,
            name: product.item_name || product.title,
            merchantUID: user.uid,
            price: amount,
            description: product.description,
            _tags: [],
            store: {
              _id: user.store?._id ?? '',
              companyName: user.store?.companyName ?? '',
              number: user.store?.number ?? '', // TODO: Review if this change to address is correct - AddressInfo
              street1: user.store?.street1 ?? '',
              street2: user.store?.street2 ?? '',
              _geoloc: store._geoloc,
              merchant: { uid: user.uid, firstName: user.firstName, lastName: user.lastName }, // Why not just user?
            } as Store,
          };
        });
        console.log(store);
        console.log(products);

        const result = await post('/products', products, { timeout: 60000 }, jwt);

        if (result.data.successful.length && !useOffers) {
          setMessage(
            `Success, created ${result.data.successful.length} products. ${result.data.failed.length} products failed.`
          );
        } else if (result.data.successful.length && useOffers) {
          setMessage(
            `Success, created ${result.data.sucessful.length} products. Now will create the offers...`
          );
          const offers = _createOfferObjects(result.data.successful);
          await _createOffers(offers);
          setMessage(`Success, created offers.`);
        } else {
          setMessage(`No products were created. ${result.data.failed.length} products failed.`);
        }
      }
    } catch (error: any) {
      console.error(error);
      setMessage(error.toString());
    }
  };
  const _createOfferObjects = (products) => {
    const offers = products.map((product) => {
      const percentage: Dinero.Dinero = Dinero(product.price).percentage(10);
      return {
        cashBackPerVisit: percentage.toObject() as Money,
        merchantUID: product.merchantUID,
        description: `${fromMoney(percentage.toObject() as Money)} Cash Back on ${product.name}`,
        maxQuantity: 500,
        maxVisits: 100,
        startDate: moment().utc().unix(),
        expiration: moment().utc().add(500, 'days').unix(),
        title: product.name,
        product,
      } as Offer;
    });
    return offers;
  };
  const _createOffers = async (offers) => {
    for (const offer of offers) {
      try {
        await post('/offers', offer, { timeout: 60000 }, jwt);
      } catch (error: any) {
        throw new Error(error);
      }
    }
  };
  return (
    <>
      <Container>
        <h2>Upload Products from Moob .json file or Generic XML file</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            _handleSubmit(false);
          }}
        >
          <input type='file' accept='.json,application/json,.xml' onChange={_onChange} />
          <button type='submit'>Upload</button>
        </form>
        <p>{message}</p>
      </Container>
      <Container>
        <h2>Upload Products from Moob .json file or Generic XML file and create offers</h2>
        <p>
          The product will be created and an offer with a 10% cash back value will also be created.
        </p>
        <p>Warning: Creating offers this way is very slow!</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            _handleSubmit(true);
          }}
        >
          <input type='file' accept='.json,application/json,.xml' onChange={_onChange} />
          <button type='submit'>Upload</button>
        </form>
        <p>{message}</p>
      </Container>
    </>
  );
};
const mapStateToProps = (state: AppState) => ({
  jwt: state.auth.jwt,
  user: state.auth.user,
  store: state.accountMerchant.store,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    globalProps: {
      headTitle: 'Uploader',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
