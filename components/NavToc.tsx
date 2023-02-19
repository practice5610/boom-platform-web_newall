import React, { useEffect, useState } from 'react';

import { isServer } from '../utils/environment';
declare let document;

type Props = {
  sections?: string[];
};

const InputStoreSearch: React.FunctionComponent<Props> = ({ sections = [] }) => {
  const [buttons, setButtons] = useState([] as JSX.Element[]);
  const [stickyClass, setStickyClass] = useState('toc-not-sticky');

  useEffect(() => {
    const btns: JSX.Element[] = sections.map(
      (section): JSX.Element => (
        <div
          key={section}
          className='toc-button'
          onClick={(e) => {
            !isServer && document.getElementById(section).scrollIntoView();
          }}
        >
          {!isServer && document.getElementById(section).innerHTML}
        </div>
      )
    );
    setButtons(btns);
  }, []);

  useEffect(() => {
    const onScroll = (e) => {
      if (e.currentTarget.scrollY > 167) {
        setStickyClass('toc-sticky');
      } else {
        setStickyClass('toc-not-sticky');
      }
    };

    window.addEventListener('scroll', onScroll);
    return function cleanup() {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className='toc-container'>
      <div className={stickyClass} style={{ width: '380px' }}>
        {buttons}
      </div>
    </div>
  );
};

export default InputStoreSearch;
