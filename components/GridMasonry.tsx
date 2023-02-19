import { FunctionComponent } from 'react';

interface Props {
  columns: number;
  gapVertical: number;
  gapHorizontal: number;
  children: any;
}

const GridMasonry: FunctionComponent<Props> = ({
  columns,
  gapVertical,
  gapHorizontal,
  children,
}) => {
  const columnWrapper = {};
  const result: any[] = [];

  // create columns
  for (let i = 0; i < columns; i++) {
    columnWrapper[`column${i}`] = [];
  }
  if (children && children.length) {
    for (let i = 0; i < children.length; i++) {
      const columnIndex = i % columns;
      columnWrapper[`column${columnIndex}`].push(
        <div key={`column-${columnIndex}-${i}`} style={{ marginBottom: `${gapVertical}px` }}>
          {children[i]}
        </div>
      );
    }
  }

  for (let i = 0; i < columns; i++) {
    result.push(
      <div
        key={`column${i}`}
        style={{
          marginLeft: `${i > 0 ? gapHorizontal : 0}px`,
          flex: 1,
        }}
      >
        {columnWrapper[`column${i}`]}
      </div>
    );
  }

  return <div className='d-flex'>{result}</div>;
};
export default GridMasonry;
