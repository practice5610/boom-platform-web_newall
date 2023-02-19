import { FunctionComponent, useState } from 'react';
import { Input, Label } from 'reactstrap';
interface Props {
  onChange?: Function;
  id: string;
  checkState?: boolean;
}
const InputCheckBox: FunctionComponent<Props> = ({ onChange, id, checkState }) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className='InputCheckbox'>
      <Input
        id={id}
        type='checkbox'
        className='form-check'
        onChange={() => {
          onChange && onChange(!isChecked);
          setIsChecked(!isChecked);
        }}
        checked={checkState || false}
      />
      <Label htmlFor={id} className='form-check-label'></Label>
    </div>
  );
};

export default InputCheckBox;
