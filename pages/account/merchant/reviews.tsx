import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../../../components/LayoutAccount';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import { AppState } from '../../../redux/reducers';
import { NextLayoutPage } from '../../../types';

const Page: NextLayoutPage = () => {
  return (
    <>
      <div>
        {/* <div class="review" *ngFor="let review of reviews"> */}
        <div className='review-header'>
          <strong>{/* { review.memberName } */}</strong>
          &nbsp;&nbsp;
          {/* [class.red]="review.rating */}
          <i className='fas fa-star star'>= 1"</i>
          {/* [class.red]="review.rating */}
          <i className='fas fa-star star'>= 2"</i>
          {/* [class.red]="review.rating */}
          <i className='fas fa-star star'>= 3"</i>
          {/* [class.red]="review.rating */}
          <i className='fas fa-star star'>= 4"</i>
          {/* [class.red]="review.rating */}
          <i className='fas fa-star star'>= 5"</i>
        </div>
        <div className='review-content'>{/* { review.content } */}</div>
        <hr />
        {/* </div> */}
      </div>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_REVIEWS,
    },
    globalProps: {
      headTitle: 'Reviews',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
