import React, { FC, ReactElement } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { AppState } from '../../../redux/reducers';
import FormUploadCatalog from '../forms/FormUploadCatalog';

interface Props {
  handleModal: () => void;
  visible: boolean;
}

const ModalUploadCatalog: FC<Props> = ({ handleModal, visible }): ReactElement => {
  return (
    <Modal
      isOpen={visible}
      toggle={handleModal}
      centered
      fade={false}
      className={'modal-dialog-scrollable modal-xl'}
    >
      <ModalHeader toggle={handleModal} className={'mb-2'} />
      <ModalBody>
        <FormUploadCatalog />
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state: AppState) => ({
  // categories: state.storesConfig.storeCategories,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalUploadCatalog);
