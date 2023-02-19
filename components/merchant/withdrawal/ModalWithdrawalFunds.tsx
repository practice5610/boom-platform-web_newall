import { Money } from '@boom-platform/globals';
import React, { FC, ReactElement } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { AppState } from '../../../redux/reducers';
import FormWithdrawalFunds from '../forms/FormWithdrawalFunds';

interface Props {
  handleModal: () => void;
  visible: boolean;
  balanceAvailable: Money;
}

const ModalWithdrawalFunds: FC<Props> = ({
  handleModal,
  visible,
  balanceAvailable,
}): ReactElement => {
  return (
    <div>
      <Modal isOpen={visible} toggle={handleModal} centered fade={false}>
        <ModalHeader toggle={handleModal} className={'mb-2'} />
        <ModalBody>
          <FormWithdrawalFunds balanceAvailable={balanceAvailable} toggleBox={handleModal} />
        </ModalBody>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  // categories: state.storesConfig.storeCategories,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalWithdrawalFunds);
