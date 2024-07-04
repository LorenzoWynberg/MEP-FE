import React, { Component } from 'react'
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
} from '../../components/svg'
import Breadcrumb from '../navs/Breadcrumb'

import { Colxx, Separator } from '../../components/common/CustomBootstrap'
import { injectIntl } from 'react-intl'
import IntlMessages from '../../helpers/IntlMessages'

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
      toggleModal,
      heading,
      pageSizes,
      changePageSize,
      match,
      selectedOrderOption,
      orderOptions,
      changeOrderBy,
      itemsHook,
      trigger
    } = this.props

    const [items, setItems] = itemsHook

    const { displayOptionsIsOpen, dropdownSplitOpen } = this.state
    return (
      <>
        <Row>
          <Colxx xxs='12'>
            <div className='mb-2'>
              <Breadcrumb heading={`${heading}`} match={match} />
              <div className='text-zero top-right-button-container'>
                <Button
                  color='primary'
                  size='lg'
                  className='top-right-button'
                  onClick={() => toggleModal()}
                >
                  <IntlMessages id='button.add' />
                </Button>
                {'  '}
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
                          key={index} onClick={() => trigger
                            ? (
                                trigger(),
                                action.actionFunction({ selectedItemsId, items, setItems })
                              )
                            : action.actionFunction(selectedItemsId, action.actionName)}
                        >
                          <IntlMessages id={action.actionName} />
                        </DropdownItem>
                      )
                    })}
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
            </div>

            <div>
              <Collapse
                isOpen={displayOptionsIsOpen}
                className='d-md-block'
                id='displayOptions'
              >
                <span className='mr-3 mb-2 d-inline-block float-md-left'>
                  <span
                    className={`mr-2 view-icon ${
                      displayMode === 'list' ? 'active' : ''
                    }`}
                    onClick={() => changeDisplayMode('list')}
                  >
                    <DataListIcon />
                  </span>
                  <span
                    className={`mr-2 view-icon ${
                      displayMode === 'thumblist' ? 'active' : ''
                    }`}
                    onClick={() => changeDisplayMode('thumblist')}
                  >
                    <ThumbListIcon />
                  </span>
                  <span
                    href='#'
                    className={`mr-2 view-icon ${
                      displayMode === 'imagelist' ? 'active' : ''
                    }`}
                    onClick={() => changeDisplayMode('imagelist')}
                  >
                    <ImageListIcon />
                  </span>
                </span>
                <div className='d-block d-md-inline-block'>
                  <UncontrolledDropdown className='mr-1 float-md-left btn-group mb-1'>
                    <DropdownToggle caret color='outline-dark' size='xs'>
                      <IntlMessages id='Ordenar por ' />
                      {selectedOrderOption && selectedOrderOption.label}
                    </DropdownToggle>
                    <DropdownMenu>
                      {orderOptions().map((order, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => changeOrderBy(order.column)}
                          >
                            {order.label}
                          </DropdownItem>
                        )
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <div className='search-sm d-inline-block float-md-left mr-1 mb-1 align-top'>
                    <input
                      type='text'
                      name='keyword'
                      id='search'
                      placeholder={messages['menu.search']}
                      onInput={e => onSearchKey(e)}
                    />
                  </div>
                </div>
                <div className='float-md-right'>
                  <span className='text-muted text-small mr-1'>{`${startIndex}-${endIndex} of ${totalItemCount} `}</span>
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
                </div>
              </Collapse>
            </div>
          </Colxx>
        </Row>
        <Separator className='mb-5' />
      </>
    )
  }
}

export default injectIntl(ListPageHeading)
