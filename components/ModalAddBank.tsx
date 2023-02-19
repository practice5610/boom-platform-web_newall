import { Button, Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap';

const ModalAddBank = () => {
  return (
    <div className='Modal container d-flex justify-content-center'>
      {' '}
      <Form>
        <div className='form-header'>
          <span>ADD BANK</span>{' '}
        </div>
        <div className='form-bank'>
          <h3>
            Enter a bank account to add to your account to
            <br />
            withdrawl funds and make purchases.
          </h3>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Bank Name' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Account Number' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Routing Number' />
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

export default ModalAddBank;
