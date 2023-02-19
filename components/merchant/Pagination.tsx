/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactElement, useState } from 'react';
import { useEffect } from 'react';

interface Props {
  totalRecords: number;
  pageLimit: number;
  pageNeighbours: number;
  onPageChanged?: (data: PageData) => void;
}

export interface PageData {
  currentPage: number;
}

const Pagination: FC<Props> = ({
  totalRecords,
  pageLimit,
  pageNeighbours,
  onPageChanged,
}): ReactElement => {
  const LEFT_PAGE = 'LEFT';
  const RIGHT_PAGE = 'RIGHT';

  pageLimit = isNaN(pageLimit) ? 10 : pageLimit;
  totalRecords = isNaN(totalRecords) ? 0 : totalRecords;
  pageNeighbours = isNaN(pageNeighbours) ? 0 : Math.max(0, Math.min(pageNeighbours, 2));
  const totalPages = Math.ceil(totalRecords / pageLimit);

  const [state, setState] = useState({ currentPage: 1 });

  useEffect(() => {
    gotoPage(1);
  }, [totalRecords]);

  const range = (from, to, step = 1) => {
    let i = from;
    const range: (string | number)[] = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  };

  const gotoPage = (page) => {
    const currentPage = Math.max(1, Math.min(page, totalPages));

    const paginationData = {
      currentPage,
    };

    setState({ ...state, currentPage });
    onPageChanged?.(paginationData);
  };

  const handleClick = (page, evt) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt) => {
    evt.preventDefault();
    gotoPage(state.currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (evt) => {
    evt.preventDefault();
    gotoPage(state.currentPage + pageNeighbours * 2 + 1);
  };

  const fetchPageNumbers = () => {
    const currentPage = state.currentPage;
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages: (string | number)[] = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  const { currentPage } = state;
  const pages = fetchPageNumbers();

  return (
    <nav aria-label='Countries Pagination'>
      <ul className='pagination m-3'>
        {pages.map((page, index) => {
          if (page === LEFT_PAGE)
            return (
              <li key={index} className='page-item'>
                <a className='page-link' href='#' aria-label='Previous' onClick={handleMoveLeft}>
                  <span aria-hidden='true'>&laquo;</span>
                  <span className='sr-only'>Previous</span>
                </a>
              </li>
            );

          if (page === RIGHT_PAGE)
            return (
              <li key={index} className='page-item'>
                <a className='page-link' href='#' aria-label='Next' onClick={handleMoveRight}>
                  <span aria-hidden='true'>&raquo;</span>
                  <span className='sr-only'>Next</span>
                </a>
              </li>
            );

          return (
            <li key={index} className={`page-item${currentPage === page ? ' active' : ''}`}>
              <a className='page-link' href='#' onClick={(e) => handleClick(page, e)}>
                {page}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
