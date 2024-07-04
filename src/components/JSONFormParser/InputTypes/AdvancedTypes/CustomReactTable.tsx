import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  ModalBody,
  ModalHeader,
  Modal,
  Row,
  Button,
  Input,
  CustomInput
} from 'reactstrap'
import { useSelector } from 'react-redux'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@mui/material/Tooltip'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import VisibilityIcon from '@material-ui/icons/Visibility'

import { TableReactImplementation } from 'Components/TableReactImplementation'
import { listasPredefinidas } from '../../utils/Options.js'
import colors from 'Assets/js/colors'

interface ILocaleStae {
    selects: {
        [key: string]: Array<any>
    }
}

interface IProps {
    editable: boolean
    field: {
        id: string
        options?: string | Array<any>
        config?: {
            modalSize: string
            columns: Array<any>
            avoidSearch: boolean
            title: string
            showAddButton
            onSubmitAddButton: () => void
            hideMultipleOptions: boolean
            pageSize: number
            actions: Array<any>
            select: boolean
            delete: boolean
            edit: boolean
            avoidFirstColDuplicated: boolean
            handleChangeSelectAll: () => void
        }
        modalTitle?: string
    }
    handleTableDataChange: (e, i) => void
    tablesData: any
    data: Array<any>
    columns: Array<any>
}

const CustomReactTable = ({
  field,
  editable,
  data,
  columns,
  tablesData,
  handleTableDataChange
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [cachedData, setCachedData] = useState(tablesData && tablesData[field.id] ? tablesData[field.id] : [])
  const state = useSelector((store: ILocaleStae) => {
    return {
      selects: store.selects
    }
  })
  const renderOptions = (options: string | Array<any>) => {
    if (!options) {
      return []
    }
    if (Array.isArray(options)) {
      return options.map((option, i) => {
        return { ...option, id: option.value, nombre: option.label }
      })
    }
    if (options.search('FromDB') >= 0) {
      return state.selects[options.substr(0, field.options.length - 6)]
    } else {
      return listasPredefinidas[field.options]?.options.map(
        (option, i) => {
          return {
            nombre: option,
            id: option
          }
        }
      )
    }
  }

  const options = renderOptions(field.options)

  const handleOptionChange = (e, option) => {
    let exist = false
    const { value } = e.target
    let anwsers = cachedData
    const newAnswer = {
      id: option.id,
      columnValues: [{ value: option.nombre }, { value }]
    }
    if (anwsers.length > 0) {
      anwsers = anwsers.map((item) => {
        if (item.id == option.id) {
          exist = true
          return newAnswer
        }
        return item
      })
    }
    !exist && anwsers.push(newAnswer)
    setCachedData(anwsers)
  }
  const handleSave = (multiple = false): boolean | void => {
    if (multiple) {
      handleTableDataChange(cachedData, field.id)
    } else {
      let validationFired: boolean
      if (field.config.avoidFirstColDuplicated) {
        const uniqueElements = tablesData[field.id] || []

        if (uniqueElements.some(el => el.columnValues[0].value == field?.config?.columns[0].value)) {
          validationFired = true
        }
      }

      if (!field?.config?.columns[0].value || !field?.config?.columns[1].value) {
        validationFired = true
      }

      if (validationFired) {
        // handleClick()
        return true
      }

      handleTableDataChange(
        tablesData && tablesData[field.id]
          ? [...tablesData[field.id], data]
          : [data],
        field.id
      )
    }
  }
  const handleDeleteItems = (ids: Array<any>) => {
    handleTableDataChange(
      tablesData[field.id].filter(
        (value) => !ids.includes(value.id)
      ),
      field.id
    )
  }
  const onSubmitAddButton = () => {
    if (field?.config?.onSubmitAddButton) {
      field?.config?.onSubmitAddButton()
    } else if (editable) {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    if (data?.length === 0 && cachedData?.length > 0) {

    }
  }, [data, cachedData])

  const tableData = useMemo(() => {
    if (data?.length > 0 && data[0]?.accessor) {
      return data
    } else if ((data?.length === 0 || !data[0]?.accessor) && tablesData[field.id]?.length > 0) {
      return tablesData[field.id].map((el) => ({
        [columns[0]?.accessor]: el?.columnValues[0]?.value,
        [columns[1]?.accessor]: el?.columnValues[1]?.value,
        id: el?.id
      }))
    } else {
      return []
    }
  }, [data, cachedData, tablesData])

  const tableColumns = useMemo(() => {
    const newColumns = [...columns]
    const actionColumn = newColumns?.find((el) => el?.accessor === 'actions')
    if (field?.config?.actions && !actionColumn) {
      newColumns?.push({
        Header: 'Acciones',
        accessor: 'actions',
        label: 'Acciones',
        column: 'actions',
        Cell: ({ row }) => {
          return (
            <div className='d-flex justify-content-center align-items-center'>
              {
                                field?.config?.select && (
                                  <>
                                    <CustomInput
                                      className='custom-checkbox mb-0 d-inline-block mr-2'
                                      type='checkbox'
                                      id='checkAll'
                                      style={{
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => {
                                        if (editable) {
                                          if (selectedIds?.includes(row?.original?.id)) {
                                            setSelectedIds(selectedIds?.filter((el) => el !== row?.original?.id))
                                          } else {
                                            setSelectedIds([...selectedIds, row?.original?.id])
                                          }
                                        }
                                      }}
                                      checked={selectedIds?.includes(row?.original?.id)}
                                    />
                                  </>
                                )
                            }
              {
                                field?.config?.delete && (
                                  <Tooltip title='Eliminar'>
                                    <DeleteIcon
                                      style={{
                                        fontSize: 25,
                                        color: colors.darkGray,
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => {
                                        if (editable) {
                                          handleDeleteItems([row.original?.id])
                                        }
                                      }}
                                    />
                                  </Tooltip>
                                )
                            }
            </div>
          )
        }
      })
    }
    return newColumns
  }, [tableData, field?.config, selectedIds])
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        size={field?.config?.modalSize || 'lg'}
      >
        <ModalHeader>
          {field?.modalTitle}
        </ModalHeader>

        <ModalBody>
          {field.options && (
            <ItemsTable>
              <tr>
                {field.config.columns.map((column, i) => {
                  return <th>{column.Header}</th>
                })}
                {options.some(el => el.descripcion) && <th>Descripción</th>}
              </tr>
              {options.map((option, i) => {
                return (
                  <tr>
                    <td>
                        <Input
                            type='number'
                            min={0}
                            value={
                                                    cachedData.find(
                                                      (item) => item.id == option.id
                                                    )?.columnValues[1].value
                                                }
                            onKeyPress={(e) => {
                                if ([101, 69, 44, 45, 46].includes(e.charCode)) {
                                  e.preventDefault()
                                }
                              }}
                            onChange={(e) => {
                                handleOptionChange(e, option)
                              }}
                          />
                      </td>
                    <td>{option.nombre.toUpperCase()}</td>
                    {options.some(el => el.descripcion) && <td>{option.descripcion}</td>}
                  </tr>
                )
              })}
            </ItemsTable>
          )}
          <br />
          <Row className='d-flex justify-content-center align-items-center'>
            <CenteredCol xs={12}>
              <Button
                color='primary'
                outline
                onClick={() => {
                  if (editable) {
                    setIsOpen(false)
                    setCachedData([])
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                color='primary'
                onClick={() => {
                  if (editable) {
                    const avoidToggle = handleSave(options.length !== 0)
                    if (!avoidToggle) {
                      setIsOpen(false)
                      setCachedData([])
                    }
                  }
                }}
              >
                Guardar
              </Button>
            </CenteredCol>
          </Row>
        </ModalBody>
      </Modal>
      {field?.config?.title && (
        <h4>{field?.config?.title}</h4>
      )}
      <TableReactImplementation
        avoidSearch={Boolean(field?.config?.avoidSearch)}
        columns={Array.isArray(tableColumns) ? tableColumns : []}
        data={Array.isArray(tableData) ? tableData : []}
        showAddButton={field?.config?.showAddButton}
        onSubmitAddButton={onSubmitAddButton}
        hideMultipleOptions={field?.config?.hideMultipleOptions}
        pageSize={field?.config?.pageSize || 10}
        handleChangeSelectAll={field.config?.handleChangeSelectAll}
        actions={Array.isArray(field.config?.actions)
          ? field.config?.actions
          : [{
              actionName: 'Eliminar',
              actionFunction: () => handleDeleteItems(selectedIds)
            }]}
      />
    </>
  )
}

const ItemsTable = styled.table`
  overflow: hidden;
  margin: 0.5rem;
  width: 100%;
  height: 100%;
  td, th {
    padding: 5px;
  }
`
const CenteredCol = styled.td`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;

  button {
    margin: 0.5rem;
  }
`

export default CustomReactTable
