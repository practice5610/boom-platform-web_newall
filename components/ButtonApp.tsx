import React, { FunctionComponent, MouseEvent } from 'react';

type Props = {
  disabled?: boolean;
  loading?: boolean;
  children?: any;
  onClick?(e: MouseEvent<HTMLElement>): void;
};

const ButtonApp: FunctionComponent<Props> = ({ disabled, loading, children, onClick }) => (
  <button className='btn bg-red' disabled={disabled || loading} onClick={onClick}>
    {loading && <i className='fa fa-spinner fa-spin'></i>}
    {children}
  </button>
);

ButtonApp.defaultProps = {};

export default ButtonApp;
