import { Product } from '@boom-platform/globals';
import _ from 'lodash';
import React, { FC, ReactElement, useState } from 'react';
import { useEffect } from 'react';
import { Table } from 'reactstrap';

import { ProductTableItem } from './ProductTableItem';

type Props = {
  products?: Product[];
  toggleOffer?: () => void;
  toggleEditProduct?: () => void;
  handleSelectedProduct?: (product: Product) => void;
};

export const ProductTable: FC<Props> = ({
  products,
  toggleOffer,
  toggleEditProduct,
  handleSelectedProduct,
}): ReactElement => {
  const [productState, setProductState] = useState<Product[] | undefined>(undefined);

  useEffect(() => {
    setProductState(products);
  }, [products]);

  const _sortByColumn = (column: string) => {
    const sortedProducts: Product[] = _.sortBy(productState, [column]);
    setProductState(sortedProducts);
  };

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th></th>
          <th
            onClick={() => {
              _sortByColumn('name');
            }}
          >
            Product name
          </th>
          <th
            onClick={() => {
              _sortByColumn('category.name');
            }}
          >
            Category
          </th>
          <th
            onClick={() => {
              _sortByColumn('category.subcategories');
            }}
          >
            Sub Category
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
              _sortByColumn('quantity');
            }}
          >
            In stock
          </th>
          <th
            onClick={() => {
              _sortByColumn('status');
            }}
          >
            Status
          </th>
          <th
            onClick={() => {
              _sortByColumn('name');
            }}
          >
            Product Offer
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {productState?.map((product: Product) => (
          <ProductTableItem
            key={product._id}
            product={product}
            hasOffer={false}
            toggleEditProduct={toggleEditProduct}
            toggleOffer={toggleOffer}
            handleSelectedProduct={handleSelectedProduct}
          />
        ))}
      </tbody>
    </Table>
  );
};
