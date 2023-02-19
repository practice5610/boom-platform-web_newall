import { Button, Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap';

const ModalConfirmation = () => {
  return (
    <div className='Modal container d-flex justify-content-center'>
      {' '}
      <Form>
        <div className='form-header-confirmation'>
          <span>CONFIRMATION</span>{' '}
        </div>
        <div className='form-confirmation'>
          <h3>
            Enter your password to confirm this transaction.
            <br />
            Funds will be transferred to you account instantly
            <br />
            when confirmation has been made.
          </h3>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Password' />
            </Col>
          </FormGroup>
          <FormGroup check row>
            <Col>
              <Button>Confirm</Button>
            </Col>
          </FormGroup>
          <FormGroup check row>
            <Col>
              <Button>Cancel</Button>
            </Col>
          </FormGroup>
        </div>
      </Form>
    </div>
  );
};

export default ModalConfirmation;
