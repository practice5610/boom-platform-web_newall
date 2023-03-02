import { fromMoney, Offer } from '@boom-platform/globals';
import moment from 'moment';
import Image from 'next/image';
import React, { FC, ReactElement } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { deleteOffer, requestFilteredOffers } from '../../../redux/actions/account-merchant';
import { AppState } from '../../../redux/reducers';
import { replaceDomain } from '../../../utils/images';

type Props = {
  offer: Offer;
  toggleOffer?: () => void;
  handleSelectedOffer?: (offer: any) => void;
  deleteOffer?: typeof deleteOffer;
  requestFilteredOffers?: typeof requestFilteredOffers;
};

const OfferTableItem: FC<Props> = ({
  offer,
  toggleOffer,
  handleSelectedOffer,
  deleteOffer,
  requestFilteredOffers,
}): ReactElement => {
  const now = moment(new Date()).unix();

  const expired: boolean = now > (offer.expiration ?? 0) ? true : false;

  const handleEditOffer = () => {
    handleSelectedOffer?.(offer);
    toggleOffer?.();
  };

  /**
   * This function set the filter state and dispatch an action to fetch offer by that filter.
   * @param filter
   */

  const handleCancelOffer = (filter: string) => {
    // console.log(offer?._id, filter);
    deleteOffer?.(offer?._id);
    requestFilteredOffers?.(filter, 10, 0);
  };

  return (
    <tr>
      <th scope='row'>
        <Image
          src={
            offer.product.imageUrl?.includes('http')
              ? replaceDomain(offer.product.imageUrl)
              : 'https://via.placeholder.com/100'
          }
          alt='Picture of the product'
          width={50}
          height={50}
        />
      </th>
      <td>{offer.title}</td>
      <td>{offer.product.category?.name}</td>
      <td>{offer.maxVisits}</td>
      <td>{fromMoney(offer.product.price)}</td>
      <td>{fromMoney(offer.cashBackPerVisit)}</td>
      <td>{expired ? <strong>Expired</strong> : <strong>Active</strong>}</td>
      {offer.createdAt && offer.expiration ? (
        <td>
          <span style={{ fontSize: '1rem' }}>
            Activated: {moment.unix(offer.createdAt).format('MM/DD/YYYY')}
            <br />
            Expires: {moment.unix(offer.expiration).format('MM/DD/YYYY')}
          </span>
        </td>
      ) : (
        <></>
      )}
      <td>
        {expired ? (
          <Button className='m-sm-1'>Activate</Button>
        ) : (
          <Button className='m-sm-1' onClick={handleCancelOffer}>
            Cancel
          </Button>
        )}
        <Button className='m-sm-1' onClick={handleEditOffer}>
          Edit
        </Button>
      </td>
    </tr>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OfferTableItem);

//https://devapi.moobmarketplace.com/api/v1/offers?filter={"where":{"and":[{"merchantUID":"SseaCdgh13R1MQWRKP3gXbQrbyl2"}],"or":[{"title":{"like":".*.*","options":"i"}},{"product.category.name":{"like":".*.*","options":"i"}},{"maxVisits":{"like":".*.*","options":"i"}},{"product.price.amount":{"like":".*.*","options":"i"}},{"product.cashBackPerVisit.amount":{"like":".*.*","options":"i"}}]},"order":["createdAt+DESC"],"limit":10,"skip":0}
