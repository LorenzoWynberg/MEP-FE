import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ListPageHeading from '../ListTableHeading'
import Pagination from '../Pagination'
import AddNewModal from '../AddNewModal'
import { Helmet } from 'react-helmet'
import ImageListView from '../ImageListView'
import ThumbListView from '../ThumbListView'
import DataListView from '../DataListView'
import styled from 'styled-components'
import { injectIntl } from 'react-intl'
import { debounce } from 'lodash'
import { showProgress, hideProgress } from 'Utils/progress'
import CustomThumbListView from '../CustomThumbListView'
import {
  Row,
  Col
} from 'reactstrap'

const Table = (props) => {
  const { messages } = props.intl

  const [items, setItems] = useState([])
  const [selectedColumn, setSelectedColumn] = useState()
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItemsId, setSelectedItemsId] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPageSize, setSelectedPageSize] = useState(10)
  const [displayMode, setDisplayMode] = useState()
  const [totalPage, setTotalPage] = useState()
  const [totalItemCount, setTotalItemCount] = useState()
  const [searchValue, setSearchValue] = useState('')
  const [cols, setCols] = useState([])

  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('persist:auth-id') || -1
  )

  const DisplayElement =
    {
      imagelist: ImageListView,
      thumblist: ThumbListView,
      datalist: DataListView
    }[displayMode] || DataListView

  const collect = (props) => {
    return { data: items }
  }

  useEffect(() => {
    setCols(props.columns)
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
    setSelectedColumn(props.columns[0])
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
    showProgress()
    if (searchValue === '') {
      await props.handlePagination(pageNumber, selectedPageSize)
    } else {
      await props.handleSearch(searchValue, selectedPageSize, pageNumber)
    }
    hideProgress()
    setCurrentPage(pageNumber)
  }

  const changePageSize = async (number) => {
    showProgress()
    let totalPage = 0
    if (searchValue !== '') {
      await props.handleSearch(searchValue, number, 1)
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
    await props.handleSearch(value, selectedPageSize, 1)
  }, 700)

  const onSearchKey = async (e) => {
    const { value } = e.target
    showProgress()
    setSearchValue(value)
    if (value !== '') {
      _debounce(value)
    } else {
      await props.handlePagination(1, selectedPageSize)
    }
    setCurrentPage(1)
    hideProgress()
  }

  const onSearching = async (e) => {
    const { value } = e.target
    setSearchValue(value)
  }

  const onSearch = async () => {
    await props.handleSearch(searchValue, selectedPageSize, 1)
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

    setSelectedColumn(
      props.columns.find((item) => item.column === column.column)
    )
    setItems([
      ...items.sort((a, b) => {
        let comparison
        if (column.isNumericField) {
          comparison = {
            string: parseInt(a[column.column]) - parseInt(b[column.column])
          }
        } else {
          comparison = {
            string: a[column.column].localeCompare(b[column.column]),
            date: getTime(b[column.column]) - getTime(a[column.column])
          }
        }
        return column.column === 'date' ? comparison.date : comparison.string
      })
    ])
  }
  const changeDisplayMode = (displayMode) => {
    setDisplayMode(displayMode)
  }
  const endIndex = currentPage * selectedPageSize
  const startIndex = endIndex - selectedPageSize
  const pageSizes = [10, 20, 25]
  const currentElements = () => items
  const havingValidView = () =>
    props.selectDisplayMode === 'thumblist' ||
    props.selectDisplayMode === 'datalist'
  const showHeaders = () =>
    !!currentElements().length && havingValidView() && props.showHeaders

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
              selectDisplayMode={props.selectDisplayMode}
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
              changeDisplayMode={changeDisplayMode}
              actions={props.actions}
              tableName={props.tableName}
              orderOptions={props.orderOptions}
              match={props.match}
              isBreadcrumb={props.isBreadcrumb}
              readOnly={props.readOnly}
              disableSearch={props.disableSearch}
            />
          </>
        )}

        {showHeaders() && (
          <Row className='row-labels'>
            {cols.map((column, i) => {
              return (
                <StyledRow key={`${i}`} cols={cols} width={column.width} paddingLeft={column.paddingLeft}>{column.label}
                  {column.order
                    ? <span className='order' style={{ cursor: 'pointer' }} onClick={() => { changeOrderBy(column) }}>
                      <span className='dropdown'>
                        <span className={column.isDesc === undefined ? 'caret-down' : column.isDesc ? 'caret-down ' : 'caret-down selected'} />
                      </span><span className='dropup'>
                        <span className={column.isDesc === undefined ? 'caret-up' : column.isDesc ? 'caret-up selected' : 'caret-up '} />
                      </span>
                    </span>
                    : null}

                </StyledRow>
              )
            })}
            <StyledRow cols={cols}>
              {props.selectLabel &&
                <p>
                  Seleccionar
                </p>}
            </StyledRow>

          </Row>
        )}
        {props.showHeadersCenter && (
          <Row>
            {props.customThumbList
              ? (
                <>
                  <Col />
                  {props.columns.map((column, i) => {
                    return (
                      <Col
                        key={`${i}`}
                        className='thumb-column-row font-weight-semibold'
                      >
                        <p>
                          {column.label}
                        </p>
                      </Col>
                    )
                  })}
                  <Col>
                    {props.selectLabel &&
                      <p>
                        Seleccionar
                      </p>}
                  </Col>
                </>
                )
              : (
                <div
                  className={`${
                  props.selectDisplayMode === 'formlist' && 'form-table-row px-2'
                } thumb-row d-flex justify-content-between`}
                >
                  {props.columns.map((column, i) => {
                    const _width = column.width
                    return (
                      <div
                        key={`${i}`}
                        className='thumb-column-row font-weight-semibold'
                        style={{ width: `${_width}%` }}
                      >
                        {column.label}
                      </div>
                    )
                  })}
                  <div
                    className='thumb-column-row font-weight-semibold'
                  />
                </div>
                )}
          </Row>
        )}
        <Row className='mt-3'>
          {currentElements().map((product, index) => {
            if (props.customThumbList) {
              return (
                <CustomThumbListView
                  key={product.id}
                  product={product}
                  isSelect={selectedItemsId.includes(product.id)}
                  collect={collect}
                  hideMultipleOptions={props.hideMultipleOptions}
                  onCheckItem={onCheckItem}
                  columns={props.columns}
                  actionRow={props.actionRow}
                  toggleModal={props.toggleEditModal}
                  index={index}
                  handleCardClick={props.handleCardClick}
                />
              )
            } else {
              return (
                <DisplayElement
                  key={product.id}
                  product={product}
                  isSelect={selectedItemsId.includes(product.id)}
                  collect={collect}
                  hideMultipleOptions={props.hideMultipleOptions}
                  onCheckItem={onCheckItem}
                  columns={props.columns}
                  actionRow={props.actionRow}
                  // {
                  //   product.showActionRow || product.showActionRow === undefined
                  //     ? props.actionRow
                  //     : null
                  // }
                  toggleModal={props.toggleEditModal}
                  index={index}
                />
              )
            }
          })}{' '}
          {!props.loading && currentElements().length <= 0 && (
            <h4 className='w-100 container-center mt-5'>
              No se encontraron resultados
            </h4>
          )}
          {props.loading && (
            <div className='w-100 container-center  mt-5'>
              <div className='loading loading-form' />
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onChangePage={(i) => onChangePage(i)}
          />
        </Row>
        {props.modalOpen && (
          <AddNewModal
            title={`${messages['label.add']} ${messages[props.tableName]} `}
            toggleModal={props.toggleModal}
            modalOpen={props.modalOpen}
            modalfooter={props.modalfooter}
            loading={props.loading}
          >
            {props.children}
          </AddNewModal>
        )}

        {props.editModalOpen && (
          <AddNewModal
            title={`${messages['label.edit']} ${messages[props.tableName]}`}
            toggleModal={props.toggleEditModal}
            modalOpen={props.editModalOpen}
            modalfooter={props.modalfooter}
            loading={props.loading}
          >
            {props.children}
          </AddNewModal>
        )}
      </div>
    </>
  )
}

const StyledRow = styled.b`
    padding-left: ${props => props.paddingLeft ? props.paddingLeft : 0};
    width: ${props => props.width ? props.width : 100 / (props.cols.length + 1)}%;
    text-align: left;
    @media (max-width: 992px) {
      display: none;
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
