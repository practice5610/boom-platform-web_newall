import { BoomUser, Product, ProductStatus, toMoney } from '@boom-platform/globals';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { readString } from 'react-papaparse';
import { connect } from 'react-redux';
import { Button, Container, Form, Input, InputGroup, Table } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestCreateProducts, requestStore } from '../../../redux/actions/account-merchant';
import { AppState } from '../../../redux/reducers';
import StepFormUploadCatalog from './StepFormUploadCatalog';

interface Props {
  requestStore?: typeof requestStore;
  requestCreateProducts?: typeof requestCreateProducts;
  user?: BoomUser;
}

const FormUploadCatalog: FC<Props> = ({ requestStore, requestCreateProducts, user }) => {
  const [csvOriginalHeaders, setOriginalCsvHeaders] = useState<any>(null);
  const [csvHeaders, setCsvHeaders] = useState<any>(null);
  const [allProductsUploaded, setAllProductsUploaded] = useState<any>(null);
  const [csvBody, setCsvBody] = useState<any[]>([]);
  const [csvMap, setCsvMap] = useState<object[]>([]);
  const [step, setStep] = useState<number>(1);
  const [invalidRow, setInvalidRow] = useState<Array<any>>([]);

  const BoomProductSchema = [
    'name',
    'description',
    'category',
    'subCategories',
    'price',
    'quantity',
    '_tags',
    'imageUrl',
    'attributes',
  ];

  const router = useRouter();

  useEffect(() => {
    if (user) {
      requestStore?.();
    }
  }, [user]);

  const _handleSubmit = (event) => {
    const reader = new FileReader();
    const file = event.target[0].files[0];

    if (file) {
      reader.onload = function () {
        const text: any = reader.result;
        const headerCsvReader: any = readString(text, {
          header: true,
          worker: true,
          complete: (results) => {
            console.log(results);
          },
        });

        setOriginalCsvHeaders(headerCsvReader.data[0]);

        const resultCsvReader: any = readString(text, {
          header: true,
          worker: true,
          complete: (results) => {
            console.log(results);
          },
        });
        const csv_table: [string[]] = resultCsvReader.data;
        const headers: string[] | any = csv_table.shift();

        setCsvHeaders(headers);
        setCsvBody(csv_table);

        //@@ CSV file must have at least 4 required column and 1 row of data.
        if (csv_table && headers && csv_table.length > 0 && headers.length > 4) setStep(2);
        else alert('Invalid file, please make sure you are using correct data file');
      };

      reader.readAsBinaryString(file);
    } else {
      alert('Please select a file');
    }
  };

  function _handleSteps(event, currentStep, stepField) {
    const dataSelected: any = new FormData(event.target);
    let nextCsvMap: object[] = [];

    for (const entry of dataSelected) {
      nextCsvMap = [
        ...csvMap,
        { [stepField]: entry[1], position: csvOriginalHeaders.indexOf(entry[1]) },
      ];
      setCsvMap(nextCsvMap);
      csvHeaders.splice(csvHeaders.indexOf(entry[1]), 1);
    }
    setStep(currentStep + 1);
  }

  function _handleLastStep(event, currentStep, stepField) {
    const formData: any = new FormData(event.target);
    let attributesSelected: object[] = [];

    for (const entry of formData.entries()) {
      attributesSelected = [
        ...attributesSelected,

        [entry[1], csvOriginalHeaders.indexOf(entry[1])],
      ];

      csvHeaders.splice(csvHeaders.indexOf(entry[1]), 1);
    }

    const nextCsvMap = [...csvMap, { [stepField]: attributesSelected }];
    setCsvMap(nextCsvMap);
    _uploadData(nextCsvMap);
  }

  function _addInvalidRow(element: object | []) {
    const previousInvalidElements = invalidRow;
    previousInvalidElements.push(element);
    setInvalidRow(previousInvalidElements);
  }

  const _uploadData = (mapper) => {
    const headerCSV = csvOriginalHeaders;

    try {
      const allProducts: Product[] = [];

      csvBody.forEach((row, index) => {
        const data = row;

        if (data.length != headerCSV.length) {
          _addInvalidRow(data);
          // console.log('Csv Line ', ++index, ' invalid number of column');
          return;
        }

        const tempPrice = data[mapper[4].position].trim();

        try {
          const transformPrice = Number(tempPrice);
          if (!(transformPrice > 0) || isNaN(transformPrice)) {
            _addInvalidRow(data);
            // console.log('Csv Line ', ++index, ' invalid or missing price');
            return;
          }
        } catch (error) {
          _addInvalidRow(data);
          // console.log('Csv Line ', ++index, ' invalid or missing price');
          return;
        }

        let attributes: object = {};

        mapper[8].attributes.forEach((element) => {
          const key = element[0].trim();

          const value = data[element[1]].trim();

          attributes = { ...attributes, [key]: value };
        });

        const origProd: Product = {
          merchantUID: user?.uid,
          store: user?.store,
          name: data[mapper[0].position].trim(),
          description: data[mapper[1].position].trim(),
          price: toMoney(tempPrice),
          quantity: data[mapper[5].position].trim(),
          _tags: data[mapper[6].position].split(','),
          imageUrl: data[mapper[7].position].trim(),
          attributes: attributes,
          category: {
            name: data[mapper[2].position].trim(),
            subCategories: [data[mapper[3].position]],
          },
          status: ProductStatus.PENDING,
          shippingPolicy: '',
          returnPolicy: '',
        };

        if (!origProd['name']) {
          _addInvalidRow(origProd);
          // console.log('Csv Line ', ++index, ' invalid - Missing name');
          return;
        }

        if (!origProd['description']) {
          _addInvalidRow(origProd);
          // console.log('Csv Line ', ++index, ' invalid - Missing description');
          return;
        }

        if (!origProd['price']) {
          _addInvalidRow(origProd);
          // console.log('Csv Line ', ++index, ' invalid - Missing price');
          return;
        }

        if (!origProd['quantity']) {
          _addInvalidRow(origProd);
          // console.log('Csv Line ', ++index, ' invalid - Missing quantity');
          return;
        }

        if (!origProd['category']) {
          _addInvalidRow(origProd);
          // console.log('Csv Line ', ++index, ' invalid - Missing category');
          return;
        }

        allProducts.push(origProd);
      });

      setAllProductsUploaded(allProducts);

      // console.log(
      //     '-----------------------------------INVALID ROWS IN CSV----------------------------------------'
      // );

      // console.log(invalidRow);

      // console.log(
      //     '-----------------------------------JSON READY TO POST-----------------------------------------'
      // );

      // console.log(JSON.stringify(allProducts));

      requestCreateProducts?.(allProducts);

      // const result = await post('/products', allProducts, { timeout: 60000 }, jwt);
      // console.log(result);

      setStep(11);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className='mb-5'>
      {step > 1 ? (
        <Container>
          <Table>
            <thead>
              <tr>
                <th>Moob schema</th>

                {BoomProductSchema
                  ? BoomProductSchema.map((e, i) => {
                      return <th key={i}>{e}</th>;
                    })
                  : null}
              </tr>
            </thead>

            <tbody>
              <tr>
                <th>Your schema</th>

                {csvMap
                  ? csvMap.map((e, i) => {
                      const values = Object.values(e);

                      if (values.length === 1) {
                        const attributes: any = [];

                        values[0].forEach((element) => {
                          attributes.push(element[0]);
                        });

                        return <td key={i}>{attributes.toString()}</td>;
                      }

                      if (values.length === 2) {
                        return <td key={i}>{values[0].toString()}</td>;
                      }
                    })
                  : null}
              </tr>
            </tbody>
          </Table>
        </Container>
      ) : null}

      {step === 1 ? (
        <Container>
          <h4>Complete our 8 steps form to Bulk Upload</h4>
          <h5>Step 1 - Select your CSV file</h5>

          <Form
            form
            onSubmit={(event) => {
              event.preventDefault();

              _handleSubmit(event);
            }}
          >
            <InputGroup>
              <Input type='file' accept='.txt,.csv' required />
              <Button type='submit'>Upload</Button>
            </InputGroup>
          </Form>
        </Container>
      ) : null}

      {step === 2 ? (
        <Container>
          <h4>Step 2</h4>
          <h5>
            <strong>Product Name</strong> -- Which of the following columns corresponds to Product
            Name?
          </h5>
          <StepFormUploadCatalog
            _handleSteps={_handleSteps}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'name'}
          />
        </Container>
      ) : null}

      {step === 3 ? (
        <Container>
          <h4>Step 3</h4>
          <h5>
            <strong>Product Description</strong> -- Which of the following columns corresponds to
            Product Description?
          </h5>
          <StepFormUploadCatalog
            _handleSteps={_handleSteps}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'description'}
          />
        </Container>
      ) : null}

      {step === 4 ? (
        <Container>
          <h4>Step 4</h4>
          <h5>
            <strong>Product Category</strong> -- Which of the following columns corresponds to
            Product Category?
          </h5>
          <br />
          <StepFormUploadCatalog
            _handleSteps={_handleSteps}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'category'}
          />
        </Container>
      ) : null}

      {step === 5 ? (
        <Container>
          <h4>Step 5</h4>
          <h5>
            <strong>Product Sub-Category</strong> -- Which of the following columns corresponds to
            Product Sub-Category?
          </h5>
          <StepFormUploadCatalog
            _handleSteps={_handleSteps}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'subCategories'}
          />
        </Container>
      ) : null}

      {step === 6 ? (
        <Container>
          <h4>Step 6</h4>
          <h5>
            <strong>Product Price</strong> -- Which of the following columns corresponds to Product
            Price?
          </h5>
          <StepFormUploadCatalog
            _handleSteps={_handleSteps}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'price'}
          />
        </Container>
      ) : null}

      {step === 7 ? (
        <Container>
          <h4>Step 7</h4>
          <h5>
            <strong>Product Quantity Available</strong> -- Which of the following columns
            corresponds to Product Quantity?
          </h5>
          <StepFormUploadCatalog
            _handleSteps={_handleSteps}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'quantity'}
          />
        </Container>
      ) : null}

      {step === 8 ? (
        <Container>
          <h4>Step 8</h4>
          <h5>
            <strong>Product Tags</strong> -- Which of the following columns corresponds to Product
            Tags?
          </h5>
          <StepFormUploadCatalog
            _handleSteps={_handleSteps}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'_tags'}
          />
        </Container>
      ) : null}

      {step === 9 ? (
        <Container>
          <h4>Step 9</h4>
          <h5>
            <strong>Product imageUrl</strong> -- Which of the following columns corresponds to
            Product imageUrl?
          </h5>
          <StepFormUploadCatalog
            _handleSteps={_handleSteps}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'imageUrl'}
          />
        </Container>
      ) : null}

      {step === 10 ? (
        <Container>
          <h4>Step 10</h4>
          <h5>
            <strong>Product Attributes</strong> -- Which of the following columns corresponds to
            Product Attributes?
          </h5>
          <StepFormUploadCatalog
            _handleSteps={_handleLastStep}
            csvHeaders={csvHeaders}
            step={step}
            stepName={'attributes'}
            inputType={'checkbox'}
          />
        </Container>
      ) : null}

      {step === 11 ? (
        <Container>
          <h4>
            <strong>Congrats!</strong>
          </h4>
          <p>
            You have been uploaded {allProductsUploaded.length} products, but also{' '}
            {invalidRow.length} fail or are invalid
          </p>

          <Button onClick={() => router.reload()}>Upload other file</Button>
        </Container>
      ) : null}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormUploadCatalog);
