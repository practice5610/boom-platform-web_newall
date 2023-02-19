import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button, FormGroup, Input } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { requestInventory, updateDeviceNickName } from '../redux/actions/account-merchant';
import { AppState } from '../redux/reducers';

const TabletManagement = (props) => {
  const dispatch = useDispatch();
  const [tablets, setTablets] = useState<any[]>([]);
  const [nickName, setNickName] = useState<string>('');
  const [currentTablet, setCurrentTablet] = useState<number>(-1);
  const { isSavingNickName, isNickNameSaved, inventory } = props;

  useEffect(() => {
    requestInventory();
  }, []);

  useEffect(() => {
    const tabs: any = [];
    if (inventory && inventory.length) {
      inventory.forEach((order) => {
        if (order.itemType == 'Tablet') {
          order['isEdit'] = false;
          tabs.push(order);
        }
      });

      setTablets(tabs);
    }
  }, [inventory]);

  useEffect(() => {
    if (isSavingNickName !== null && !isSavingNickName) {
      if (isNickNameSaved) {
        const tabs = tablets;
        tabs[currentTablet].isEdit = false;
        tabs[currentTablet].nickname = nickName;
        setNickName('');
        setTablets(tabs);
      }
    }
  }, [isNickNameSaved, isSavingNickName]);

  const editDeviceInfo = (index: number) => {
    const tabs = tablets;
    if (currentTablet >= 0) {
      tabs[currentTablet].isEdit = false;
    }
    tabs[index].isEdit = true;
    setNickName(tabs[index].nickname);
    setCurrentTablet(index);
    setTablets(tabs);
  };

  const updateNickName = (index: number) => {
    const tabs = tablets;
    if (nickName) {
      dispatch(updateDeviceNickName(nickName, tabs[index]._id));
    }
  };

  return (
    <div className='TabletManagement pb-5'>
      {tablets.map((tab, index) => {
        return (
          <div className='tablet-management-input' key={tab.friendlyID}>
            <div className='d-flex pl-4 pb-4 pt-4'>
              <div className='pl-3'>
                <div className='tablet-header'>
                  {tab.isEdit ? (
                    <FormGroup>
                      <Input
                        placeholder='Enter Tablet Name'
                        value={nickName}
                        onChange={(e) => {
                          setNickName(e.target.value);
                        }}
                      />
                    </FormGroup>
                  ) : (
                    <span style={{ fontSize: 28 }}>{tab.nickname}</span>
                  )}
                </div>
                <div className='d-flex align-items-start justify-content-start'>
                  <div className='d-flex flex-column'>
                    <span style={{ fontSize: 20 }}>Tablet {tab.friendlyID}</span>
                  </div>
                </div>
              </div>
              <div className='d-flex flex-column align-items-center pl-5 ml-auto cancel-btn-profile'>
                <Button
                  className='d-flex align-items-center justify-content-center'
                  style={{
                    backgroundColor: '#D42C29',
                    fontSize: 27,
                    width: 181,
                    height: 37,
                    borderWidth: 0,
                    borderRadius: 'unset',
                  }}
                  color='danger'
                  size='lg'
                  onClick={() => (tab.isEdit ? updateNickName(index) : editDeviceInfo(index))}
                >
                  {tab.isEdit ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  isSavingNickName: state.accountMerchant.isNickNameUpdateRequest,
  isNickNameSaved: state.accountMerchant.isNickNameUpdateSuccess,
  inventory: state.accountMerchant.inventory,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TabletManagement);
