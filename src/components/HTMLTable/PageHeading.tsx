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
  , Col, Input, InputGroupAddon
} from 'reactstrap'

import { injectIntl } from 'react-intl'
import IntlMessages from 'Helpers/IntlMessages'

import styled from 'styled-components'
import { withTranslation } from 'react-i18next'

class ListPageHeading extends Component {
  constructor (props) {
    super()
    this.state = {
      dropdownSplitOpen: false,
      displayOptionsIsOpen: false,
      dropdownFilterOpen: false,
      dropdownOpenPreferences: false,
      dropdownOpenFilters: false,
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

  changeFilterCheck = async (item) => {
    this.setState({ loading: true })
    await this.props.changeFilterCheck(item)
    this.setState({ loading: false })
  }

  handleKeyPress = (e) => {
    if (!e || e.charCode === 13) {
      this.onSearch()
      return false
    }
  }

  render () {
    // const { messages } = this.props.intl
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
      layout,
      placeholder,
      items,
      alignEnd,
      cols,
      preferencesColor = 'secondary dropdown-toggle-split',
      showAddButton = true
    } = this.props

    const { displayOptionsIsOpen, dropdownSplitOpen } = this.state
    return (
      <>
        <Row style={alignEnd ? { justifyContent: 'space-between' } : {}}>
          {this.props.showTitle && (
            <Col
              xs={12}
              sm={12}
              md='4'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '1rem'
              }}
            >
              <h3>{this.props.showTitle}</h3>
            </Col>
          )}

          {!this.props.disableSearch
            ? (
              <Col
                xs={12}
                sm={12}
                md={
                !filterdSearch && !this.props.preferences
                  ? this.props.searchSize
                  : !this.props.readOnly
                      ? 6
                      : 5
              }
              >
                <div
                  className={`search-sm${
                  this.props.roundedStyle ? '--rounded' : ''
                }`}
                >
                  <input
                    type='text'
                    name='keyword'
                    id='search'
                    placeholder={placeholder || this.props.t('estudiantes>buscador_per>info_gen>busc>placeholder', 'Escriba aquí las palabras claves que desea buscar2...')}
                    onInput={(e) => onGlobalSearch(e)}
                    onKeyPress={(e) => onGlobalSearch(e)}
                  />
                  {this.props.buttonSearch && (
                    <StyledInputGroupAddon
                      style={{ zIndex: 2 }}
                      addonType='append'
                    >
                      <Button
                        color='primary'
                        className='buscador-table-btn-search'
                        onClick={onSearchClicked}
                        id='buttonSearchTable'
                      >
                        {this.props.t('general>buscar', 'Buscar')}
                      </Button>
                    </StyledInputGroupAddon>
                  )}
                </div>
              </Col>
              )
            : (
              <Col xs={12} sm={12} md={6} />
              )}
          {filterdSearch && (
            <Col sm='3'>
              <Dropdown
                className='btn-search-table-heading'
                isOpen={this.state.dropdownFilterOpen}
                toggle={() => {
                  this.toggle('dropdownFilterOpen')
                }}
              >
                <DropdownToggle color='secondary dropdown-toggle-split'>
                  Buscar por {selectedOrderOption.label.toLowerCase()}{' '}
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
                          Buscar por {filter.label.toLowerCase()}
                        </DropdownItem>
                        {i < orderOptions.length - 1 && (
                          <DropdownItem divider />
                        )}
                      </>
                    )
                  })}
                </DropdownMenu>
              </Dropdown>
            </Col>
          )}
          {!this.props.readOnly && (
            <Col
              style={{
                display: 'flex',
                justifyContent: 'right',
                justifySelf: 'right'
              }}
              sm={
                this.props.disableSearch && !this.props.showTitle
                  ? {
                      offset:
                        !this.props.hideMultipleOptions &&
                        !this.props.disableSelectAll
                          ? 9
                          : 10
                    }
                  : '3'
              }
            >
              {
                showAddButton && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      color='primary'
                      size='lg'
                      className='top-right-button'
                      onClick={() => toggleModal(selectedItemsId)}
                    >
                      {this.props.buttonLabel || this.props.t('general>agregar', 'Agregar')}

                    </Button>
                  </div>
                )
              }
            </Col>
          )}
          {!this.props.hideMultipleOptions && !this.props.disableSelectAll && (
            <Col style={{ display: 'flex', justifyContent: 'right' }}>
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
            </Col>
          )}
          {items.length > 0 && (
            <>
              {this.props.preferences && (
                <Col
                  sm='3'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: !this.props.readOnly ? 20 : 0
                  }}
                >
                  {!this.props.avoidFilter && (
                    <Input
                      className='buscador-table-buscar-tabla'
                      onKeyPress={(e) => onSearchKey(e)}
                      placeholder='Filtrar en tabla'
                      style={{ width: '46%', marginTop: 0 }}
                    />
                  )}
                  <Dropdown
                    isOpen={this.state.dropdownOpenPreferences}
                    toggle={() => {
                      this.toggle('dropdownOpenPreferences')
                    }}
                    ismultiple
                    color='primary'
                  >
                    <DropdownToggle
                      color={preferencesColor}
                      caret
                      style={{ width: 139 }}
                    >
                      Preferencias
                    </DropdownToggle>
                    <DropdownMenu>
                      {cols.map((item) => {
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
                </Col>
              )}
            </>
          )}

          {this.props.filters &&
            !(
              !this.props.disableSearch &&
              this.props.filterdSearch &&
              this.props.preferences
            ) && (
              <Col
                sm={
                  this.props.disableSearch && !this.props.showTitle
                    ? { offset: 8 }
                    : '3'
                }
              >
                <Dropdown
                  isOpen={this.state.dropdownOpenFilters}
                  toggle={() => {
                    this.toggle('dropdownOpenFilters')
                  }}
                  ismultiple
                  style={{ textAlign: 'right' }}
                >
                  <DropdownToggle color='primary dropdown-toggle-split' caret>
                    Filtros
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.props.filters.filterOptions.map((item) => {
                      // [{id:'recibidos',checked:true,label:'Recibidos'}]
                      return (
                        <DropdownItem disabled>
                          <input
                            type='checkbox'
                            id={item.column}
                            checked={item.checked}
                            onClick={() => {
                              this.changeFilterCheck(item)
                            }}
                          />{' '}
                          {item.label}{' '}
                        </DropdownItem>
                      )
                    })}
                  </DropdownMenu>
                </Dropdown>
              </Col>
          )}
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
  title: '',
  searchSize: 8,
  alignEnd: true
}
export default withTranslation()(ListPageHeading)
