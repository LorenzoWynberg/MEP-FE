import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Button,
  ButtonDropdown,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  CustomInput,
  Collapse
} from 'reactstrap'
import {
  DataListIcon,
  ThumbListIcon,
  ImageListIcon
} from '../svg'
import Breadcrumb from 'Containers/navs/Breadcrumb'
import SearchIcon from '@material-ui/icons/Search'

import { Colxx } from '../common/CustomBootstrap'
import { injectIntl } from 'react-intl'
import IntlMessages from 'Helpers/IntlMessages'

class ListPageHeading extends Component {
  constructor (props) {
    super()
    this.state = {
      dropdownSplitOpen: false,
      displayOptionsIsOpen: false
    }
  }

  toggleDisplayOptions = () => {
    this.setState(prevState => ({
      displayOptionsIsOpen: !prevState.displayOptionsIsOpen
    }))
  }

  toggleSplit = () => {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }))
  }

  render () {
    const { messages } = this.props.intl
    const {
      selectAll,
      actions,
      selectedItemsId,
      handleChangeSelectAll,
      selectedPageSize,
      totalItemCount,
      startIndex,
      displayMode,
      changeDisplayMode,
      endIndex,
      onSearchKey,
      onSearching,
      onSearch,
      toggleModal,
      heading,
      pageSizes,
      changePageSize,
      match,
      selectedOrderOption,
      orderOptions,
      changeOrderBy,
      dataListView,
      listView,
      imageListView,
      isBreadcrumb,
      title,
      layout
    } = this.props

    const { displayOptionsIsOpen, dropdownSplitOpen } = this.state
    return (
      <>
        <Row>
          {
            layout == 'circles'
              ? <>
                <Colxx xxs='5' className='pt-3 pb-3'>
                  <div class='input-group input-group-lg'>
                    <input
                      name='keyword'
                      placeholder='Escriba aquí las palabras claves que desea buscar...'
                      type='text' class='input-main-search form-control'
                      onInput={e => onSearching(e)}
                      autoComplete='off'
                    />
                    <div class='prepend-search input-group-prepend'>
                      <span class='icon-buscador-expediente-before input-group-text'>
                        <SearchIcon />
                      </span>
                    </div>
                    <div class='input-group-append'>
                      <button type='button' class='buscador-table-btn-search btn btn-primary' onClick={onSearch}>Buscar</button>
                    </div>
                  </div>
                </Colxx>
                <Colxx xxs='7' className='pt-3 pb-3 text-right'>
                  {!this.props.readOnly && <Button
                    color='primary'
                    size='lg'
                    className='top-right-button'
                    onClick={() => toggleModal()}
                                           >
                    <IntlMessages id='button.add' />
                                           </Button>}
                  {!this.props.hideMultipleOptions &&
                    <ButtonDropdown
                      isOpen={dropdownSplitOpen}
                      toggle={this.toggleSplit}
                    >
                      <div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
                        {selectAll
                          ? <CustomInput
                              className='custom-checkbox mb-0 d-inline-block'
                              type='checkbox'
                              id='checkAll'
                              onClick={() => handleChangeSelectAll()}
                              checked
                            />
                          : <CustomInput
                              className='custom-checkbox mb-0 d-inline-block'
                              type='checkbox'
                              id='checkAll'
                              onClick={() => handleChangeSelectAll()}
                            />}
                      </div>
                      <DropdownToggle
                        caret
                        color='primary'
                        className='dropdown-toggle-split btn-lg'
                      />
                      <DropdownMenu right>
                        {actions.map((action, index) => {
                          return (
                            <DropdownItem
                              key={index} onClick={() =>
                                action.actionFunction(selectedItemsId)}
                            >
                              <IntlMessages id={action.actionName} />
                            </DropdownItem>
                          )
                        })}
                      </DropdownMenu>
                    </ButtonDropdown>}

                  <span className='text-muted text-small ml-2'>{`${startIndex}-${endIndex} of ${totalItemCount} `}</span>
                  <UncontrolledDropdown className='d-inline-block'>
                    <DropdownToggle caret color='outline-dark' size='xs'>
                      {selectedPageSize}
                    </DropdownToggle>
                    <DropdownMenu right>
                      {pageSizes.map((size, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => changePageSize(size)}
                          >
                            {size}
                          </DropdownItem>
                        )
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>

                </Colxx>
              </>
              : <Colxx xxs='12'>
                <div className='mb-2'>
                  {
                isBreadcrumb &&
                  <Breadcrumb heading={`${heading}`} match={match} />
              }
                  {title
                    ? <div className='text-zero top-left-button-container'>
                      <span>{title}</span>
                    </div>
                    : null}
                  <div className='text-zero top-right-button-container'>
                    {!this.props.readOnly && <Button
                      color='primary'
                      size='lg'
                      className='top-right-button'
                      onClick={() => toggleModal()}
                                             >
                      <IntlMessages id='button.add' />
                    </Button>}
                    {'  '}

                  </div>
                </div>

                <div>
                  <Collapse
                    isOpen={displayOptionsIsOpen}
                    className='d-md-block mt-4'
                    id='displayOptions'
                  >
                    {
                  (dataListView || listView || imageListView) &&
                    <span className='mr-3 mb-2 d-inline-block float-md-left'>
                      {
                      dataListView &&

                        <span
                          className={`mr-2 view-icon ${
                          displayMode === 'list' ? 'active' : ''
                          }`}
                          onClick={() => changeDisplayMode('list')}
                        >
                          <DataListIcon />
                        </span>
                    }
                      {
                      listView &&

                        <span
                          className={`mr-2 view-icon ${
                          displayMode === 'thumblist' ? 'active' : ''
                          }`}
                          onClick={() => changeDisplayMode('thumblist')}
                        >
                          <ThumbListIcon />
                        </span>
                    }
                      {
                      imageListView &&
                        <span
                          href='#'
                          className={`mr-2 view-icon ${
                          displayMode === 'imagelist' ? 'active' : ''
                          }`}
                          onClick={() => changeDisplayMode('imagelist')}
                        >
                          <ImageListIcon />
                        </span>
                    }
                    </span>
                }
                    <div className='d-block d-md-inline-block'>
                      {
                    this.props.orderBy &&
                      <UncontrolledDropdown className='mr-1 float-md-left btn-group mb-1'>
                        <DropdownToggle caret color='outline-dark' size='xs'>
                          <IntlMessages id='label.ordeBy' />
                          {selectedOrderOption && selectedOrderOption.label}
                        </DropdownToggle>
                        <DropdownMenu>
                          {orderOptions().map((order, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => {
                                  changeOrderBy(order)
                                }}
                              >
                                {order.label}
                              </DropdownItem>
                            )
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                  }
                      {
                    this.props.labelSearch
                      ? <h5 className='d-inline-block mr-3' style={{ float: 'left' }}>
                        {this.props.labelSearch}
                      </h5>
                      : null
                  }

                      {
                    !this.props.disableSearch
                      ? <div className={`search-sm${this.props.roundedStyle ? '--rounded' : ''} d-inline-block float-md-left mr-1 mb-1 align-top`}>
                        <input
                          type='text'
                          name='keyword'
                          id='search'
                          placeholder={messages['menu.search']}
                          onInput={e => onSearchKey(e)}
                        />
                        </div>
                      : null
                  }
                    </div>
                  </Collapse>
                </div>
              </Colxx>
          }
        </Row>
      </>
    )
  }
}
ListPageHeading.propTypes = {
  listView: PropTypes.bool,
  dataListView: PropTypes.bool,
  imageListView: PropTypes.bool,
  search: PropTypes.bool,
  orderBy: PropTypes.bool,
  isBreadcrumb: PropTypes.bool,
  title: PropTypes.string
}
ListPageHeading.defaultProps = {
  listView: false,
  dataListView: false,
  imageListView: false,
  isBreadcrumb: true,
  search: true,
  orderBy: true,
  title: ''
}
export default injectIntl(ListPageHeading)
