import { FunctionComponent } from 'react';

import FormSendFunds from './funds/FormSendFunds';

//TODO: Seems that this component is not used
const FundsSend: FunctionComponent<{}> = () => {
  return (
    <div className='container funds'>
      <div className='row'>
        <div className='funds-content m-b-80'>
          <div className='funds-content-left'>
            <div className='funds-select-block'>
              <FormSendFunds />
            </div>
          </div>
          <div className='funds-content-right'>
            <h3 className='funds-content-right-title'>Sending to a friend</h3>
            <p className='funds-content-right-desc'>
              You can send anyone money with a Moob account. All you need to do is enter an email
              address and name. You can even surprise them for that job well done or that movie
              ticket they forgot they bought for you with a simple note. When you send money to
              friends or family in the US from your Moob account or balance, it's free for you and
              the recipient. Funds will not be transferred until the recipient confirms the
              transaction in their email. The transfer will cancel if there is no confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundsSend;
