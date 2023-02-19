import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import { replaceDomain } from '../utils/images';

interface Props {
  className: string;
  src: string;
}

const Avatar: FunctionComponent<Props> = ({ className, src }) => {
  return (
    <div className={clsx('Avatar', className)}>
      <img className='profile-icon-size' src={replaceDomain(src)} alt='Profile' />
    </div>
  );
};

export default Avatar;
