import { NextPage } from 'next';

export interface LayoutAccountProps {
  activeTab?: string;
}

export type NextLayoutPage<T = Record<string, unknown>> = NextPage<T> & {
  getLayout?: (page: any, props) => JSX.Element;
};
