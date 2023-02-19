import { Product } from '@boom-platform/globals';
import React, { FC, ReactElement, useState } from 'react';
import { useEffect } from 'react';
import { Button, ButtonGroup } from 'reactstrap';

import { InputFilter } from '../InputFilter';
import ModalAddOffer from '../offers/ModalAddOffer';
import Pagination, { PageData } from '../Pagination';
import ModalAddAndEditProduct from './ModalAddAndEditProduct';
import ModalUploadCatalog from './ModalUploadCatalog';
import { ProductTable } from './ProductTable';

type Props = {
  title: string;
  products: { products: Product[]; count: number };
  onPageChanged?: (data: PageData) => void;
  onFilterChanged?: (filter: string) => void;
};

export const FilterableProductsTable: FC<Props> = ({
  title,
  products,
  onPageChanged,
  onFilterChanged,
}): ReactElement => {
  const [modalAddProduct, setModalAddProduct] = useState<boolean>(false);
  const [modalUploadCatalog, setModalUploadCatalog] = useState<boolean>(false);
  const [modalAddOffer, setModalAddOffer] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    onFilterChanged?.('');
  }, [modalAddProduct, modalUploadCatalog, modalAddOffer, editMode]);

  const handleSetModalUploadCatalog = () => {
    setModalUploadCatalog(!modalUploadCatalog);
  };
  const handleSetModal = () => {
    setModalAddProduct(!modalAddProduct);
  };
  const handleEditProductMode = () => {
    setEditMode(!editMode);
    handleSetModal();
  };
  const handleSetOfferModal = () => {
    setModalAddOffer(!modalAddOffer);
  };
  const handleSelectedProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className='filterable-product-table container-fluid border p-5'>
      <div className='filterable-product-table-header'>
        <p className='table-tittle m-3'>{title}</p>
        <Pagination
          totalRecords={products.count}
          pageLimit={10} // This limit is set as 10 item per page until we decide if we need it dynamic
          pageNeighbours={2}
          onPageChanged={onPageChanged}
        />
        <InputFilter onFilterChanged={onFilterChanged} />
        <ButtonGroup className='flex-row m-sm-1'>
          <Button className='m-sm-1' onClick={handleSetModal}>
            add new product
          </Button>
          <Button className='m-sm-1' onClick={handleSetModalUploadCatalog}>
            upload catalog
          </Button>
        </ButtonGroup>
      </div>
      <ModalAddAndEditProduct
        handleModal={handleSetModal}
        visible={modalAddProduct}
        handleEditProductMode={handleEditProductMode}
        editMode={editMode}
        selectedProduct={selectedProduct}
      />
      <ModalUploadCatalog handleModal={handleSetModalUploadCatalog} visible={modalUploadCatalog} />
      <ModalAddOffer
        handleModal={handleSetOfferModal}
        visible={modalAddOffer}
        selectedProduct={selectedProduct}
      />
      <ProductTable
        products={products.products}
        toggleEditProduct={handleEditProductMode}
        toggleOffer={handleSetOfferModal}
        handleSelectedProduct={handleSelectedProduct}
      />
    </div>
  );
};
