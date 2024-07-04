import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ListPageHeading from './PageHeadingSingle'
import Pagination from '../table/Pagination'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { injectIntl } from 'react-intl'
import { debounce } from 'lodash'
import { showProgress, hideProgress } from 'Utils/progress'
import search from 'Utils/search'
import { Row, Col } from 'reactstrap'
import Item from './ItemSingle'
import { StyledTr } from './styles'

const Table = (props) => {
  const { messages } = props.intl

  const [items, setItems] = useState([])
  const [selectedColumn, setSelectedColumn] = useState(props.columns[0])
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItemsId, setSelectedItemsId] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPageSize, setSelectedPageSize] = useState(10)
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

  useEffect(() => {
    setCols(props.columns)
    setColumnsToShow(props.columns.map((item) => item.column))
    return () => {
      setCols(props.columns)
    }
  }, [props.columns])

  useEffect(() => {
    setDisplayMode(props.selectDisplayMode)
  }, [props.selectDisplayMode])

  useEffect(() => {
    const totalPage = Math.ceil(props.totalRegistro / selectedPageSize)
    setTotalPage(totalPage)
    setTotalItemCount(props.totalRegistro)
  }, [props.totalRegistro, selectedPageSize])

  useEffect(() => {
    setItems(props.data)
    return () => {
      setItems(props.data)
    }
  }, [props.data, props.columns])

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
      items.map((x) => addSelectedIds(x.id))
      setSelectAll(true)
      document.activeElement.blur()
      return selectAll
    }
  }

  const onChangePage = async (pageNumber) => {
    if (props.backendPaginated) {
      showProgress()
      if (searchValue === '') {
        await props.handlePagination(pageNumber, selectedPageSize)
      } else {
        await props.handleSearch(
          searchValue,
          selectedColumn.filterColumn || selectedColumn.column,
          selectedPageSize,
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
    if (searchValue !== '') {
      await props.handleSearch(
        searchValue,
        selectedColumn.filterColumn || selectedColumn.column,
        number,
        1
      )
    } else {
      await props.handlePagination(1, number)
    }
    totalPage = Math.ceil(props.totalRegistro / number)
    setTotalPage(totalPage)
    hideProgress()
    setSelectedPageSize(number)
    setCurrentPage(1)
  }
  const _debounce = debounce(async function (value) {
    await props.handleSearch(
      value,
      selectedColumn.filterColumn || selectedColumn.column,
      selectedPageSize,
      1
    )
  }, 700)

  const onSearchClicked = async (e) => {
    showProgress()
    _debounce(searchValue)
    setCurrentPage(1)
    hideProgress()
  }

  const onSearchKey = async (e) => {
    const { value } = e.target
    setSearchValue(value)
    setItems(
      search(value).in(
        props.data,
        props.columns.map((item) => item.column)
      )
    )
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
      searchValue,
      selectedColumn.filterColumn || selectedColumn.column,
      selectedPageSize,
      1
    )
  }

  //= ==============================

  const addSelectedIds = (id) => {
    if (selectedItemsId.indexOf(id) >= 0) {
      return selectedItemsId
    } else {
      id !== currentUser && selectedItemsId.push(id)
      return selectedItemsId
    }
  }

  const changeOrderBy = (column) => {
    const formatDate = (date) => date.split('.').reverse().join('-')
    const getDate = (date) => new Date(formatDate(date))
    const getTime = (date) => getDate(date).getTime()
    const newCols = cols.map((col) => {
      if (col.column === column.column) {
        return { ...col, isDesc: col.isDesc === undefined ? true : !col.isDesc }
      } else {
        return { ...col, isDesc: undefined }
      }
    })
    setCols(newCols)
    const _selectedColumn = newCols.find(
      (item) => item.column === column.column
    )
    setSelectedColumn(_selectedColumn)
    setItems([
      ...items.sort((a, b) => {
        let comparison
        if (column.isNumericField) {
          comparison = {
            string: _selectedColumn.isDesc
              ? parseInt(a[column.column]) - parseInt(b[column.column])
              : parseInt(b[column.column]) - parseInt(a[column.column])
          }
        } else {
          const aa = a[column.column] == null ? '' : a[column.column]
          const bb = b[column.column] == null ? '' : b[column.column]
          comparison = {
            string: _selectedColumn.isDesc
              ? bb.localeCompare(aa)
              : aa.localeCompare(bb),
            date: _selectedColumn.isDesc
              ? getTime(bb) - getTime(aa)
              : getTime(aa) - getTime(bb)
          }
        }
        return column.column === 'date' ? comparison.date : comparison.string
      })
    ])
  }

  const changeColumn = (column) => {
    if (columnsToShow.includes(column)) {
      return setColumnsToShow(columnsToShow.filter((item) => item !== column))
    }
    return setColumnsToShow([...columnsToShow, column])
  }

  const endIndex = currentPage * selectedPageSize
  const startIndex = endIndex - selectedPageSize
  const pageSizes = [10, 20, 25]
  const currentElements = () => {
    if (props.backendPaginated) {
      return items
    }
    return items.slice(startIndex, endIndex)
  }
  const showHeaders = () => !!currentElements().length && props.showHeaders

  return (
    <>
      <div className='table-box'>
        {props.PageHeading && (
          <>
            <Helmet>
              <title>{messages[props.tableName]}</title>
            </Helmet>
            <ListPageHeading
              layout={props.layout}
              onSearchClicked={onSearchClicked}
              backendPaginated={props.backendPaginated}
              buttonSearch={props.buttonSearch}
              onGlobalSearch={
                props.backendPaginated || props.buttonSearch
                  ? handleSearchValue
                  : onSearchKey
              }
              filterdSearch={props.filterdSearch}
              selectDisplayMode={props.selectDisplayMode}
              columnsToShow={columnsToShow}
              changeColumn={changeColumn}
              preferences={props.preferences}
              trigger={() => {
                setSelectAll(false)
                setSelectedItemsId([])
              }}
              labelSearch={props.labelSearch}
              orderBy={props.orderBy}
              setSelectAll={setSelectAll}
              items={currentElements()}
              selectedOrderOption={selectedColumn}
              changeOrderBy={changeOrderBy}
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
              newResource={props.newResource}
              resourceTitle={props.resourceTitle}
              toggleModal={props.toggleModal}
              selectedItemsId={selectedItemsId}
              displayMode={displayMode}
              actions={props.actions}
              tableName={props.tableName}
              orderOptions={props.orderOptions}
              match={props.match}
              readOnly={props.readOnly}
              disableSearch={props.disableSearch}
            />
          </>
        )}
        {props.loading
          ? (
            <div className='w-100 container-center  mt-5'>
              <div className='loading loading-form' />
            </div>
            )
          : currentElements().length <= 0
            ? (
              <h4 className='w-100 container-center mt-5'>
                No se encontraron resultados
              </h4>
              )
            : (
              <>
                <Row className='mt-3'>
                  <Col xs={12}>
                    <StyledTable className='table-radius'>
                      <tbody>
                        <StyledTr>
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
                                  onClick={() => {
                                    changeOrderBy(column)
                                  }}
                                >
                                  <span className='dropdown'>
                                    <span
                                      className={
                                      column.isDesc === undefined
                                        ? 'caret-down'
                                        : column.isDesc
                                          ? 'caret-down '
                                          : 'caret-down selected'
                                    }
                                    />
                                  </span>
                                  <span className='dropup'>
                                    <span
                                      className={
                                      column.isDesc === undefined
                                        ? 'caret-up'
                                        : column.isDesc
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
                          {(props.actionRow || !props.hideMultipleOptions) && (
                            <th className='tableHeader' />
                          )}
                        </StyledTr>
                        {currentElements().map((item) => {
                          return (
                            <Item
                  cols={cols}
                  item={item}
                  columnsToShow={columnsToShow}
                  actionRow={props.actionRow}
                  onCheckItem={onCheckItem}
                  hideMultipleOptions={props.hideMultipleOptions}
                  toggleEditModal={props.toggleEditModal}
                  isSelect={selectedItemsId.includes(item.id)}
                  handleSingleButton={props.handleSingleButton}
                />
                          )
                        })}
                      </tbody>
                    </StyledTable>
                  </Col>
                  <Pagination
                    currentPage={currentPage}
                    totalPage={
                  totalPage || Math.ceil(items.length / selectedPageSize)
                }
                    onChangePage={(i) => onChangePage(i)}
                  />
                </Row>
              </>
              )}
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
  border-collapse: separate;
  border-spacing: 0 1em;
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
  pageSize: PropTypes.bool,
  selectedPageSize: PropTypes.number
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
  pageSize: true,
  PageHeading: true,
  isBreadcrumb: true,
  loading: false,
  orderBy: true,
  totalRegistro: 0
}
export default injectIntl(Table)
