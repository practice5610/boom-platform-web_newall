import { getComposedAddressFromStore, Store } from '@boom-platform/globals';
import moment from 'moment';
import { NextPage, NextPageContext } from 'next';
import { Container } from 'next/app';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Col, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import useWindowSize from '../../hooks/useWindowSize';
import { requestStoreDetails } from '../../redux/actions/stores';
import { AppState } from '../../redux/reducers';
import { NextLayoutPage } from '../../types';
import { replaceDomain } from '../../utils/images';
import { formatPhoneForFirebaseAuth } from '../../utils/phone';

// interface Props {}

/**
 * Shows store  detail after selected from map
 */
const Page: NextPage = () => {
  alert('this page is running');
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const dispatch = useDispatch();
  const store = useSelector((state: AppState) => state.storesConfig.storeDetails);
  const screen = useWindowSize();
  const [links, setLinks] = useState<{
    fb?: string;
    insta?: string;
    yelp?: string;
    other: string[];
  }>({ other: [] });
  useEffect(() => {
    if (id) dispatch(requestStoreDetails(id as string));
  }, [id]);

  useEffect(() => {
    const newLinks: {
      fb?: string;
      insta?: string;
      yelp?: string;
      twitter?: string;
      other: string[];
    } = { other: [] };
    store?.links?.forEach((link: string) => {
      let lowerLink = link.toLowerCase();

      if (!lowerLink.includes('http://') && !lowerLink.includes('https://')) {
        lowerLink = 'http://' + lowerLink;
      }

      if (lowerLink.includes('facebook') || lowerLink.includes('fb.com')) {
        newLinks.fb = lowerLink;
      } else if (lowerLink.includes('instagram')) {
        newLinks.insta = lowerLink;
      } else if (lowerLink.includes('yelp')) {
        newLinks.yelp = lowerLink;
      } else if (lowerLink.includes('twitter')) {
        newLinks.twitter = lowerLink;
      } else {
        if (newLinks?.other?.length) {
          newLinks.other.push(lowerLink);
        } else {
          newLinks.other = [lowerLink];
        }
      }
    });

    setLinks(newLinks);
  }, [store?.links]);
  const _goBack = () => {
    if (window.document.referrer.indexOf(window.location.host) < 0 || window.history.length <= 1) {
      window.location.href = `${window.location.protocol}//${window.location.host}`;
    } else {
      window.history.go(-1);
    }
  };
  if (!store) return <div>loading</div>;
  return (
    <Container>
      <div style={{ padding: screen.type === 'MOBILE' ? 0 : 10, backgroundColor: '#eeeeee' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e2e2' }}>
          <Row style={{ justifyContent: 'center' }}>
            <Col xs='12' md='8'>
              {store.coverImageUrl ? (
                <div style={{ height: 300, width: '100%', overflow: 'hidden' }}>
                  <Image
                    objectFit='cover'
                    objectPosition='left top'
                    layout='fill'
                    src={replaceDomain(store.coverImageUrl)}
                  />
                </div>
              ) : (
                <div style={{ height: 200, width: '100', backgroundColor: 'grey' }}>No image</div>
              )}
            </Col>
          </Row>
          <Row style={{ justifyContent: 'center' }}>
            <Col xs='0' md='3'></Col>
            <Col
              xs='5'
              md='2' // style={{ height: screen.type === 'MOBILE' ? 80 : 120 }}
            >
              <div
                style={{
                  boxShadow: '1px 1px 3px 1px #999999',
                  borderRadius: '50%',
                  border: '1px solid #e2e2e2',
                  display: 'block',
                  overflow: 'hidden',
                  width: '100%',
                  height: 0,
                  paddingBottom: '100%',
                  marginTop: '-55%',
                  backgroundColor: 'white',
                }}
              >
                {store.companyLogoUrl && (
                  <Image width='300' height='300' src={replaceDomain(store.companyLogoUrl)} />
                )}
              </div>
            </Col>
            <Col xs='11' md='3'>
              <Button
                style={{ width: '100%', marginTop: 5 }}
                onClick={() => router.push(`/search?m=${store._id}${store.companyName}`)}
              >
                Search this store
              </Button>
            </Col>
          </Row>

          <Row style={{ justifyContent: 'center' }}>
            <Col xs='auto'>
              <h1 style={{ height: '0' }}>{store.companyName}</h1>
            </Col>
          </Row>

          <Row style={{ justifyContent: 'center' }}>
            <Col
              xs='auto'
              md='auto'
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: 50,
              }}
            >
              {links.fb && (
                <a style={{ margin: 5 }}>
                  <Image
                    onClick={() => {
                      console.log('fb');
                    }}
                    width='30'
                    height='30'
                    src='/images/icon_fb_70.png'
                  />
                </a>
              )}
              {links.insta && (
                <a style={{ margin: 5 }}>
                  <Image
                    onClick={() => {
                      console.log('ig');
                    }}
                    width='30'
                    height='30'
                    src='/images/icon_ig_small.png'
                  />
                </a>
              )}
              {links.yelp && (
                <a style={{ margin: 5 }}>
                  <Image
                    onClick={() => {
                      console.log('yelp');
                    }}
                    width='30'
                    height='30'
                    src='/images/icon_yelp_small.png'
                  />
                </a>
              )}
            </Col>
          </Row>

          <Row style={{ justifyContent: 'center' }}>
            <Col
              xs='10'
              md='4'
              style={{ boxShadow: '1px 1px 3px 1px #999999', margin: 4, padding: 10 }}
            >
              <p>{store.companyDescription}</p>
              <p>
                {links.other.map((link: string, index: number) => (
                  <div key={index}>
                    <a href={link}>{link}</a>
                  </div>
                ))}
              </p>
            </Col>
            <Col
              xs='10'
              md='4'
              style={{ boxShadow: '1px 1px 3px 1px #999999', margin: 4, padding: 10 }}
            >
              <p>{store.phoneNumber && formatPhoneForFirebaseAuth(store.phoneNumber)}</p>
              <p>
                <div>{`${store.number} ${store.street1}`}</div>
                {store.street2 && <div>{`${store.street2}`}</div>}
                <div>{`${store.city}, ${store.state}, ${store.zip}`}</div>
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default Page;
