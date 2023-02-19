import { Offer } from '@boom-platform/globals';
import _ from 'lodash';
import React, { FC, ReactElement, useState } from 'react';
import { useEffect } from 'react';
import { Table } from 'reactstrap';

import { OfferTableItem } from './OfferTableItem';

type Props = {
  offers?: Offer[];
  toggleOffer?: () => void;
  handleSelectedOffer?: (offer: Offer) => void;
  reload?: any;
};

export const OfferTable: FC<Props> = ({
  offers,
  toggleOffer,
  handleSelectedOffer,
}): ReactElement => {
  const [offerState, setOfferState] = useState<Offer[] | undefined>(undefined);
  useEffect(() => {
    setOfferState(offers);
  }, [offers]);

  const _sortByColumn = (column: string) => {
    const sortedOffers: Offer[] = _.sortBy(offerState, [column]);
    setOfferState(sortedOffers);
  };

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th></th>
          <th
            onClick={() => {
              _sortByColumn('title');
            }}
          >
            Offer title
          </th>
          <th
            onClick={() => {
              _sortByColumn('product.category.name');
            }}
          >
            Product category
          </th>
          <th
            onClick={() => {
              _sortByColumn('maxVisits');
            }}
          >
            Max visits
          </th>
          <th
            onClick={() => {
              _sortByColumn('price.amount');
            }}
          >
            Price
          </th>
          <th
            onClick={() => {
              _sortByColumn('cashBackPerVisit.amount');
            }}
          >
            Cashback
          </th>
          <th>Status</th>
          <th>Dates</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {offerState?.map((offer: Offer) => (
          <OfferTableItem
            key={offer._id}
            offer={offer}
            toggleOffer={toggleOffer}
            handleSelectedOffer={handleSelectedOffer}
          />
        ))}
      </tbody>
    </Table>
  );
};
