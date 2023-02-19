import React, { Fragment, FunctionComponent } from 'react';

import ButtonApp from './ButtonApp';

type Props = {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  children: any;
  buttonText: string;
  onConfirm(type: string): void;
  onDismiss(type: string): void;
  onOpen(content: any): void;
};

const ModalApp: FunctionComponent<Props> = ({
  title,
  disabled,
  loading,
  children,
  buttonText,
  onConfirm,
  onDismiss,
  onOpen,
}) => (
  <Fragment>
    {/* <ng-template #content let-c="close" let-d="dismiss"> */}
    <div className='modal-header'>
      <h4 className='modal-title'>{title}</h4>
      <button
        type='button'
        className='close'
        aria-label='Close'
        onClick={() => onDismiss('Cross click')}
      >
        <span aria-hidden='true'>&times;</span>
      </button>
    </div>
    <div className='modal-body'>{children}</div>
    <div className='modal-footer'>
      <button type='button' className='btn btn-outline-dark' onClick={() => onDismiss('cancel')}>
        Cancel
      </button>
      <button type='button' className='btn bg-red' onClick={() => onConfirm('confirm')}>
        {' '}
        Confirm
      </button>
    </div>
    {/* // </ng - template > */}
    <ButtonApp loading={loading} disabled={disabled} onClick={() => onOpen('content')}>
      {' '}
      {buttonText}
    </ButtonApp>
  </Fragment>
);

export default ModalApp;
