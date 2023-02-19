import { NextPageContext } from 'next';
import React from 'react';

import ButtonApp from '../../components/ButtonApp';
import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => (
  <>
    <div className='app-login bg-red'>
      <div className='container center'>
        <div className='row'>
          <div className='login-container'>
            <h1 className='login-title'>Verify Account</h1>
            {/* <ng-container *ngIf="loginForm"> */}
            <div className='login-subtitle'>
              Enter your username and password once more to verify your account.
            </div>
            <br />
            <div className='login-form'>
              {/* [formGroup]="loginForm" (ngSubmit)="submitForm()" */}
              <form>
                <div className='form-group'>
                  <input type='email' className='form-control' placeholder='Enter email' />
                </div>
                <div className='form-group'>
                  <input type='password' className='form-control' placeholder='Enter password' />
                </div>
                {/* [loading]="loading" [disabled]="loginForm.invalid" */}
                <ButtonApp>Verify and Log In</ButtonApp>
              </form>
            </div>
            {/* </ng-container> */}
            <div className='help-text'>
              Any Questions? Call
              <a href='tel:18442780072'>(844) 278-0072</a> to speak to a member of our team
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'Verify',
    },
  };
};

export default Page;
