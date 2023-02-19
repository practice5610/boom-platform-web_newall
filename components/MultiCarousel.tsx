import 'react-alice-carousel/lib/alice-carousel.css';

import React, { FunctionComponent, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
    paritialVisibilityGutter: 60,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5,
    paritialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    paritialVisibilityGutter: 30,
  },
};

const MultiCarousel: FunctionComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = [
    <img key='travel-svg-1' alt='' src='/images/Travel.svg' className='product-img' />,
    <img key='travel-svg-2' alt='' src='/images/Travel.svg' className='product-img' />,
    <img key='travel-svg-3' alt='' src='/images/Travel.svg' className='product-img' />,
    <img key='travel-svg-4' alt='' src='/images/Travel.svg' className='product-img' />,
    <img key='travel-svg-5' alt='' src='/images/Travel.svg' className='product-img' />,
    <img key='travel-svg-6' alt='' src='/images/Travel.svg' className='product-img' />,
    <img key='travel-svg-7' alt='' src='/images/Travel.svg' className='product-img' />,
    <img key='travel-svg-8' alt='' src='/images/Travel.svg' className='product-img' />,
    <img key='travel-svg-9' alt='' src='/images/Travel.svg' className='product-img' />,
  ];

  const onSlideChanged = (e) => setCurrentIndex(e.item);

  const slideNext = () => {
    if (currentIndex + 1 <= items.length) setCurrentIndex((currentIndex) => currentIndex + 1);
  };

  const slidePrev = () => {
    if (currentIndex - 1 >= 0) setCurrentIndex((currentIndex) => currentIndex - 1);
  };

  return (
    <div className='carousel-container'>
      <div className='carousel-button'>
        <i className='fa fa-angle-left carousel-icon' onClick={() => slidePrev()}></i>
      </div>
      <div className='carousel-items'>
        <AliceCarousel
          mouseTracking
          items={items}
          infinite
          activeIndex={currentIndex}
          disableButtonsControls
          disableDotsControls
          onSlideChanged={onSlideChanged}
          autoPlayInterval={3000}
          responsive={{
            0: {
              items: 3,
            },
            768: {
              items: 5,
            },
            1024: {
              items: 8,
            },
          }}
        />
      </div>
      <div className='carousel-button'>
        <i className='fa fa-angle-right carousel-icon' onClick={() => slideNext()}></i>
      </div>
    </div>
  );
};

export default MultiCarousel;
