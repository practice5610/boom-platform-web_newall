import { Product } from '@boom-platform/globals';
import React, { FC, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { AppState } from '../../../redux/reducers';
import FormAddOffer from '../forms/FormAddOffer';

interface Props {
  handleModal: () => void;
  visible: boolean;
  selectedProduct?: Product;
}

const ModalAddOffer: FC<Props> = ({ handleModal, visible, selectedProduct }): ReactElement => {
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
          <FormAddOffer handleModal={handleModal} selectedProduct={selectedProduct} />
        </ModalBody>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  // categories: state.storesConfig.storeCategories,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddOffer);
