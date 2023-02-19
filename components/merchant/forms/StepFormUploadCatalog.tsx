import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { InputType } from 'reactstrap/es/Input';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { AppState } from '../../../redux/reducers';

interface Props {
  _handleSteps: (event: any, currentStep: any, stepField: any) => void;
  csvHeaders: any[];
  step: any;
  stepName: string;
  inputType?: InputType;
}

const StepFormUploadCatalog: FC<Props> = ({
  _handleSteps,
  csvHeaders,
  step,
  stepName,
  inputType = 'radio',
}) => {
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        _handleSteps(event, step, stepName);
      }}
    >
      <fieldset>
        <legend>CSV columns</legend>
        <Container className='d-flex flex-wrap mt-2 mb-3'>
          {csvHeaders
            ? csvHeaders.map((element, index) => (
                <FormGroup check key={index.toString()} className='mr-4'>
                  <Label htmlFor={index.toString()}>
                    <Input
                      name='csv_column'
                      type={inputType}
                      id={index.toString()}
                      value={element}
                      required
                    />
                    {element}
                  </Label>
                </FormGroup>
              ))
            : null}
        </Container>
      </fieldset>
      <Button type='submit'>Next</Button>
    </Form>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StepFormUploadCatalog);
