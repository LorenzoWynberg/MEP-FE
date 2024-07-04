import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ListPageHeading from './PageHeading'
import Pagination from '../table/Pagination'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { injectIntl } from 'react-intl'
import { debounce } from 'lodash'
import { showProgress, hideProgress } from 'Utils/progress'
import search from 'Utils/search'
import {
  Row,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Col
} from 'reactstrap'
import Item from './Item'
import { StyledTr } from './styles'
import './style.scss'
import LoaderContainer from 'Components/LoaderContainer'
import { useTranslation } from 'react-i18next'

const Table = (props) => {
  const { messages } = props.intl
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [selectedColumn, setSelectedColumn] = useState(
    props.orderOptions.length > 0
      ? props.orderOptions.find((item) => item.default) || props.orderOptions[0]
      : props.columns[0]
  )
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItemsId, setSelectedItemsId] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPageSize, setSelectedPageSize] = useState(
    props.mountedPageSize || 10
  )
  const [displayMode, setDisplayMode] = useState()
  const [totalPage, setTotalPage] = useState()
  const [totalItemCount, setTotalItemCount] = useState()
  const [searchValue, setSearchValue] = useState('')
  const [cols, setCols] = useState([])
  const [columnsToShow, setColumnsToShow] = useState(
    props.columns.map((item) => item.column)
  )
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('persist:auth-id') || -1
  )

  const { showAddButton = true } = props

  useEffect(() => {
    if (props.selectAll !== undefined && props.selectAll !== selectAll) {
      handleChangeSelectAll()
    }
  }, [props.selectAll])

  useEffect(() => {
    if (props.onSelectId) {
      props.onSelectId(selectedItemsId)
    }
  }, [props.onSelectId, selectedItemsId])

  useEffect(() => {
    setCols(props.columns)
    setColumnsToShow(
      props.columns
        .filter((item) => item.show == undefined || item.show)
        .map((item) => item.column)
    )
    return () => {
      setCols(props.columns)
    }
  }, [props.columns])

  useEffect(() => {
    setDisplayMode(props.selectDisplayMode)
  }, [props.selectDisplayMode])

  useEffect(() => {
    const totalPage = Math.ceil(
      props.totalRegistro /
        (props.pageSize ? props.pageSize : selectedPageSize)
    )
    setTotalPage(totalPage)
    setTotalItemCount(props.totalRegistro)
  }, [props.totalRegistro, selectedPageSize])

  useEffect(() => {
    setItems(props.data)
  }, [props.data])

  useEffect(() => {
    if (props.onSelectIds) {
      props.onSelectIds(selectedItemsId)
    }
  }, [selectedItemsId])

  const onCheckItem = (id) => {
    const idIndex = selectedItemsId.indexOf(id)
    if (idIndex > -1) selectedItemsId.splice(idIndex, 1)
    else selectedItemsId.push(id)
    setSelectedItemsId([...selectedItemsId])
  }
  const handleChangeSelectAll = () => {
    if (selectAll) {
      items.map((x) => addSelectedIds(x.id))
      setSelectedItemsId([])
      setSelectAll(false)
    } else {
      const _elements = items.map((x) => addSelectedIds(x.id))
      setSelectedItemsId([
        ...selectedItemsId,
        ..._elements.filter((item) => item)
      ])
      setSelectAll(true)
      document.activeElement.blur()
      return selectAll
    }
  }

  const onChangePage = async (pageNumber) => {
    if (props.backendPaginated) {
      showProgress()
      if (searchValue === '') {
        await props.handlePagination(
          pageNumber,
          props.pageSize ? props.pageSize : selectedPageSize,
          searchValue
        )
      } else {
        await props.handleSearch(
          selectedColumn.filterAction
            ? selectedColumn.filterAction(searchValue)
            : searchValue,
          selectedColumn.filterColumn || selectedColumn.column,
          props.pageSize ? props.pageSize : selectedPageSize,
          pageNumber
        )
      }
      hideProgress()
    }
    setCurrentPage(pageNumber)
  }

  const changePageSize = async (number) => {
    showProgress()
    let totalPage = 0
    if (props.backendPaginated) {
      if (searchValue !== '') {
        await props.handleSearch(
          selectedColumn.filterAction
            ? selectedColumn.filterAction(searchValue)
            : searchValue,
          selectedColumn.filterColumn || selectedColumn.column,
          number,
          1
        )
      } else {
        await props.handlePagination(1, number, searchValue)
      }
    }
    totalPage = Math.ceil(props.totalRegistro / number)
    setTotalPage(totalPage)
    hideProgress()
    setSelectedPageSize(number)
    setCurrentPage(1)
  }
  const _debounce = debounce(async function (value) {
    await props.handleSearch(
      selectedColumn.filterAction ? selectedColumn.filterAction(value) : value,
      selectedColumn.filterColumn || selectedColumn.column,
      props.pageSize ? props.pageSize : selectedPageSize,
      1
    )
  }, 700)

  const onSearchClicked = async (e) => {
    if (props.backendPaginated || props.backendSearch) {
      showProgress()
      _debounce(searchValue)
      setCurrentPage(1)
      hideProgress()
    } else {
      setItems(
        search(searchValue).in(
          props.data,
          props.columns.map((item) => item.column)
        )
      )
    }
  }

  const onSearchKey = async (e) => {
    const { value } = e.target
    setSearchValue(value)

    if (
      ((e.charCode == 13 || e.keyCode == 13) && value.length >= 3) ||
      value.length == 0
    ) {
      setItems(
        search(value).in(
          props.data,
          props.columns.map((item) => item.column)
        )
      )
    }
  }

  const handleSearchValue = (e) => {
    const { value } = e.target
    setSearchValue(value)

    if ((e.charCode == 13 || e.keyCode == 13) && value.length === 0) {
      onSearchClicked()
    }

    if ((e.charCode == 13 || e.keyCode == 13) && value.length >= 3) {
      onSearchClicked()
    }
  }

  const onSearching = async (e) => {
    const { value } = e.target
    setSearchValue(value)
  }

  const onSearch = async () => {
    await props.handleSearch(
      selectedColumn.filterAction
        ? selectedColumn.filterAction(searchValue)
        : searchValue,
      selectedColumn.filterColumn || selectedColumn.column,
      selectedPageSize,
      1
    )
  }

  //= ==============================

  const addSelectedIds = (id) => {
    if (selectedItemsId.indexOf(id) >= 0) {
      return
    }
    return id
  }

  const changeOrderByAsc = async (column, isFilterColumn = false) => {
    if (props.backendPaginated) {
      if (props.handleOrderDirection) {
        await props.handleOrderDirection(
          column.filterAction ? column.filterAction(searchValue) : searchValue,
          isFilterColumn
            ? column.filterColumn
              ? column.filterColumn
              : column.column
            : selectedColumn.filterColumn
              ? selectedColumn.filterColumn
              : selectedColumn.column,
          props.pageSize ? props.pageSize : selectedPageSize,
          1,
          column.column,
          'ASC'
        )
      }
      setCurrentPage(1)
    } else {
      const formatDate = (date) => date.split('.').reverse().join('-')
      const getDate = (date) => new Date(formatDate(date))
      const getTime = (date) => getDate(date).getTime()

      setItems([
        ...items.sort((a, b) => {
          let comparison
          if (column.isNumericField) {
            comparison = {
              string: parseInt(b[column.column]) - parseInt(a[column.column])
            }
          } else {
            const aa = a[column.column] == null ? '' : a[column.column]
            const bb = b[column.column] == null ? '' : b[column.column]
            comparison = {
              string: aa.localeCompare(bb),
              date: getTime(aa) - getTime(bb)
            }
          }
          return column.column === 'date' ? comparison.date : comparison.string
        })
      ])
    }

    if (Array.isArray(props.orderOptions) && isFilterColumn) {
      const _selectedColumn = props.orderOptions.find(
        (item) => item.column === column.column
      )
      setSelectedColumn(_selectedColumn)
    }

    const newCols = cols.map((col) => {
      if (col.column === column.column) {
        return { ...col, direction: 'asc' }
      } else {
        return { ...col, direction: undefined }
      }
    })
    setCols(newCols)
  }

  const changeDescOrderBy = async (column) => {
    if (props.backendPaginated) {
      if (props.handleOrderDirection) {
        await props.handleOrderDirection(
          column.filterAction ? column.filterAction(searchValue) : searchValue,
          selectedColumn.filterColumn
            ? selectedColumn.filterColumn
            : selectedColumn.column,
          props.pageSize ? props.pageSize : selectedPageSize,
          1,
          column.column,
          'DESC'
        )
      }
      setCurrentPage(1)
    } else {
      const formatDate = (date) => date.split('.').reverse().join('-')
      const getDate = (date) => new Date(formatDate(date))
      const getTime = (date) => getDate(date).getTime()
      setItems([
        ...items.sort((a, b) => {
          let comparison
          if (column.isNumericField) {
            comparison = {
              string: parseInt(a[column.column]) - parseInt(b[column.column])
            }
          } else {
            const aa = a[column.column] == null ? '' : a[column.column]
            const bb = b[column.column] == null ? '' : b[column.column]
            comparison = {
              string: bb.localeCompare(aa),
              date: getTime(bb) - getTime(aa)
            }
          }
          return column.column === 'date' ? comparison.date : comparison.string
        })
      ])
    }

    const newCols = cols.map((col) => {
      if (col.column === column.column) {
        return { ...col, direction: 'desc' }
      } else {
        return { ...col, direction: undefined }
      }
    })
    setCols(newCols)
  }

  const changeColumn = (column) => {
    if (columnsToShow.includes(column)) {
      return setColumnsToShow(columnsToShow.filter((item) => item === column))
    }
    return setColumnsToShow([...columnsToShow, column])
  }
  const pageS = props.pageSize ? props.pageSize : selectedPageSize
  const endIndex = currentPage * pageS
  const startIndex = endIndex - pageS
  const pageSizes = [6, 10, 20, 25]
  const currentElements = () => {
    if (props.backendPaginated) {
      return items
    }
    return items.slice(startIndex, endIndex)
  }

  const changeFilterCheck = async (item) => {
    await props.filters.changeFilterCheck(
      item,
      selectedColumn.filterAction
        ? selectedColumn.filterAction(searchValue)
        : searchValue,
      selectedColumn.filterColumn || selectedColumn.column,
      selectedPageSize,
      currentPage
    )
  }
  return (
    <>
      <div className='table-box'>
        {props.PageHeading && (
          <>
            {props.tableName && (
              <Helmet>
                <title>
                  {props.tableName && messages[props.tableName]
                    ? `${messages[props.tableName]}`
                    : '-----'}
                </title>
              </Helmet>
            )}
            <ListPageHeading
              searchSize={props.searchSize}
              layout={props.layout}
              showAddButton={showAddButton}
              cols={cols}
              avoidFilter={props.avoidFilter}
              onSearchClicked={onSearchClicked}
              backendPaginated={props.backendPaginated}
              buttonSearch={props.buttonSearch}
              onGlobalSearch={
                props.backendPaginated || props.backendSearch
                  ? handleSearchValue
                  : onSearchKey
              }
              filterdSearch={props.filterdSearch}
              selectDisplayMode={props.selectDisplayMode}
              alignEnd={props.alignEnd}
              columnsToShow={columnsToShow}
              changeColumn={changeColumn}
              placeholder={props.placeholder}
              preferences={props.preferences}
              disableSelectAll={props.disableSelectAll}
              buttonLabel={props.buttonLabel}
              trigger={() => {
                setSelectAll(false)
                setSelectedItemsId([])
              }}
              items={items}
              labelSearch={props.labelSearch}
              orderBy={props.orderBy}
              setSelectAll={setSelectAll}
              items={currentElements()}
              selectedOrderOption={selectedColumn}
              changeOrderBy={(col) => {
                changeOrderByAsc(col, true)
              }}
              itemsHook={[items, setItems]}
              products={currentElements()}
              selectAll={selectAll}
              heading={props.tableName}
              handleChangeSelectAll={handleChangeSelectAll}
              changePageSize={changePageSize}
              selectedPageSize={selectedPageSize}
              totalItemCount={totalItemCount}
              startIndex={startIndex}
              endIndex={endIndex}
              showTitle={props.showTitle}
              selectedItemsLength={
                props.selectedItemsId ? props.selectedItemsId.length : 0
              }
              roundedStyle={props.roundedStyle}
              itemsLength={items ? items.length : 0}
              readOnly={props.readOnly}
              hideMultipleOptions={props.hideMultipleOptions}
              onSearchKey={onSearchKey}
              onSearching={onSearching}
              onSearch={onSearch}
              pageSizes={pageSizes}
              toggleModal={props.toggleModal}
              selectedItemsId={selectedItemsId}
              displayMode={displayMode}
              actions={props.actions}
              tableName={props.tableName}
              orderOptions={props.orderOptions}
              match={props.match}
              readOnly={props.readOnly}
              disableSearch={props.disableSearch}
              filters={props.filters}
              changeFilterCheck={changeFilterCheck}
              preferencesColor={
                props.preferencesColor || 'secondary dropdown-toggle-split'
              }
            />
          </>
        )}

        <Row>
          <Col xs={12}>
            <StyledTable>
              <tbody>
                {props.titleTable
                  ? (
                    <h3 style={{ margin: '1%' }}>{props.titleTable}</h3>
                    )
                  : null}
                {items.length > 0 && (
                  <StyledTr>
                    {(props.thumblist || (props.startIcon && <th />)) && <th />}
                    {cols.map((column, i) => {
                      if (!columnsToShow.includes(column.column)) return null
                      return (
                        <th className='tableHeader' key={`${i}`}>
                          {column.label}
                          {column.order
                            ? (
                              <span
                                className='order'
                                style={{ cursor: 'pointer' }}
                              >
                                <span className='dropdown'>
                                  <span
                                    onClick={() => {
                                      changeOrderByAsc(column)
                                    }}
                                    className={
                                    column.direction === undefined
                                      ? 'caret-down'
                                      : column.direction === 'asc'
                                        ? 'caret-down selected'
                                        : 'caret-down '
                                  }
                                  />
                                </span>
                                <span className='dropup'>
                                  <span
                                    onClick={() => {
                                      changeDescOrderBy(column)
                                    }}
                                    className={
                                    column.direction === undefined
                                      ? 'caret-up'
                                      : column.direction === 'desc'
                                        ? 'caret-up selected'
                                        : 'caret-up '
                                  }
                                  />
                                </span>
                              </span>
                              )
                            : null}
                        </th>
                      )
                    })}
                    {(props.actionRow || !props.hideMultipleOptions) &&
                      !props.hidePageSizes && (
                        <ThBtn>
                          <span className='text-muted text-small ml-2'>{`${startIndex}-${endIndex} of ${totalItemCount} `}</span>
                          <UncontrolledDropdown className='d-inline-block'>
                            <DropdownToggle caret color='outline' size='xs'>
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
                        </ThBtn>
                    )}
                  </StyledTr>
                )}
                {currentElements().map((item, idx) => {
                  return (
                    <Item
                      selectedBgColor={props.selectedBgColor}
                      key={idx}
                      startIcon={props.startIcon}
                      thumblist={props.thumblist}
                      cols={cols}
                      item={item}
                      showMenu={props.showMenu}
                      columnsToShow={columnsToShow}
                      actionRow={props.actionRow}
                      onCheckItem={onCheckItem}
                      hideMultipleOptions={props.hideMultipleOptions}
                      isSelect={selectedItemsId.includes(item.id)}
                      toggleEditModal={props?.toggleEditModal}
                      showCursor={Boolean(props?.toggleEditModal)}
                      showLastRow={
                        props.totalRegistro == 100 &&
                        currentElements().length - 1 == idx &&
                        currentPage == Math.ceil(100 / selectedPageSize)
                      }
                    />
                  )
                })}
              </tbody>
            </StyledTable>
          </Col>{' '}
          {!props.loading && currentElements().length <= 0 && (
            <h4 className='w-100 container-center mt-5'>
              {props.rollBackLabel || t('estudiantes>buscador_per>info_gen>no_result', 'No se encontraron resultados')}
            </h4>
          )}
          {props.loading && <LoaderContainer />}
          <Pagination
            currentPage={currentPage}
            totalPage={
              totalPage ||
              Math.ceil(
                items.length /
                  (props.pageSize ? props.pageSize : selectedPageSize)
              )
            }
            onChangePage={(i) => onChangePage(i)}
          />
        </Row>
      </div>
    </>
  )
}

const StyledRow = styled.b`
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : 0)};
  width: ${(props) =>
    props.width ? props.width : 100 / (props.cols.length + 1)}%;
  text-align: left;
  @media (max-width: 992px) {
    display: none;
  }
`

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0 0.8rem;
  border-collapse: separate;
`
const ThBtn = styled.th`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    display: none !important;
    visibility: hidden;
  }
`

Table.propTypes = {
  listView: PropTypes.bool,
  dataListView: PropTypes.bool,
  imageListView: PropTypes.bool,
  search: PropTypes.bool,
  orderBy: PropTypes.bool,
  loading: PropTypes.bool,
  actionRow: PropTypes.array,
  actions: PropTypes.array,
  setCantPorPagina: PropTypes.func,
  setCurrentPage: PropTypes.func,
  totalRegistro: PropTypes.number,
  orderOptions: PropTypes.func,
  PageHeading: PropTypes.bool,
  isBreadcrumb: PropTypes.bool,
  pageSize: PropTypes.number,
  selectedPageSize: PropTypes.number,
  handlePagination: {
    pageNumber: PropTypes.number,
    selectedPageSize: PropTypes.number,
    searchValue: PropTypes.string
  }
}
Table.defaultProps = {
  listView: false,
  actionRow: [],
  actions: [],
  dataListView: false,
  imageListView: false,
  setCantPorPagina: () => {},
  setCurrentPage: () => {},
  orderOptions: () => [],
  selectedPageSize: 10,
  search: true,
  PageHeading: true,
  isBreadcrumb: true,
  loading: false,
  orderBy: true,
  totalRegistro: 0,
  searchSize: 8
}
export default injectIntl(Table)
