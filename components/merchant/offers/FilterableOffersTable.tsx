import { Offer } from '@boom-platform/globals';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { InputFilter } from '../InputFilter';
import Pagination, { PageData } from '../Pagination';
import { OfferTable } from './OfferTable';

type Props = {
  title: string;
  offers: { offers: Offer[]; count: number };
  onPageChanged?: (data: PageData) => void;
  onFilterChanged?: (filter: string) => void;
};

export const FilterableOffersTable: FC<Props> = ({
  title,
  offers,
  onPageChanged,
  onFilterChanged,
}): ReactElement => {
  const [modalEditOffer, setModalEditOffer] = useState(false);

  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(undefined);

  const handleSetOfferModal = () => {
    setModalEditOffer(!modalEditOffer);
  };

  const handleSelectedOffer = (offer: Offer) => {
    setSelectedOffer(offer);
  };
  return (
    <div className='filterable-product-table container-fluid border p-5'>
      <div className='filterable-product-table-header'>
        <p className='table-tittle m-3'>{title}</p>
        <Pagination
          totalRecords={offers.count}
          pageLimit={10} // This limit is set as 10 item per page until we decide if we need it dynamic
          pageNeighbours={2}
          onPageChanged={onPageChanged}
        />
        <InputFilter onFilterChanged={onFilterChanged} />
      </div>
      <OfferTable
        offers={offers.offers}
        toggleOffer={handleSetOfferModal}
        handleSelectedOffer={handleSelectedOffer}
      />
    </div>
  );
};
