import { AddressInfo } from '@boom-platform/globals';
import React, { FC, ReactElement } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import FormAddressSelection from './forms/FormAddressSelection';

interface Props {
  handleModal: () => void;
  visible: boolean;
  selectedAddress?: AddressInfo;
  handleSetSelectedAddress: (address: AddressInfo) => void;
}

const ModalAddressSelection: FC<Props> = ({
  handleModal,
  visible,
  selectedAddress,
  handleSetSelectedAddress,
}): ReactElement => {
  return (
    <div>
      <Modal
        isOpen={visible}
        toggle={handleModal}
        centered
        fade={false}
        className={'modal-dialog-scrollable modal-xl'}
      >
        <ModalHeader toggle={handleModal} className={'mb-2'} />
        <ModalBody>
          <FormAddressSelection
            handleModal={handleModal}
            selectedAddress={selectedAddress}
            handleSetSelectedAddress={handleSetSelectedAddress}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  // categories: state.storesConfig.storeCategories,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddressSelection);
