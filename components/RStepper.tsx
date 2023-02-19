import * as React from 'react';
import Stepper from 'react-stepper-horizontal';

type Props = {
  step: number;
};

class RStepper extends React.Component<Props> {
  render() {
    const { step } = this.props;

    return (
      <Stepper
        steps={[
          { title: 'Admin' },
          { title: 'Company' },
          { title: 'Business' },
          { title: 'Taxable States' },
          { title: 'Bank Info' },
          { title: 'Done' },
        ]}
        defaultColor={'#989898'}
        activeColor={'red'}
        completeColor={'#63dbbe'}
        activeStep={step}
        circleTop={10}
        circleFontColor={'white'}
        completeBorderColor={'red'}
        defaultBorderColor={'#989898'}
        defaultBarColor={'#989898'}
        circleFontSize={14}
        titleFontSize={12}
        lineMarginOffset={0}
        size={30}
        defaultTitleColor={'#989898'}
      />
    );
  }
}

export default RStepper;
