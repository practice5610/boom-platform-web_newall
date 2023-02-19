import { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { ToastRequest } from '../models/toast-request.model';
import actionCreators from '../redux/actions';
import { setGlobalToast } from '../redux/actions/app';
import { AppState } from '../redux/reducers';
interface Props {
  setGlobalToast: typeof setGlobalToast;
  toast?: ToastRequest;
}
/**
 * Displays toast notifications to user on any page of the site.
 */
let timer;

const ToastGlobal: FunctionComponent<Props> = ({ setGlobalToast, toast }) => {
  useEffect(() => {
    if (toast) {
      timer = setTimeout(() => {
        setGlobalToast(null);
      }, 6000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [toast]);

  return (
    <Toast className='GlobalToast' isOpen={!!toast}>
      <ToastHeader icon={toast && toast!.type} toggle={() => setGlobalToast!(null)}>
        {toast && toast.heading}
      </ToastHeader>
      <ToastBody>{toast && toast.body}</ToastBody>
    </Toast>
  );
};

const mapStateToProps = (state: AppState) => ({
  toast: state.app.toast,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ToastGlobal);
