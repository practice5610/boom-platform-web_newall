import { Category } from '@boom-platform/globals';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { FC, useContext, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
} from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import useSearchControls, { SearchControlActions } from '../hooks/useSearchControls';
import actionCreators from '../redux/actions';
import { setGeolocation } from '../redux/actions/app';
import { setCategories } from '../redux/actions/search';
import { AppState } from '../redux/reducers';
import GridMasonry from './GridMasonry';
import { ProductSearchControlsCtx, SearchFilterQualifier, SearchMatchRestriction } from './search';

interface Props {
  categories?: Category[]; // This value comes from Mongo - better than calling from elasticsearch which can be done too but is less optimal
  searchCategory?: string;
  searchQuery?: string;
}

const InputProductsSearch: FC<Props> = ({ categories, searchCategory, searchQuery }: Props) => {
  const [splitButtonOpen, setSplitButtonOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  const searchControl = useContext(ProductSearchControlsCtx);
  const router = useRouter();
  const control = useSearchControls();
  useEffect(() => {
    setInputValue(searchQuery || '');
  }, [searchQuery]);
  useEffect(() => {
    if (inputValue && !router.query.n) {
      setInputValue('');
    } else if (!inputValue && router.query.n && typeof router.query.n === 'string') {
      setInputValue(router.query.n);
    }
  }, [router.query.n]);
  // useEffect(() => {
  //   if (!searchControl?.search.query.subCategoryName) {

  //   }
  // }, [searchControl?.search.query.categoryName, searchControl?.search.query.subCategoryName]);
  const _onSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    // searchControl?.addRule(
    //   'name',
    //   `*${inputValue}*`,
    //   SearchMatchRestriction.Should,
    //   SearchFilterQualifier.Wildcard
    // );
    // searchControl?.addRule(
    //   'description',
    //   `*${inputValue}*`,
    //   SearchMatchRestriction.Should,
    //   SearchFilterQualifier.Wildcard
    // );
    control.dispatch(SearchControlActions.changeText(inputValue));
  };

  const _onKeywordChange = (e) => {
    setInputValue(e.currentTarget.value);
    // TODO: Fire search by Pressing Enter here
  };

  const _onResetBtnClick = (e) => {
    e.preventDefault();
    setInputValue('');

    searchControl?.addRule('name', '', SearchMatchRestriction.None, SearchFilterQualifier.None);
    searchControl?.addRule(
      'description',
      '',
      SearchMatchRestriction.None,
      SearchFilterQualifier.None
    );
    searchControl?.addRule(
      'categoryName',
      null,
      SearchMatchRestriction.None,
      SearchFilterQualifier.None
    );
    searchControl?.addRule(
      'subCategoryName',
      null,
      SearchMatchRestriction.None,
      SearchFilterQualifier.None
    );
  };
  return (
    <form onSubmit={_onSubmit} style={{ flexGrow: 1 }}>
      <div className='InputOffersSearch d-flex justify-content-center'>
        <InputGroup>
          <InputGroupButtonDropdown
            addonType='prepend'
            isOpen={splitButtonOpen}
            toggle={() => setSplitButtonOpen(!splitButtonOpen)}
          >
            <DropdownToggle className='searchDropDown' split>
              <span className='pr-2'>
                {(searchControl?.search.query.subCategoryName ??
                  searchControl?.search.query.categoryName) ||
                  'All'}
              </span>
            </DropdownToggle>
            <DropdownMenu>
              <div>
                <GridMasonry columns={3} gapVertical={50} gapHorizontal={10}>
                  {categories?.map((category) => (
                    <div key={category._id}>
                      <DropdownItem header>{category.name}</DropdownItem>
                      {category.subCategories?.map((subCategoryName) => (
                        <DropdownItem key={subCategoryName}>
                          <div
                            style={{ color: 'red' }}
                            onClick={() => {
                              control.dispatch(
                                SearchControlActions.changeCategory(category.name, subCategoryName)
                              );
                              // searchControl?.addRule(
                              //   'subCategoryName',
                              //   subCategoryName,
                              //   SearchMatchRestriction.Must,
                              //   SearchFilterQualifier.Exact
                              // );
                              // searchControl?.addRule(
                              //   'categoryName',
                              //   category?.name,
                              //   SearchMatchRestriction.Must,
                              //   SearchFilterQualifier.Exact
                              // );
                              // router.push('/search');
                            }}
                          >
                            {subCategoryName}
                          </div>
                        </DropdownItem>
                      ))}
                    </div>
                  ))}
                </GridMasonry>
              </div>
            </DropdownMenu>
          </InputGroupButtonDropdown>

          <Input
            type='search'
            placeholder='Search Offers'
            value={inputValue}
            onChange={(e) => _onKeywordChange(e)}
          />

          {inputValue !== '' ? (
            <Button onClick={(e) => _onResetBtnClick(e)} className='reset-btn'>
              <i className='fa fa-times' aria-hidden='true'></i>
            </Button>
          ) : null}

          <InputGroupAddon addonType='append'>
            <Button type='submit' className='searchIcon' disabled={inputValue === ''}>
              <i className='fa fa-search fa-custom' aria-hidden='true'></i>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </form>
  );
};
const mapStateToProps = (state: AppState) => ({
  categories: state.publicData.categories,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InputProductsSearch);
