import { FunctionComponent } from 'react';

type Props = {
  condition: boolean;
  children: any;
};

const RenderIf: FunctionComponent<Props> = ({ condition, children }) => condition && children;

export default RenderIf;
