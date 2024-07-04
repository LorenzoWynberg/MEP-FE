import React, { useState, useEffect } from 'react'
import {
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  CustomInput,
  ButtonDropdown,
  Row
} from 'reactstrap'
import Pagination from './Pagination'
import AddNewModal from './AddNewModal'
import search from 'Utils/search'
import IntlMessages from 'Helpers/IntlMessages'
import { Colxx } from '../common/CustomBootstrap'

const CustomTable = (props) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPageSize, setSelectedPageSize] = useState(10)
  const [selectedIdList, setSelectedIdList] = useState([])
  const [items, setItems] = useState(props.data)
  const [selectedColumn, setSelectedColumn] = useState(props.tableRows && props.tableRows[0])
  const [selectedOrderOption, setSelectedOrderOption] = useState(props.orderOptions()[0])
  const [selectAll, setSelectAll] = useState(false)
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false)

  useEffect(() => {
    setItems(props.data)
    return () => {
      setItems(props.data)
    }
  }, [props.data])

  const {
    data,
    toggleModal,
    tableRows,
    modalOpen,
    title,
    loading,
    messages,
    orderOptions,
    deleteButton
  } = props

  const endIndex = currentPage * selectedPageSize
  const startIndex = endIndex - selectedPageSize
  const currentElements = () => items.slice(startIndex, endIndex)
  const totalPage = Math.ceil(items.length / selectedPageSize)

  const onChangePage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const changeOrderBy = (column) => {
    const formatDate = date => date.split('.').reverse().join('-')
    setSelectedOrderOption(column)
    const getDate = date => new Date(formatDate(date))
    const getTime = date => getDate(date).getTime()
    setSelectedColumn(props.tableRows.find(item => item.row === column.column))
    setItems([...items.sort((a, b) => {
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
    })])
  }

  const onSearchKey = async (e) => {
    const { value } = e.target
    setItems(search(value).in(props.data, selectedColumn.row))
  }

  const toggleSplit = () => {
    setDropdownSplitOpen(!dropdownSplitOpen)
  }

  const onCheckItem = (id) => {
    const idIndex = selectedIdList.indexOf(id)
    if (idIndex > -1) selectedIdList.splice(idIndex, 1)
    else selectedIdList.push(id)
    setSelectedIdList([...selectedIdList])
    props.handleSelecionarEstudiantes([...selectedIdList])
  }

  const addSelectedIds = (id) => {
    if (selectedIdList.indexOf(id) >= 0) {
      return selectedIdList
    } else {
      selectedIdList.push(id)
      return selectedIdList
    }
  }

  const handleChangeSelectAll = () => {
    if (selectAll) {
      currentElements().map(x => addSelectedIds(x.id))
      setSelectedIdList([])
      setSelectAll(false)
    } else {
      items.map(x => addSelectedIds(x.id))
      setSelectAll(true)
      document.activeElement.blur()
      return selectAll
    }
    setSelectAll(!selectAll)
  }

  return (
    <>
      <Row>
        <Colxx xxs='12'>
          <div className='mb-2'>
            <h1>{props.title}</h1>
            <div className='text-zero top-right-button-container'>
              {props.showMultipleOptions &&
                <ButtonDropdown
                  isOpen={dropdownSplitOpen}
                  toggle={toggleSplit}
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
                    {props.actions && props.actions.map((action, index) => {
										  return (
  <DropdownItem
    key={index} onClick={() =>
												  action.actionFunction(selectedIdList)}
  >
    <IntlMessages id={action.actionName} />
  </DropdownItem>
										  )
                  })}
                  </DropdownMenu>
                </ButtonDropdown>}
            </div>
          </div>
        </Colxx>
      </Row>
      <Collapse
        isOpen
        className='d-md-block'
        id='displayOptions'
      >
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
      </Collapse>
      <div className={`registered-table mb-5 ${props.className}`}>
        <Table responsive>
          <thead>
            <tr>
              {tableRows[0] && <th>{[tableRows[0].label]}</th>}
              {tableRows[1] && <th>{[tableRows[1].label]}</th>}
              {tableRows[2] && <th>{[tableRows[2].label]}</th>}
              {tableRows[3] && <th>{[tableRows[3].label]}</th>}
              {tableRows[4] && <th>{[tableRows[4].label]}</th>}
              {tableRows[5] && <th>{[tableRows[5].label]}</th>}
              {tableRows[6] && <th>{[tableRows[6].label]}</th>}
              {tableRows[7] && <th>{[tableRows[7].label]}</th>}
              {tableRows[8] && <th>{[tableRows[8].label]}</th>}
              {tableRows[9] && <th>{[tableRows[9].label]}</th>}
              <th>{'  '}</th>
            </tr>
          </thead>
          <tbody>
            {items && currentElements().map((item, index) => {
						  return (
  <tr key={index}>
    {tableRows[0] && <th scope='row'>{item[tableRows[0].row]}</th>}
    {tableRows[1] && <td>{item[tableRows[1].row]}</td>}
    {tableRows[2] && <td>{item[tableRows[2].row]}</td>}
    {tableRows[3] && <td>{item[tableRows[3].row]}</td>}
    {tableRows[4] && <td>{item[tableRows[4].row]}</td>}
    {tableRows[5] && <td>{item[tableRows[5].row]}</td>}
    {tableRows[6] && <td>{item[tableRows[6].row]}</td>}
    {tableRows[7] && <td>{item[tableRows[7].row]}</td>}
    {tableRows[8] && <td>{item[tableRows[8].row]}</td>}
    {tableRows[9] && <td>{item[tableRows[9].row]}</td>}
    {deleteButton && <td>{props.handleDeleteOption !== undefined ? <>{props.handleDeleteOption(item) ? <Badge color='danger' onClick={() => deleteButton(item)}>Eliminar</Badge> : <></>}</> : <Badge color='danger' onClick={() => deleteButton(item)}>Eliminar</Badge>}</td>}
    <td><Badge color='primary' onClick={() => toggleModal(item)}>ver</Badge></td>
    {
										props.showMultipleOptions &&
  <td>
    <div
      className='mr-3 mb-2 d-inline-block float-md-left cursor-pointer'
      onClick={() => onCheckItem(item.id)}
    >
      <CustomInput
        className='item-check mb-0 '
        type='checkbox'
        checked={selectedIdList.includes(item.id)}
        id={`check_${item.id}`}
        onChange={() => { }}
        label=''
      />
    </div>
  </td>
									}
  </tr>
						  )
            })}
          </tbody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onChangePage={i => onChangePage(i)}
        />
        {modalOpen &&
          <AddNewModal
            title={title}
            toggleModal={toggleModal}
            modalOpen={modalOpen}
            loading={loading}
            modalfooter={!props.hideFooter}
            buttonDisbled={!!props.buttonDisbled}
          >
            {props.children}
          </AddNewModal>}
      </div>
    </>
  )
}

export default CustomTable
