import { Category, Geolocation, Product } from '@boom-platform/globals';
import moment from 'moment';
import { NextPageContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Carousel,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  Col,
  Container,
  Row,
} from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import MultiCarousel from '../components/MultiCarousel';
import {
  initSearch,
  ProductSearchControlsCtx,
  ProductSearchQuery,
  ProductSearchResultsCtx,
  ProductSearchRunner,
  SearchableProduct,
  SearchFilterQualifier,
  SearchMatchRestriction,
  SearchQuery,
  useProductSearch,
} from '../components/search';
import RenderIf from '../components/utils/RenderIf';
import actionCreators from '../redux/actions';
import { requestSMSAppLinks, setLoadingOverlay } from '../redux/actions/app';
import { requestGetAllProducts } from '../redux/actions/products';
import { AppState } from '../redux/reducers';
import { GlobalProps, NextLayoutPage } from '../types';
import { replaceDomain } from '../utils/images';

const items = [
  {
    src: '/images/home-banner-a.jpg',
    altText: 'Slide 1',
  },
  {
    src: '/images/home-banner-b.jpg',
    altText: 'Slide 2',
  },
  {
    src: '/images/home-banner-a.jpg',
    altText: 'Slide 3',
  },
];

interface Props {
  requestSMSAppLinks?: typeof requestSMSAppLinks;
  requestGetAllProducts?: typeof requestGetAllProducts;
  categories?: Category[];
  geoLocation?: Geolocation;
  ipAddress?: string;
  resultsState?: undefined | object;
  globalProps: GlobalProps;
  isUserSignedIn?: boolean;
  filterBy?: undefined | object;
  products?: { products: Product[]; count: number };
  setLoadingOverlay: typeof setLoadingOverlay;
}

const Page: NextLayoutPage<Props> = ({
  isUserSignedIn,
  categories,
  requestGetAllProducts,
  setLoadingOverlay,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const mainSearchControl = useContext(ProductSearchControlsCtx);
  const base: SearchQuery<ProductSearchQuery> = initSearch({
    distance_km: 100, // constants.searchDistanceLimit,
    location: { lat: 25.787097, lon: -80.204244 },
  }); //{} as SearchQuery<ProductSearchQuery>;
  const productsList = useSelector((state: AppState) => state.products.products);

  // const productsList = products ?? { products: [], count: 0 };

  const router = useRouter();

  // const search = [
  //   useProductSearch(base),
  //   useProductSearch(base),
  //   useProductSearch(base),
  //   useProductSearch(base),
  //   useProductSearch(base),
  //   useProductSearch(base),
  // ];

  //for elastic search
  // useEffect(() => {
  //   for (let i = 0; i < search.length; i++) {
  //     search[i].addRule(
  //       'categoryName',
  //       categories?.length ? categories[0].name : '',
  //       SearchMatchRestriction.Must,
  //       SearchFilterQualifier.Exact
  //     );
  //     search[i].addRule(
  //       'location',
  //       { lat: 0, lon: 0 },
  //       SearchMatchRestriction.Should,
  //       SearchFilterQualifier.Exact
  //     );
  //     search[i].addRule(
  //       'distance',
  //       'desc',
  //       SearchMatchRestriction.None,
  //       SearchFilterQualifier.None
  //     );
  //     search[i].addRule(
  //       'distance_km',
  //       9090,
  //       SearchMatchRestriction.Should,
  //       SearchFilterQualifier.Exact
  //     );
  //     search[i].search.query['geo_distance'] = { distance: '9000km', _geoloc: { lat: 0, lon: 0 } };
  //     search[i].addRule(
  //       'geo_distance' as any,
  //       { distance: '10000km', _geoloc: { lat: 0, lon: 0 } },
  //       SearchMatchRestriction.Must,
  //       SearchFilterQualifier.Exact
  //     );
  //   }
  // }, [categories]);

  useEffect(() => {
    requestGetAllProducts?.();
    // setLoadingOverlay(true);
  }, []);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: any) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const onAnimating = () => {
    setAnimating(true);
  };

  const onFinishAnimation = () => {
    setAnimating(false);
  };

  const handleSelect = (item: any) => {
    router.push(`/product/${item.id}`);
  };

  const slides = items.map((item, index) => {
    return (
      <CarouselItem
        onExiting={onAnimating}
        onExited={onFinishAnimation}
        key={index + ' ' + item.src}
        className='carousel-item-height'
      >
        <div className='hero' style={{ backgroundImage: `url(${item.src})` }} />
      </CarouselItem>
    );
  });

  // console.log(productsList);

  return (
    <>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        className='carousel-container'
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl direction='prev' directionText='Previous' onClickHandler={previous} />
        <CarouselControl direction='next' directionText='Next' onClickHandler={next} />
      </Carousel>

      <div className='main-container'>
        <Container className='category-card-container mr--85'>
          <Row style={{ justifyContent: 'center' }}>
            {categories?.map((category, i) => {
              return (
                <Col key={i} xs={12} sm={6} xl={4} className='text-center d-flex'>
                  <div className='category-card'>
                    <Card>
                      <CardBody>
                        <div className='category-title'>{category?.name}</div>
                        <div className='category-subtitle'>{'subtitle'}</div>
                        <div className='category-link'>See more</div>
                        <div className='products mt-4'>
                          <Container fluid>
                            <Row>
                              {productsList?.products?.map((product: Product) => {
                                if (category?.name === product?.category?.name) {
                                  return (
                                    <Col key={product._id} xs={6}>
                                      <div className='product-item'>
                                        <div className='product-img'>
                                          <img src={product?.imageUrl} alt={product?.name} />
                                        </div>

                                        <div className='product-title'>
                                          <h6>{product?.name}</h6>
                                        </div>
                                      </div>
                                    </Col>
                                  );
                                }
                              })}
                            </Row>
                          </Container>
                          {/* <ProductSearchControlsCtx.Provider value={s}>
                            <ProductSearchRunner
                              search={s.search}
                              enabled={true}
                              useType={'scroll'}
                            >
                              <ProductSearchResultsCtx.Consumer>
                                {(results) => {
                                  return (
                                    results?.data?.[0].data &&
                                    results.data[0].data.map((item, index) => {
                                      if (index < 4) {
                                        return (
                                          <div
                                            className='product-item'
                                            key={index + ' ' + item?.name}
                                            onClick={(e) => {
                                              e.preventDefault;
                                              handleSelect(item);
                                            }}
                                          >
                                            <div className='product-img'>
                                              <img
                                                alt={item?.name}
                                                width='90px'
                                                height='auto'
                                                src={replaceDomain(item?.imageUrl)}
                                              />
                                            </div>
                                            <div className='product-title'>{item?.name}</div>
                                          </div>
                                        );
                                      }
                                    })
                                  );
                                }}
                              </ProductSearchResultsCtx.Consumer>
                            </ProductSearchRunner>
                          </ProductSearchControlsCtx.Provider> */}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              );
            })}
            {/* {mainCategories.map((item, index) => {
              return (
                <Col xs={12} sm={6} xl={4} className='text-center d-flex' key={index + ' ' + item.title}>
                  <CategoryCard
                    title={item.title}
                    subtitle={item.subtitle}
                    products={item.products}
                  />
                </Col>
              );
            })} */}
          </Row>
        </Container>
      </div>
      <RenderIf condition={!isUserSignedIn}>
        <div className='btn-group'>
          Purchase all your favorite items after signing in
          <Link href='/account/login'>
            <div className='btn btn-signin'>Sign in to purchase!</div>
          </Link>
        </div>
      </RenderIf>
      <div className='pt-4' />
      <MultiCarousel />
      <RenderIf condition={!isUserSignedIn}>
        <div className='btn-group'>
          Big savings with purchase on Moob Carding
          <Link href='/account/login'>
            <button className='btn btn-signin'>Sign in to experience the savings!</button>
          </Link>
        </div>
      </RenderIf>
      <div className='pt-4' />
      <div
        className='d-flex justify-content-center'
        style={{ backgroundColor: '#f1efefe8', paddingTop: '3rem' }}
      >
        <button
          onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
          className='btn btn-go-to-top'
        >
          Go back to top
        </button>
      </div>
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    categories: state.publicData.categories,
    products: state.accountMerchant.products,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (ctx: PageContext) => {
  return {
    globalProps: {
      headTitle: 'Moob',
    },
  } as Props;
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
