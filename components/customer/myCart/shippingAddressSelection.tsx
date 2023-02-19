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
      {user?.addresses && user.addresses.length > 0 && (
        <div className='m-2'>
          <small>Ship to: </small>
          <small className='text-danger'>
            {`${user.firstName ?? ''} 
              ${user.lastName ?? ''}, 
              ${selectedAddress?.number ? selectedAddress.number : user.addresses[0].number ?? ''} 
              ${
                selectedAddress?.street1 ? selectedAddress.street1 : user.addresses[0].street1 ?? ''
              } 
              ${
                selectedAddress?.street2 ? selectedAddress.street2 : user.addresses[0].street2 ?? ''
              } 
              ${selectedAddress?.city ? selectedAddress.city : user.addresses[0].city ?? ''} 
              ${selectedAddress?.state ? selectedAddress.state : user.addresses[0].state ?? ''} 
              ${
                selectedAddress?.country ? selectedAddress.country : user.addresses[0].country ?? ''
              }
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
      )}
    </div>
  );
};
