import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Label } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import ButtonApp from '../../../components/ButtonApp';
import { getLayout } from '../../../components/LayoutAccount';
import actionCreators from '../../../redux/actions';
import { AppState } from '../../../redux/reducers';
import { NextLayoutPage } from '../../../types';

const Page: NextLayoutPage = () => {
  return (
    <>
      <div className='container'>
        <div className='row'>
          <h2 className='account-title'>Company Info</h2>
        </div>
        {/* *ngIf="user" */}
        <div className='row'>
          {/* // <a [routerLink]="'/merchant/' + user?.uid" target="_blank">View my public profile</a> */}
        </div>

        <br />
        {/* *ngIf="companyForm" */}
        {/* <ng-container > */}
        {/* [formGroup]="companyForm" (ngSubmit)="submitForm()" */}
        <form>
          {/* <!-- Company Name --> */}
          <div className='form-group'>
            <Label>Name</Label>
            <Input className='form-control' />
          </div>
          {/* <!-- Company Type --> */}
          <div className='form-group'>
            <Label>Type</Label>
            <select className='form-control'>
              {/* <option *ngFor="let type of companyTypes" value="{{ type }}">{{ type }}</option> */}
            </select>
          </div>
          {/* <!-- Company Description --> */}
          <div className='form-group'>
            <Label>Description</Label>
            <textarea
              className='form-control'
              placeholder='Enter your description here...'
            ></textarea>
          </div>
          {/* <!-- Company Phone Number --> */}
          <div className='form-group'>
            <Label>Phone Number</Label>
            <Input className='form-control' />
          </div>
          {/* <!-- Company Main Address --> */}
          <div className='form-group'>
            <Label>Main Address</Label>
            <Input className='form-control' />
          </div>
          <hr />
          <strong>Links</strong>
          <br />
          <br />
          {/* <ng-container formGroupName="links"> */}
          {/* *ngFor="let link of links.controls; let i=index;" [formGroupName]="i" */}
          <div>
            <Input placeholder='Website address' />
            <Input placeholder='Title' />
            {/* (click)="removeLink(i)" */}
            <Button type='button' className='btn btn-sm'>
              Remove
            </Button>
          </div>
          <br />
          {/* (click)="addLink()" */}
          <Button type='button' className='btn btn-sm'>
            Add link
          </Button>
          {/* </ng-container> */}
          <hr />
          <strong>Hours of Operation</strong>
          <br />
          <br />
          <div className='day-buttons'>
            {/* [class.active]="days.sun" (click)="days.sun = !days.sun" */}
            <span className='day'>SUN</span>
            {/* [class.active]="days.mon" (click)="days.mon = !days.mon" */}
            <span className='day'>MON</span>
            {/* [class.active]="days.tue" (click)="days.tue = !days.tue" */}
            <span className='day'>TUE</span>
            {/* [class.active]="days.wed" (click)="days.wed = !days.wed" */}
            <span className='day'>WED</span>
            {/* [class.active] = "days.thr"(click) = "days.thr = !days.thr" */}
            <span className='day'> THR</span>
            {/* [class.active] = "days.fri"(click) = "days.fri = !days.fri" */}
            <span className='day'> FRI</span>
            {/* [class.active] = "days.sat"(click) = "days.sat = !days.sat" */}
            <span className='day'> SAT</span>
          </div>
          <br />
          <Input type='time' />
          to
          <Input type='time' />
          <hr />
          <Label>Company Logo</Label>
          <br />
          {/* [src]="user.companyLogoUrl ? user.companyLogoUrl : 'https://via.placeholder.com/150x150?text=Company+Logo'" */}
          <br />
          <br />
          {/* *ngIf="!uploading" #logoUploadInput */}
          {/* (change)="uploadLogo(logoUploadInput.files[0])" */}
          <Input type='file' accept='image/*' />
          {/* *ngIf="uploading" */}
          <span>Uploading, please wait...</span>
          <hr />
          <br />
          <br />
          <div className='row'>
            {/* [loading]="loading" */}
            <ButtonApp>Save Ch23anges</ButtonApp>
          </div>
        </form>
        {/* </ng-container> */}
      </div>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    globalProps: {
      headTitle: 'Company',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
