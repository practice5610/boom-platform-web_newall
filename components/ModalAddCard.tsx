import { Button, Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap';

const ModalAddCard = () => {
  return (
    <div className='Modal container d-flex justify-content-center'>
      {' '}
      <Form>
        <div className='form-header'>
          <span>ADD CARD</span>{' '}
        </div>
        <div className='form-modal'>
          <h3>
            Enter a credit/debit card to add to your account to
            <br />
            withdrawl funds and make purchases.
          </h3>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Card Number' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Name on Card' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Card Expiration' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Card CVV Number' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Zip Code' />
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

export default ModalAddCard;
