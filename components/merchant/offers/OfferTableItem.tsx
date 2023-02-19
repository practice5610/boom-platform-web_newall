import { fromMoney, Offer } from '@boom-platform/globals';
import moment from 'moment';
import Image from 'next/image';
import React, { FC, ReactElement } from 'react';
import { Button } from 'reactstrap';

import { replaceDomain } from '../../../utils/images';

type Props = {
  offer: Offer;
  toggleOffer?: () => void;
  handleSelectedOffer?: (offer) => void;
};

export const OfferTableItem: FC<Props> = ({
  offer,
  toggleOffer,
  handleSelectedOffer,
}): ReactElement => {
  const now = moment(new Date()).unix();

  const expired: boolean = now > (offer.expiration ?? 0) ? true : false;

  const handleEditOffer = () => {
    handleSelectedOffer?.(offer);
    toggleOffer?.();
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
          <Button className='m-sm-1'>Cancel</Button>
        )}
        <Button className='m-sm-1' onClick={handleEditOffer}>
          Edit
        </Button>
      </td>
    </tr>
  );
};
