import React, { FunctionComponent } from 'react';

interface Props {
  message?: string;
}
const BlankThing: FunctionComponent<Props> = ({ message }) => (
  <div className='blank-content'>
    <h2>{message}</h2>
  </div>
);

export default BlankThing;
