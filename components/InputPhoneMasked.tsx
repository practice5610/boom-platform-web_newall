import { FunctionComponent } from 'react';
import InputMask from 'react-input-mask';
import { Input } from 'reactstrap';

interface Props {
  value: string;
  input: { value: string; onChange: Function };
}

const InputPhoneMasked: FunctionComponent<Props> = ({ value, input }) => {
  return (
    <InputMask
      mask='(999) 999-9999' //TODO: Ticket 746 should refactor this
      value={value}
      onChange={(event) => input.onChange(event.target.value)}
    >
      {(inputProps) => (
        <Input
          {...inputProps}
          name='phone'
          id='phoneNumber-email-pass'
          type='tel'
          className='form-control'
          placeholder='Enter phone number'
          component='input'
        />
      )}
    </InputMask>
  );
};

export default InputPhoneMasked;
