import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import Map from './Map';

type Props = {
  children: any;
};

class LayoutAccount extends React.Component<Props> {
  render() {
    const { children } = this.props;
    return (
      <div className='merchant-container container'>
        {/* *ngIf="(merchant | async) as merchant" */}
        <div
          style={{
            height: '200px',
            marginBottom: '32px',
          }}
        >
          <Map />
        </div>

        {/* <agm-map *ngIf="lat && lng" [latitude]="lat" [longitude]="lng" [zoom]="14">
  <agm-marker [latitude]="lat" [longitude]="lng"></agm-marker>
</agm - map > */}

        <br />

        <div className='row'>
          <div className='col-2'>
            {/* [src]="merchant.companyLogoUrl" */}
            <img style={{ width: '100%' }} alt='Company' />
            <br />
            {/* *ngIf="merchant.openingTime && merchant.closingTime" [class.green-bg]="isOpenNow(merchant)" */}
            <div className='hours'>
              {/* {{ convertTime(merchant.openingTime) }} - {{ convertTime(merchant.closingTime) }} */}
            </div>
            {/* *ngIf="isFavorite !== undefined" (click)="toggleFavorite()" */}
            <div className='favorite'>
              <i className='fas fa-star' style={{ color: 'yellow' }}></i>
              {/* {{ isFavorite? 'Remove Favorite': 'Save as Favorite' }} */}
            </div>
            {/* *ngIf="router.url.endsWith('/reviews')" [routerLink]="'/merchant/' + merchant.uid" */}
            <a className='go-to-profile'>Go To Store Profile</a>
          </div>

          <div className='col-10'>{children}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAccount);
