import { AddressInfo, BoomUser } from '@boom-platform/globals';
import React, { FC, ReactElement, useState } from 'react';
import { Button } from 'reactstrap';

import ModalAddressSelection from '../modalAddressSelection';

type Props = {
  user?: BoomUser;
  selectedAddress?: AddressInfo;
  handleSetSelectedAddress: (address: AddressInfo) => void;
};

export const ShippingAddressSelection: FC<Props> = ({
  user,
  selectedAddress,
  handleSetSelectedAddress,
}): ReactElement => {
  const [modalAddressSelection, setModalAddressSelection] = useState<boolean>(false);
  const handleSetModal = () => {
    setModalAddressSelection(!modalAddressSelection);
  };
  return (
    <div className='container-fluid border p-1'>
      <div className='m-2'>
        <small>Ship to: </small>
        <small className='text-danger'>
          {`${user?.firstName ?? ''} 
              ${user?.lastName ?? ''}, 
              ${selectedAddress?.number ? selectedAddress.number : '0317683688'} 
              ${selectedAddress?.street1 ? selectedAddress.street1 : '234'} 
              ${selectedAddress?.street2 ? selectedAddress.street2 : 'street2'} 
              ${selectedAddress?.city ? selectedAddress.city : 'uk'} 
              ${selectedAddress?.state ? selectedAddress.state : 'america'} 
              ${selectedAddress?.country ? selectedAddress.country : 'england'}
            `}
        </small>
        <div className='d-flex justify-content-center m-2'>
          <Button
            onClick={() => {
              handleSetModal();
            }}
          >
            edit or add shipping address
          </Button>
        </div>
        <ModalAddressSelection
          handleModal={handleSetModal}
          visible={modalAddressSelection}
          selectedAddress={selectedAddress}
          handleSetSelectedAddress={handleSetSelectedAddress}
        />
      </div>
    </div>
  );
};
