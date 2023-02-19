import { Button, Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap';

const ModalConfirmIdentity = () => {
  return (
    <div className='Modal container d-flex justify-content-center'>
      {' '}
      <Form>
        <div className='form-header'>
          <span>CONFIRM IDENTITY</span>
        </div>
        <div className='form-modal'>
          <h3>
            For your security, we will send you a <strong>one time passcode</strong>
            <br />
            to enter on the next screen
          </h3>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Send code to:' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input
                type='email'
                name='email'
                id='exampleEmail'
                placeholder='Phone number ending in 1234'
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Send code as:' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='SMS/Text' />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type='email' name='email' id='exampleEmail' placeholder='Call/Voicemail' />
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

export default ModalConfirmIdentity;
