import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ListPageHeading from './ListTableHeading'
import Pagination from './Pagination'
import AddNewModal from './AddNewModal'
import { Helmet } from 'react-helmet'
import ImageListView from './ImageListView'
import ThumbListView from './ThumbListView'
import FormListView from './FormListView'
import DataListView from './DataListView'
import DataListViewBuscador from 'Components/buscador-table/_partials/DataListViewBuscador'
import { Row, Col } from 'reactstrap'
import search from 'Utils/search'
import styled from 'styled-components'
import { injectIntl } from 'react-intl'

import CustomThumbListView from './CustomThumbListView'

/*
**********************************************
Acerca de este componente
Este componente recibe cuatro props, una llamada data (que debe ser un array), otra llamada actions (que tambien es un array), otra llamda match que recibe el props.match, y tableName que recibe el nombre que de la tabla que se muestra.
Y tambien recive el props.children, que sería el contenido del modal.
props.children (ejemplo):
  <div>
    <input/>
  </div>
match:
  props.match
tableName: 'nombre de la  tabla'
Data: como se puede intuir recibe tus datos, en forma de array, Y los renderiza.
Actions: Recibe las acciones que este componente deberá ejecutar. deben estructurarse de la siguiente manera:
{
  actionName: ''
  //recibe un string el cual será "la forma en la que se verá tu accion para el usuario." Ejemplo: si tu acción se encarga de borrar datos, se debería llamar delete
  actionFunction:
  //recibe la exprecion de una función, una vez el usuario haga click sobre el nombre de una de tus acciones tu función reibirá el id del objeto seleccionado.
}
Este componente está optimizado para ser lo más reusable posible, por lo que se recomienda no manipularlo si no es realmente necesario
**********************************************
*/

const Table = (props) => {
  const { messages } = props.intl

  const [items, setItems] = useState([])

  const [cols, setCols] = useState([])

  const [selectedColumn, setSelectedColumn] = useState(
    props.columns && props.columns[0]
  )
  const [orderBy, setOrderBy] = useState()

  const [selectAll, setSelectAll] = useState(false)
  const [selectedItemsId, setSelectedItemsId] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPageSize, setSelectedPageSize] = useState(10)
  const [displayMode, setDisplayMode] = useState()
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('persist:auth-id') || -1
  )

  const DisplayElement =
    {
      imagelist: ImageListView,
      thumblist: ThumbListView,
      datalist: props.esBuscador ? DataListViewBuscador : DataListView,
      formlist: FormListView
    }[displayMode] || DataListView

  const collect = (props) => {
    return { data: items }
  }

  useEffect(() => {
    setDisplayMode(props.selectDisplayMode)
  }, [props.selectDisplayMode])

  useEffect(() => {
    setItems(props.data)
    return () => {
      setItems(props.data)
    }
  }, [props.data])

  useEffect(() => {
    setCols(props.columns)
    return () => {
      setCols(props.columns)
    }
  }, [props.columns])

  useEffect(() => {
    setItems(props.data)
  }, [props])

  useEffect(() => {
    setSelectedPageSize(props.selectedPageSize || selectedPageSize)
    return () => {
      setSelectedPageSize(props.selectedPageSize || selectedPageSize)
    }
  }, [props.selectedPageSize])

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

  const onChangePage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const changePageSize = (number) => {
    setSelectedPageSize(number)
  }

  // ESTE CODIGO FALLA EN LOCAL PERO NO EN EL SERVIDOR.
  // CUALQUIER CAMBIO HECHO A ESTE METODO DEBE DE MANTENER LA MISMA FUNCIONALIDAD QUE EN EL AMBIENTE DE DESARROLLO
  //= =============================
  const onSearchKey = async (e) => {
    const { value } = e.target
    setItems(search(value).in(props.data, props.useAllSearchParams ? props.columns.map(item => item.column) : selectedColumn.column))
  }
  //= ==============================
  const changeDisplayMode = (displayMode) => {
    setDisplayMode(displayMode)
  }

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

    setCols(cols.map(col => {
      if (col.column === column.column) {
        return { ...col, isDesc: col.isDesc === undefined ? true : !col.isDesc }
      } else {
        return { ...col, isDesc: undefined }
      }
    }))

    const _selectedColumn = cols.find((item) => item.column === column.column)

    setSelectedColumn(_selectedColumn)

    setItems([
      ...items.sort((a, b) => {
        let comparison
        if (column.isNumericField) {
          comparison = {
            string: _selectedColumn.isDesc ? parseInt(a[column.column]) - parseInt(b[column.column]) : parseInt(b[column.column]) - parseInt(a[column.column])
          }
        } else {
          const aa = a[column.column] == null ? '' : a[column.column]
          const bb = b[column.column] == null ? '' : b[column.column]
          comparison = {
            string: _selectedColumn.isDesc ? bb.localeCompare(aa) : aa.localeCompare(bb),
            date: _selectedColumn.isDesc ? getTime(bb) - getTime(aa) : getTime(aa) - getTime(bb)
          }
        }
        return column.column === 'date' ? comparison.date : comparison.string
      })
    ])
  }

  const endIndex = currentPage * selectedPageSize
  const startIndex = endIndex - selectedPageSize
  const totalItemCount = items.length
  const totalPage = Math.ceil(items.length / selectedPageSize)
  const pageSizes = [10, 20, 25]
  const currentElements = () => {
    if (items.length >= selectedPageSize) {
      return items.slice(startIndex, endIndex)
    }
    return items.slice()
  } // Con items.slice funciona el buscador y con props.data.slice funciona la edicion. El cambio de uno inutiliza al otro
  const havingValidView = () =>
    props.selectDisplayMode === 'thumblist' ||
    props.selectDisplayMode === 'datalist' ||
    props.selectDisplayMode === 'formlist' ||
    props.selectDisplayMode === 'imageListView'
  const showHeaders = () =>
    !!currentElements().length && havingValidView() && props.showHeaders

  return (
    <>
      <Helmet>
        <title>{messages[props.tableName]}</title>
      </Helmet>
      <div className='table-box'>
        {props.PageHeading && (
          <ListPageHeading
            readOnly={props.readOnly}
            selectDisplayMode={props.selectDisplayMode}
            trigger={() => {
              setSelectAll(false)
              setSelectedItemsId([])
            }}
            setSelectAll={setSelectAll}
            items={currentElements()}
            selectedOrderOption={selectedColumn}
            changeOrderBy={changeOrderBy}
            itemsHook={[items, setItems]}
            orderBy={props.orderBy}
            products={currentElements()}
            selectAll={selectAll}
            heading={props.tableName}
            labelSearch={props.labelSearch}
            handleChangeSelectAll={handleChangeSelectAll}
            changePageSize={changePageSize}
            selectedPageSize={selectedPageSize}
            totalItemCount={totalItemCount}
            startIndex={startIndex}
            endIndex={endIndex}
            roundedStyle={props.roundedStyle}
            disableSearch={props.disableSearch}
            selectedItemsLength={
              props.selectedItemsId ? props.selectedItemsId.length : 0
            }
            itemsLength={items ? items.length : 0}
            hideMultipleOptions={props.hideMultipleOptions}
            onSearchKey={onSearchKey}
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
            title={props.title}
          />
        )}

        {showHeaders() && (
          <Row className='row-labels'>
            {cols.map((column, i) => {
              return (
                <StyledRow key={`${i}`} cols={cols} width={column.width} paddingLeft={column.paddingLeft} paddingR={i === 0}>{column.label}
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

        <Row>
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
                  showMenu={props.showMenu}
                  columns={props.columns}
                  actionRow={props.actionRow}
                  // {
                  //   product.showActionRow || product.showActionRow === undefined
                  //     ? props.actionRow
                  //     : null
                  // }
                  toggleModal={props.toggleEditModal}
                  index={index}
                  esBuscador={props.esBuscador}
                />
              )
            }
          }
          )}{' '}
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
    margin-right: 1rem;
    @media (max-width: 992px) {
      display: none;
    }
  `

Table.propTypes = {
  listView: PropTypes.bool,
  dataListView: PropTypes.bool,
  formListView: PropTypes.bool,
  imageListView: PropTypes.bool,
  search: PropTypes.bool,
  orderBy: PropTypes.bool,
  loading: PropTypes.bool,
  isBreadcrumb: PropTypes.bool,
  showHeaders: PropTypes.bool,
  showHeadersCenter: PropTypes.bool,
  editModalOpen: PropTypes.bool,
  modalfooter: PropTypes.bool,
  actionRow: PropTypes.array,
  orderOptions: PropTypes.func,
  PageHeading: PropTypes.bool,
  actions: PropTypes.array,
  toggleEditModal: PropTypes.func,
  toggleModal: PropTypes.func,
  handleSearch: PropTypes.func,
  selectedPageSize: PropTypes.number,
  esBuscador: PropTypes.bool,
  title: PropTypes.string
}
Table.defaultProps = {
  listView: false,
  actionRow: [],
  orderOptions: () => [],
  actions: [],
  dataListView: false,
  formListView: false,
  imageListView: false,
  editModalOpen: false,
  modalfooter: false,
  search: true,
  loading: false,
  isBreadcrumb: true,
  showHeaders: true,
  showHeadersCenter: true,
  orderBy: true,
  PageHeading: true,
  toggleEditModal: () => {},
  toggleModal: () => {},
  handleSearch: () => {},
  selectedPageSize: 10,
  esBuscador: false,
  title: ''
}
export default React.memo(injectIntl(Table))
