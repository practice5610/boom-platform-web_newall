import { NextPageContext } from 'next';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => {
  const [personalInfoOpen, setPersonalInfoOpen] = useState<boolean>(false);
  const personalInfoToggle = () => setPersonalInfoOpen((personalInfoOpen) => !personalInfoOpen);
  const personalInfoNext = () => {
    setPersonalInfoOpen(personalInfoOpen === false);
    educationInfoToggle();
  };
  const [educationInfoOpen, setEducationInfoOpen] = useState<boolean>(false);
  const educationInfoToggle = () => setEducationInfoOpen((educationInfoOpen) => !educationInfoOpen);
  const educationInfoNext = () => {
    setEducationInfoOpen(educationInfoOpen === false);
    employmentInfoToggle();
  };
  const addEducation = () => {
    /**
     * TODO: Program button to add fields for another school
     */
  };
  const [employmentInfoOpen, setEmplpymentInfoOpen] = useState<boolean>(false);
  const employmentInfoToggle = () =>
    setEmplpymentInfoOpen((employmentInfoOpen) => !employmentInfoOpen);
  const employmentInfoNext = () => {
    setEmplpymentInfoOpen(employmentInfoOpen === false);
    resumeUploadToggle();
  };
  const addEmployment = () => {
    /**
     * TODO: Program button to add fields for another employment
     */
  };
  const [resumeUploadOpen, setResumeUploadOpen] = useState<boolean>(false);
  const [data, setResume] = useState({ file: '' });
  const resumeUploadToggle = () => setResumeUploadOpen((resumeUploadOpen) => !resumeUploadOpen);
  const resumeUploadNext = () => {
    setResumeUploadOpen(resumeUploadOpen === false);
    referencesToggle();
  };
  const fileUpload = (file, type) => {
    if (type === 'resume') {
      setResume({ file });
    }
  };
  const [referencesOpen, setReferencesOpen] = useState<boolean>(false);
  const referencesToggle = () => setReferencesOpen((referencesOpen) => !referencesOpen);
  const referencesNext = () => {
    setReferencesOpen(referencesOpen === false);
    reviewToggle();
  };
  const addReference = () => {
    /**
     * TODO: Program button to add fields for another reference
     */
  };
  const [reviewOpen, setReviewOpen] = useState<boolean>(false);
  const reviewToggle = () => setReviewOpen((reviewOpen) => !reviewOpen);
  const submit = () => {
    /**
     * TODO: Set up confirmation screen that application has been submitted
     */
  };

  return (
    <div className='Employment container'>
      <img className='banner-image' src='/images/banner-5.png' alt='banner'></img>
      <div className='employment'>
        <h1>Employment</h1>
        <Button className='title' onClick={personalInfoToggle}>
          Personal Information
        </Button>
        <Collapse isOpen={personalInfoOpen}>
          <Card>
            <CardBody>
              <Form>
                <Row from>
                  <Col md={4}>
                    <FormGroup>
                      <Label for='firstName'>First Name</Label>
                      <Input type='text' name='firstName' id='firstName' />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for='middleName'>Middle Name</Label>
                      <Input type='text' name='middleName' id='middleName' />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for='lastName'>Last Name</Label>
                      <Input type='text' name='lastName' id='lastName' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='phoneNumber'>Phone Number</Label>
                      <Input type='tel' name='phoneNumber' id='phoneNumber' />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='email'>Email Address</Label>
                      <Input type='email' name='email' id='email' />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for='appPosition'>Position Applying For</Label>
                  <Input type='select' name='appPosition' id='appPosition'>
                    <option>Position 1</option>
                    <option>Position 2</option>
                    <option>Position 3</option>
                  </Input>
                </FormGroup>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='street1'>Address 1</Label>
                      <Input type='text' name='street1' id='street1' />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='street2'>Address 2</Label>
                      <Input type='text' name='street2' id='street2' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={5}>
                    <FormGroup>
                      <Label for='city'>City</Label>
                      <Input type='text' name='city' id='city' />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    {/**
                     * Change to select
                     */}
                    <FormGroup>
                      <Label for='state'>State</Label>
                      <Input type='text' name='state' id='state' />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for='zip'>Zip</Label>
                      <Input type='text' name='zip' id='zip' />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    {/**
                     * Change to select
                     */}
                    <FormGroup>
                      <Label for='country'>Country</Label>
                      <Input type='text' name='country' id='country' />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for='ssn'>Social Secutiry Number</Label>
                  <Input type='password' name='ssn' id='ssn' />
                </FormGroup>
                <FormGroup>
                  <Label for='maritalStatus'>Marital Status</Label>
                  <Input type='select' name='maritalStatus' id='maritalStatus'>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Separated</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for='crimeStatus'>Have you ever been convicted of a crime?</Label>
                  <Input type='select' name='crimeStatus' id='crimeStatus'>
                    <option>Yes</option>
                    <option>No</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for='crimeExplanation'>
                    If you answered yes to the question above, please explain.
                  </Label>
                  <Input type='textarea' name='crimeExplanation' id='crimeExplanation' />
                </FormGroup>
                <Button className='next' onClick={personalInfoNext}>
                  Next
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Collapse>
        <Button className='title' onClick={educationInfoToggle}>
          Education
        </Button>
        <Collapse isOpen={educationInfoOpen}>
          <Card>
            <CardBody>
              <Form>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='school'>School</Label>
                      <Input type='text' name='school' id='school' />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for='graduated'>Graduated?</Label>
                      <Input type='select' name='graduated' id='graduated'>
                        <option>Yes</option>
                        <option>No</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for='graduationDate'>Graduation Date</Label>
                      <Input type='date' name='graduationDate' id='graduationDate' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='degree'>Degree</Label>
                      <Input type='select' name='degree' id='degree'>
                        <option>GED</option>
                        <option>Diploma</option>
                        <option>Associate Degree</option>
                        <option>Bachelor Degree</option>
                        <option>Master Degree</option>
                        <option>Doctorate</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for='gpa'>GPA</Label>
                      <Input type='text' name='gpa' id='gpa' />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for='add' className='addLabel'>
                    Add Education
                  </Label>
                  <Button outline size='sm' className='addBtn' onClick={addEducation}>
                    +
                  </Button>
                </FormGroup>
                <Button className='next' onClick={educationInfoNext}>
                  Next
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Collapse>
        <Button className='title' onClick={employmentInfoToggle}>
          Employment History
        </Button>
        <Collapse isOpen={employmentInfoOpen}>
          <Card>
            <CardBody>
              <Form>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='position'>Job Title</Label>
                      <Input type='text' name='position' id='position' />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='company'>Company</Label>
                      <Input type='text' name='company' id='company' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={12}>
                    <FormGroup>
                      <FormGroup check>
                        <Label check>
                          {/**
                           * TODO: Program to disable end date if current employer box is checked
                           */}
                          <Input type='checkbox' name='current' /> I currently work here
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='startDate'>State Date</Label>
                      <Input type='date' name='startDate' id='stateDate' />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='endDate'>End Date</Label>
                      <Input type='date' name='endDate' id='endDate' />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for='description'>Job Description</Label>
                  <Input type='textarea' name='description' id='description' />
                </FormGroup>
                <FormGroup>
                  <Label for='add' className='addLabel'>
                    Add Employment History
                  </Label>
                  <Button outline size='sm' className='addBtn' onClick={addEmployment}>
                    +
                  </Button>
                </FormGroup>
                <Button className='next' onClick={employmentInfoNext}>
                  Next
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Collapse>
        <Button className='title' onClick={resumeUploadToggle}>
          Resume Upload
        </Button>
        <Collapse isOpen={resumeUploadOpen}>
          <Card>
            <CardBody>
              <FormGroup>
                <Label for='resumeUpload'>Upload Resume</Label>
                {/**
                 * TODO: Specify file types that can be uploaded
                 */}
                <Input
                  type='file'
                  name='resumeFile'
                  id='resume'
                  className='uploadBtn'
                  onChange={(evt) => fileUpload(evt, 'resume')}
                />
              </FormGroup>
              <Button className='next' onClick={resumeUploadNext}>
                Next
              </Button>
            </CardBody>
          </Card>
        </Collapse>
        <Button className='title' onClick={referencesToggle}>
          References
        </Button>
        <Collapse isOpen={referencesOpen}>
          <Card>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for='refName'>Name</Label>
                  <Input type='text' name='refName' id='refName' />
                </FormGroup>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='refJob'>Position/Title</Label>
                      <Input type='text' name='refJob' id='refJob' />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='refCompany'>Company</Label>
                      <Input type='text' name='refCompany' id='refCompany' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='refPhone'>Phone Number</Label>
                      <Input type='tel' name='refPhone' id='refPhone' />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='refEmail'>Email Address</Label>
                      <Input type='email' name='refEmail' id='refEmail' />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for='refDescription'>Reference Description</Label>
                  <Input type='textarea' name='refDescription' id='refDescription' />
                </FormGroup>
                <FormGroup>
                  <Label for='add' className='addLabel'>
                    Add Reference
                  </Label>
                  <Button outline size='sm' className='addBtn' onClick={addReference}>
                    +
                  </Button>
                </FormGroup>
                <Button className='next' onClick={referencesNext}>
                  Next
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Collapse>
        <Button className='title' onClick={reviewToggle}>
          Review and Submit
        </Button>
        <Collapse isOpen={reviewOpen}>
          <Card>
            <CardBody>
              <h5>Review Application Details</h5>
              <p className='text-section'>
                Review details provided and confirm that everything is correct. If anything is
                incorrect, please go back and make changes at this time.
              </p>
              {/**
               * TODO: Display input data from applicant here
               */}
              <h5>Application Form Waiver</h5>
              <p className='text-section'>
                In exchange for the consideration of my job application by Moob Rewards LLC (herein
                after called "the Company), I agree that:
                <br />
                <br />
                Neither the acceptance of this application nor the subsequent entry into any type of
                employment relationship either in the position applied for or any other position,
                and regardless of the contents of employee handbooks, personnel manuals, benefit
                plans, policy statements, and the like as they may exist from time to time, or other
                Company practices. shall serve to create an actual or implied contract of
                employment, or to confer any right to remain an employee of Moob Rewards LLC , or
                otherwise to change in any respect the employment-at-will relationship between it
                and the undersigned, and that relationship cannot be altered except by a written
                instrument signed by the President /General Manager of the Company. Both the
                undersigned and Moob Rewards LLC may end the employment relationship at any time
                without specified notice or reason. If employed. I understand that the Company may
                unilaterally change or revise their benefits, policies and procedures and such
                changes may include reduction benefits.
                <br />
                <br />I authorize investigation of all statements contained in this application. I
                understand that the misrepresentation or omission of facts called for is cause for
                dismissal at any time without any previous notice. I hereby give the Company
                permission to contact schools, previous employers (unless otherwise indicated),
                references, and others, and hereby release the Company from any liability as a
                result of such contract.
                <br />
                <br />I also understand that the Company has a drug and alcohol policy that provides
                for pre-employment testing as well as testing after employment; (2) consent to and
                compliance with such policy is a condition of my employment; and (3) continued
                employment is based on the successful passing of testing under such policy_ I
                further understand that continued employment: may be based on the successful passing
                of job-related physical examinations.
                <br />
                <br />I understand that, in connection with the routine processing of your
                employment application, the Company may request from a consumer reporting agency an
                investigative consumer report including information as to my credit records,
                character, general reputation, personal characteristics, and mode of living. Upon
                written request from me, the Company, will provide me with additional information
                concerning the nature and scope of any such report requested by it, as required by
                the Fair Credit Reporting Act.
                <br />
                <br />I further understand that my employment with the Company shall be probationary
                for a period of sixty (60) days. and further that at any time during the
                probationary period or thereafter, my employment relation with the Company is
                terminable at will for any reason by either party.
              </p>
              <FormGroup className='accept'>
                <FormGroup check>
                  <Label check>
                    {/**
                     * TODO: Program to disable submit if box is not checked
                     */}
                    <Input type='checkbox' name='accept' /> I accept these terms and conditions
                  </Label>
                </FormGroup>
              </FormGroup>
              <Label for='signature'>
                <strong>Applicant Signature</strong>
              </Label>
              <p>
                * Please type your full name in the space below to be used as an electronic
                signature.
              </p>
              <Row form className='sig'>
                <Col md={6}>
                  <Input
                    type='text'
                    name='signature'
                    id='signature'
                    placeholder='First and Last Name'
                  />
                </Col>
                <Col md={6}>
                  <Input type='date' />
                </Col>
              </Row>
              {/**
               * TODO: Program to disable submit if applicant has not signed electronically
               */}
              <Button className='next' onClick={submit}>
                Submit
              </Button>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    </div>
  );
};

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'Employment',
    },
  };
};

export default Page;
