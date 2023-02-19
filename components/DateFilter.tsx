import { FC, SyntheticEvent } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from 'reactstrap';

import { PopperPlacement } from '../constants';

interface Props {
  selected: Date;
  popperPlacement?: PopperPlacement;
  onChange: (
    date: Date | [Date, Date] | /* for selectsRange */ null,
    event: SyntheticEvent<any>
  ) => void;
}

const DateFilter: FC<Props> = ({ selected, onChange, popperPlacement }) => {
  return (
    <DatePicker
      className='DateFilter'
      popperPlacement={popperPlacement}
      selected={selected}
      onChange={onChange}
      customInput={
        <Button>
          <i id='calendar' className='fa fa-calendar'></i>
        </Button>
      }
    />
  );
};

export default DateFilter;
