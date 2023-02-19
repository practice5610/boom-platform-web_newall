import _ from 'lodash';
import React, { FunctionComponent } from 'react';

interface Props {
  tag: string;
  content: string;
  className?: string;
}

const HTMLContent: FunctionComponent<Props> = ({ tag, content, className }) => {
  if (tag === 'p') {
    //Can't allow p tag because we can't nest p tags from content.
    throw new Error("Can't use p tag as a HTMLContent tag");
  }
  //@ts-ignore
  return React.createElement(
    tag,
    {
      className,
      dangerouslySetInnerHTML: { __html: _.unescape(content) },
    },
    null
  );
};

export default HTMLContent;
