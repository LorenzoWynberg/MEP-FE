import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Button,
  ButtonDropdown,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  CustomInput
  , Col, InputGroupAddon
} from 'reactstrap'

import { injectIntl } from 'react-intl'
import IntlMessages from 'Helpers/IntlMessages'

import styled from 'styled-components'

type IProps = {}

class ListPageHeading extends Component {
  constructor (props) {
    super()
    this.state = {
      dropdownSplitOpen: false,
      displayOptionsIsOpen: false,
      dropdownFilterOpen: false,
      dropdownOpenPreferences: false,
      filterText: '',
      loading: false
    }
  }

  toggle = (dropdown) => {
    this.setState({
      [dropdown]: !this.state[dropdown]
    })
  }

  handleChange = (e) => {
    const { value } = e.target
    setFilterText(value)
  }

  onSearch = async () => {
    const _filterType = filters.find((x) => x.isSelected)
    this.setState({ loading: true })
    await this.props.handleSearch(filterText, _filterType.column)
    this.setState({ loading: false })
  }

  handleKeyPress = (e) => {
    if (!e || e.charCode === 13) {
      this.onSearch()
      return false
    }
  }

  render () {
    const { messages } = this.props.intl
    const {
      onGlobalSearch,
      selectedOrderOption,
      filterdSearch,
      orderOptions,
      changeOrderBy,
      onSearchClicked,
      onSearchKey,
      toggleModal,
      selectAll,
      actions,
      selectedItemsId,
      handleChangeSelectAll,
      changeColumn,
      selectedPageSize,
      totalItemCount,
      startIndex,
      displayMode,
      changeDisplayMode,
      endIndex,
      onSearching,
      onSearch,
      heading,
      pageSizes,
      changePageSize,
      match,
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
          <Col xs='5'>
            {!this.props.disableSearch
              ? (
                <div
                  className={`search-sm${
                  this.props.roundedStyle ? '--rounded' : ''
                }`}
                >
                  <input
                    type='text'
                    name='keyword'
                    id='search'
                    placeholder={messages['menu.search']}
                    onInput={(e) => onGlobalSearch(e)}
                    onKeyPress={(e) => onGlobalSearch(e)}
                    autoComplete='off'
                  />
                  {this.props.buttonSearch && (
                    <StyledInputGroupAddon addonType='append'>
                      <Button
                        color='primary'
                        className='buscador-table-btn-search'
                        onClick={onSearchClicked}
                      >
                        Buscar
                      </Button>
                    </StyledInputGroupAddon>
                  )}
                </div>
                )
              : null}
          </Col>
          <Col xs='2'>
            {filterdSearch
              ? (
                <Dropdown
                  isOpen={this.state.dropdownFilterOpen}
                  toggle={() => {
                    this.toggle('dropdownFilterOpen')
                  }}
                >
                  <DropdownToggle color='secondary dropdown-toggle-split'>
                    {selectedOrderOption.label}{' '}
                    <span className='caret-down' />
                  </DropdownToggle>
                  <DropdownMenu>
                    {orderOptions.map((filter, i) => {
                      return (
                        <>
                          <DropdownItem
                            onClick={() => {
                              changeOrderBy(filter)
                            }}
                          >
                            {filter.label}
                          </DropdownItem>
                          {i < orderOptions.length - 1 && (
                            <DropdownItem divider />
                          )}
                        </>
                      )
                    })}
                  </DropdownMenu>
                </Dropdown>
                )
              : null}
          </Col>
          <Col xs='5' className='d-flex justify-content-end'>
            {this.props.newResource
              ? (
                <div className='mr-2'>
                  <Button
                    color='primary'
                    size='md'
                    className='top-right-button'
                    onClick={() => toggleModal()}
                  >
                    {this.props.resourceTitle}
                  </Button>
                </div>
                )
              : null}

            {this.props.preferences
              ? (
                <div className='mr-2'>
                  <Dropdown
                    isOpen={this.state.dropdownOpenPreferences}
                    toggle={() => {
                      this.toggle('dropdownOpenPreferences')
                    }}
                    ismultiple
                  >
                    <DropdownToggle color='primary dropdown-toggle-split' caret>
                      Preferencias
                    </DropdownToggle>
                    <DropdownMenu>
                      {orderOptions.map((item) => {
                        return (
                          <DropdownItem disabled>
                            <input
                              type='checkbox'
                              id={item.column}
                              checked={this.props.columnsToShow.includes(
                  item.column
                )}
                              onClick={() => {
                  changeColumn(item.column)
                }}
                            />{' '}
                            {item.label}{' '}
                          </DropdownItem>
                        )
                      })}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                )
              : null}

            {!this.props.hideMultipleOptions
              ? (
                <div>
                  <ButtonDropdown
                    isOpen={dropdownSplitOpen}
                    toggle={() => {
                      this.toggle('dropdownSplitOpen')
                    }}
                  >
                    <div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
                      {selectAll
                        ? (
                          <CustomInput
                            className='custom-checkbox mb-0 d-inline-block'
                            type='checkbox'
                            id='checkAll'
                            onClick={() => handleChangeSelectAll()}
                            checked
                          />
                          )
                        : (
                          <CustomInput
                            className='custom-checkbox mb-0 d-inline-block'
                            type='checkbox'
                            id='checkAll'
                            onClick={() => handleChangeSelectAll()}
                          />
                          )}
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
                            key={index}
                            onClick={() => action.actionFunction(selectedItemsId)}
                          >
                            <IntlMessages id={action.actionName} />
                          </DropdownItem>
                        )
                      })}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
                )
              : null}
          </Col>
        </Row>
      </>
    )
  }
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  }
`
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
