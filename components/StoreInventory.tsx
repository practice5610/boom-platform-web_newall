import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Container, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { AppState } from '../redux/reducers';
import RequestInventoryReturn from './RequestInventoryReturn';
interface Summary {
  Quantity: number;
}

const StoreInventory = (props) => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
  const [inventorySummary, setInventorySummary] = useState({});
  const {
    isInitialized,
    isUserSignedIn,
    error,
    store,
    requestStore,
    inventoryItemTypes,
    getInventoryItemTypes,
    inventoryOrders,
    getInventoryOrders,
    setLoadingOverlay,
  } = props;

  useEffect(() => {
    getInventoryOrders();
  }, []);

  useEffect(() => {
    if (isInitialized && isUserSignedIn) {
      setLoadingOverlay(true);
      if (!store) {
        requestStore!();
      }
      if (inventoryItemTypes !== null) {
        getInventoryItemTypes();
      }
      getInventoryOrders();
    }
  }, [isInitialized, isUserSignedIn]);

  useEffect(() => {
    if (inventoryItemTypes !== null && store) {
      setLoadingOverlay(false);
    }
    if (error) {
      setLoadingOverlay(false);
    }
  }, [inventoryItemTypes, store, error]);

  useEffect(() => {
    const summary = {};
    if (inventoryOrders.length) {
      inventoryOrders.forEach((order) => {
        if (summary[`${order.item.itemType}_${order.item.count ? order.item.count : ''}`]) {
          summary[`${order.item.itemType}_${order.item.count ? order.item.count : ''}`] =
            summary[`${order.item.itemType}_${order.item.count ? order.item.count : ''}`] + 1;
        } else {
          summary[`${order.item.itemType}_${order.item.count ? order.item.count : ''}`] = 1;
        }
      });
      setInventorySummary(summary);
    }
  }, [inventoryOrders]);
  const toggleModal = () => setIsReturnModalOpen(!isReturnModalOpen);

  return (
    <div className='StoreInventory pb-5'>
      <RequestInventoryReturn toggleModal={toggleModal} isReturnModalOpen={isReturnModalOpen} />
      <div className='store-inventory-page pl-1'>
        <Container fluid>
          <Row className='mt-3'>
            {Object.keys(inventorySummary).map((key, index) => {
              const splitted_name: string[] = key ? key.split('_') : [];
              const name: string =
                splitted_name.length === 2
                  ? `${splitted_name[0]} ${splitted_name[1] ? '(' + splitted_name[1] + ')' : ''}`
                  : `${splitted_name[0]}`;
              return (
                <Col xs='6' className='d-flex align-items-center' key={key}>
                  <ul>
                    <li>
                      <strong> {name} :</strong> {inventorySummary[key]}
                    </li>
                  </ul>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>

      <div className='store-inventory-update pl-1 pb-5 pt-5'>
        <Container fluid>
          <Row className='mt-3'>
            <Col xs='6'>
              <Link href='/account/merchant/inventory'>
                <Button
                  className='d-flex align-items-center justify-content-center'
                  style={{
                    backgroundColor: '#D42C29',
                    fontSize: 24,
                    width: 182,
                    height: 37,
                    borderWidth: 0,
                    borderRadius: 'unset',
                  }}
                  color='danger'
                  size='lg'
                  // onClick={onSendInventoryOffer}
                >
                  Add More
                </Button>
              </Link>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col xs='6'>
              <Button
                className='d-flex align-items-center justify-content-center'
                style={{
                  backgroundColor: '#D42C29',
                  fontSize: 24,
                  height: 37,
                  borderWidth: 0,
                  borderRadius: 'unset',
                  paddingTop: 8,
                }}
                color='danger'
                size='lg'
                onClick={toggleModal}
              >
                Request Return/Cancellation
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  inventoryOrders: state.order.inventoryOrders,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StoreInventory);
