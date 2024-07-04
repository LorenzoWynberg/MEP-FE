import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ListPageHeading from './ListTableHeading'
import Pagination from '../Pagination'
import AddNewModal from './AddNewModal'
import { Helmet } from 'react-helmet'
import ImageListView from '../ImageListView'
import ThumbListView from '../ThumbListView'
import DataListView from './DataListView'
import { Row } from 'reactstrap'
import search from 'Utils/search'
import styled from 'styled-components'
import { injectIntl } from 'react-intl'

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

  const [items, setItems] = useState(props.data)
  const [selectedColumn, setSelectedColumn] = useState(props.columns && props.columns[0])
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItemsId, setSelectedItemsId] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPageSize, setSelectedPageSize] = useState(10)
  const [displayMode, setDisplayMode] = useState()
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('persist:auth-id') || -1)

  const DisplayElement = ({
    imagelist: ImageListView,
    thumblist: ThumbListView,
    datalist: DataListView
  })[displayMode] || DataListView

  const collect = (props) => {
    return { data: items }
  }

  useEffect(() => {
    setItems(props.data)
    return () => {
      setItems(props.data)
    }
  }, [props.data])

  const onCheckItem = (id) => {
    const idIndex = selectedItemsId.indexOf(id)
    if (idIndex > -1) selectedItemsId.splice(idIndex, 1)
    else selectedItemsId.push(id)
    setSelectedItemsId([...selectedItemsId])
  }

  const handleChangeSelectAll = () => {
    if (selectAll) {
      items.map(x => addSelectedIds(x.id))
      setSelectedItemsId([])
      setSelectAll(false)
    } else {
      items.map(x => addSelectedIds(x.id))
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

  const onSearchKey = async (e) => {
    const { value } = e.target
    setItems(search(value).in(props.data, selectedColumn.column))
  }

  const changeDisplayMode = (displayMode) => {
    setDisplayMode(displayMode)
  }

  const addSelectedIds = (id) => {
    if (selectedItemsId.indexOf(id) >= 0) {
      return selectedItemsId
    } else {
      id !== currentUser &&
        selectedItemsId.push(id)
      return selectedItemsId
    }
  }

  const changeOrderBy = (column) => {
    const formatDate = date => date.split('.').reverse().join('-')
    const getDate = date => new Date(formatDate(date))
    const getTime = date => getDate(date).getTime()
    setSelectedColumn(props.columns.find(item => item.column === column.column))
    setItems([...items.sort((a, b) => {
      let comparison
      if (column.isNumericField) {
        comparison = {
          string: parseInt(a[column.column]) - parseInt(b[column.column]),
          date: getTime(b[column.column]) - getTime(a[column.column])
        }
      } else {
        comparison = {
          string: a[column.column].localeCompare(b[column.column]),
          date: getTime(b[column.column]) - getTime(a[column.column])
        }
      }
      return column.column === 'date' ? comparison.date : comparison.string
    })])
  }

  const endIndex = currentPage * selectedPageSize
  const startIndex = endIndex - selectedPageSize
  const totalItemCount = items.length
  const totalPage = Math.ceil(items.length / selectedPageSize)
  const pageSizes = [10, 20, 25]
  const currentElements = () => items.slice(startIndex, endIndex) // Con items.slice funciona el buscador y con props.data.slice funciona la edicion. El cambio de uno inutiliza al otro
  const havingValidView = () => props.selectDisplayMode === 'thumblist' || props.selectDisplayMode === 'datalist'
  const showHeaders = () => !!currentElements().length && havingValidView() && props.showHeaders

  return (
    <>
      <Helmet>
        <title>{messages[props.tableName]}</title>
      </Helmet>
      <div className='table-box'>
        <ListPageHeading
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
          products={currentElements()}
          selectAll={selectAll}
          heading={props.tableName}
          handleChangeSelectAll={handleChangeSelectAll}
          changePageSize={changePageSize}
          selectedPageSize={props.selectedPageSize}
          totalItemCount={totalItemCount}
          startIndex={startIndex}
          endIndex={endIndex}
          selectedItemsLength={props.selectedItemsId ? props.selectedItemsId.length : 0}
          itemsLength={items ? items.length : 0}
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
        />
        {
          showHeaders() && (
            <Row className='row-labels'>
              {
                props.columns.map((column, i) => {
                  const StyledRow = styled.b`
                      padding-left: ${column.paddingLeft ? column.paddingLeft : 0};
                      width: ${column.width}%;
                      text-align: center;
                      @media (max-width: 992px) {
                        display: none;
                      }`
                  return (
                    <StyledRow key={`${i}`}>
                      {column.label}
                    </StyledRow>
                  )
                })
              }
            </Row>
          )
        }
        <Row>
          {currentElements().map((product, index) =>
            <DisplayElement
              key={product.id}
              product={product}
              isSelect={selectedItemsId.includes(product.id)}
              collect={collect}
              onCheckItem={onCheckItem}
              columns={props.columns}
              actionRow={props.actionRow}
              toggleModal={props.toggleEditModal}
              index={index}
            />
          )}{' '}
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onChangePage={i => onChangePage(i)}
          />
        </Row>
        {props.modalOpen &&
          <AddNewModal
            title={`${messages['label.add']} ${messages[props.tableName]} `}
            toggleModal={props.toggleModal}
            modalOpen={props.modalOpen}
            modalfooter={props.modalfooter}
          >
            {props.children}
          </AddNewModal>}

        {props.editModalOpen &&
          <AddNewModal
            title={`${messages['label.edit']} ${messages[props.tableName]}`}
            toggleModal={props.toggleEditModal}
            modalOpen={props.editModalOpen}
            modalfooter={props.modalfooter}
          >
            {props.children}
          </AddNewModal>}
      </div>
    </>
  )
}
Table.propTypes = {
  listView: PropTypes.bool,
  dataListView: PropTypes.bool,
  imageListView: PropTypes.bool,
  search: PropTypes.bool,
  orderBy: PropTypes.bool
}
Table.defaultProps = {
  listView: false,
  dataListView: false,
  imageListView: false,
  search: true,
  orderBy: true
}
export default injectIntl(Table)
