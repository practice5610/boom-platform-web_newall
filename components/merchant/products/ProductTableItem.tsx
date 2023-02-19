import { fromMoney, Product } from '@boom-platform/globals';
import Image from 'next/image';
import React, { FC, ReactElement } from 'react';
import { Button } from 'reactstrap';

import { replaceDomain } from '../../../utils/images';

type Props = {
  product: Product;
  hasOffer: boolean;
  toggleOffer?: () => void;
  toggleEditProduct?: () => void;
  handleSelectedProduct?: (product) => void;
};
export const ProductTableItem: FC<Props> = ({
  product,
  hasOffer,
  toggleOffer,
  toggleEditProduct,
  handleSelectedProduct,
}): ReactElement => {
  const handleAddOffer = () => {
    handleSelectedProduct?.(product);
    toggleOffer?.();
  };

  const handleEditProduct = () => {
    handleSelectedProduct?.(product);
    toggleEditProduct?.();
  };
  return (
    <tr>
      <th scope='row'>
        <Image
          src={
            product.imageUrl?.includes('http')
              ? replaceDomain(product.imageUrl)
              : 'https://via.placeholder.com/100'
          }
          alt='Picture of the product'
          width={50}
          height={50}
        />
      </th>
      <td>{product.name}</td>
      <td>{product.category?.name}</td>
      <td>{product.category?.subCategories}</td>
      <td>{fromMoney(product.price)}</td>
      <td>{product.quantity}</td>
      <td>{product.status}</td>
      <td>{hasOffer ? 'Active' : 'Not Active'}</td>
      <td>
        <Button className='m-sm-1' onClick={handleEditProduct}>
          edit item
        </Button>
        <Button className='m-sm-1' onClick={handleAddOffer}>
          create offer
        </Button>
      </td>
    </tr>
  );
};
