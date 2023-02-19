import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';

import InputCheckBox from './InputCheckbox';

const ModalVerifyCode = () => {
  return (
    <div className='Modal container'>
      {' '}
      <Form>
        <div className='form-header'>
          <span>VERIFY CODE</span>{' '}
        </div>
        <div className='form-verify-code'>
          <div className='code-sent-text d-flex align-items-center'>
            <h3>
              The code has been sent to your{' '}
              <strong>
                Phone number ending
                <br />
                in 3958.
              </strong>
            </h3>
          </div>

          <FormGroup className='input-vc-enter' row>
            <Col className='input-col-vc-enter' sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Enter 4-digit code' />
            </Col>
          </FormGroup>
          <div className='modal-vc-check-form'>
            <div className='modal-vc-text'>
              <h3>Did not receive your code? Get a new one.</h3>
            </div>
            <FormGroup className='modal-vc-check-text' row>
              <Label for='checkbox2' xs={6}>
                Save Computer?
              </Label>
              <Col xs={6}>
                <FormGroup row>
                  <Col xs={6}>
                    <Label check className='d-flex'>
                      Yes
                      <InputCheckBox id='input-yes' />
                    </Label>
                  </Col>
                  <Col xs={6}>
                    <Label check className='d-flex'>
                      No
                      <InputCheckBox id='input-no' />
                    </Label>
                  </Col>
                </FormGroup>
              </Col>
            </FormGroup>
            <div className='no-save-text'>
              <h3>
                We can remember this computer so that you can avoid
                <br />
                having to enter these codes in the future.{' '}
                <strong>
                  Do no save
                  <br />
                  this computer if it does not belong to you.
                </strong>
              </h3>
            </div>
            <div className='vc-buttons'>
              <FormGroup check row>
                <Col className='verify-code-btn'>
                  <Button>Verify Code</Button>
                </Col>
              </FormGroup>
              <FormGroup check row>
                <Col className='cancel-btn'>
                  <Button>Cancel</Button>
                </Col>
              </FormGroup>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ModalVerifyCode;
