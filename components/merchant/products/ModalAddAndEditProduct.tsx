import { Product } from '@boom-platform/globals';
import React, { FC, ReactElement, useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestShippingBoxes, requestShippingPolicies } from '../../../redux/actions/shipping';
import { AppState } from '../../../redux/reducers';
import FormAddProduct from '../forms/FormAddProduct';
import FormAddShippingBox from '../forms/FormAddShippingBox';
import FormAddShippingPolicy from '../forms/FormAddShippingPolicy';

interface Props {
  handleModal: () => void;
  visible: boolean;
  handleEditProductMode?: () => void;
  editMode?: boolean;
  selectedProduct?: Product;
  requestShippingPolicies?: typeof requestShippingPolicies;
  requestShippingBoxes?: typeof requestShippingBoxes;
}

const ModalAddAndEditProduct: FC<Props> = ({
  handleModal,
  visible,
  handleEditProductMode,
  requestShippingPolicies,
  requestShippingBoxes,
  editMode,
  selectedProduct,
}): ReactElement => {
  // useEffect(() => {
  //   requestShippingPolicies?.();
  //   requestShippingBoxes?.();
  // }, []);

  const [policyModal, setPolicyModal] = useState(false);
  const [boxModal, setBoxModal] = useState(false);

  const togglePolicy = () => {
    setPolicyModal(!policyModal);
  };
  const toggleBox = () => {
    setBoxModal(!boxModal);
  };

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
          <FormAddProduct
            handleModal={handleModal}
            togglePolicy={togglePolicy}
            toggleBox={toggleBox}
            handleEditProductMode={handleEditProductMode}
            editMode={editMode}
            selectedProduct={selectedProduct}
          />

          <Modal
            isOpen={policyModal}
            toggle={togglePolicy}
            centered
            fade={false}
            className={'modal-dialog-scrollable modal-md'}
          >
            <ModalHeader toggle={togglePolicy} />
            <ModalBody>
              <FormAddShippingPolicy togglePolicy={togglePolicy} />
            </ModalBody>
          </Modal>

          <Modal
            isOpen={boxModal}
            toggle={toggleBox}
            centered
            fade={false}
            className={'modal-dialog-scrollable modal-md'}
          >
            <ModalHeader toggle={toggleBox} />
            <ModalBody>
              <FormAddShippingBox toggleBox={toggleBox} />
            </ModalBody>
          </Modal>
        </ModalBody>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  // categories: state.storesConfig.storeCategories,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddAndEditProduct);
