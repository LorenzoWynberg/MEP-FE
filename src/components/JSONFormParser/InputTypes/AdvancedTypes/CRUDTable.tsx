import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Button,
  Row,
  Label,
  Input,
  ButtonDropdown,
  CustomInput,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
  , ModalBody, ModalHeader, Modal
} from 'reactstrap'
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { guidGenerator } from '../../../../utils/GUIDGenerator'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { TooltipLabel } from '../../styles.tsx'
import { useSelector } from 'react-redux'
import { listasPredefinidas } from '../../utils/Options'

import Datetime from 'react-datetime'
import useNotification from 'Hooks/useNotification'
import { maxLengthString } from '../../../../utils/maxLengthString'
import Pagination from '../../../table/Pagination'
import moment from 'moment'

import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    height: '30rem',
    width: '40rem',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

const CRUDTable = (props) => {
  const { t } = useTranslation()
  const [cachedData, setCachedData] = useState(props.tablesData && props.tablesData[props.field.id] ? props.tablesData[props.field.id] : [])
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [snackbar, handleClick] = useNotification()
  const [currentPage, setCurrentPage] = useState(1)
  const [snackbarContent, setSnackbarContent] = useState({
    variant: '',
    msg: ''
  })
  const [items, setItems] = useState(props.tablesData
    ? props.tablesData[props.field.id]
      ? props.tablesData[props.field.id]
      : []
    : [])
  const [data, setData] = useState({
    id: guidGenerator(),
    columnValues: props.field.config.columns
  })

  const state = useSelector((store) => {
    return {
      selects: store.selects
    }
  })
  const classes = useStyles()

  useEffect(() => {
    if (props.tablesData && props.tablesData[props.field.id]) {
      setItems(props.tablesData
        ? props.tablesData[props.field.id]
          ? props.tablesData[props.field.id].sort((a, b) => {
            if (typeof a.columnValues[1].value === 'string') return 0
            if (a.columnValues[1].value > b.columnValues[1].value) return -1
            if (a.columnValues[1].value < b.columnValues[1].value) return 1
            return 0
          })
          : []
        : [])
      setCachedData(props.tablesData[props.field.id])
    }
    return () => {
      setCachedData(props.tablesData[props.field.id] || [])
      setData({
        id: guidGenerator(),
        columnValues: props.field.config.columns
      })
    }
  }, [props.tablesData])

  const handleDeleteItems = (ids: array) => {
    props.handleTableDataChange(
      props.tablesData[props.field.id].filter(
        (value) => !ids.includes(value.id)
      ),
      props.field.id
    )
  }

  const handletableChange = (value, idx, date = false) => {
    if (date) {
      setData({
        ...data,
        columnValues: data.columnValues.map((column, i) => {
          if (idx === i) {
            return { ...column, value }
          }
          return column
        })
      })
    } else {
      setData({
        ...data,
        columnValues: data.columnValues.map((column, i) => {
          if (idx === i) {
            return { ...column, value }
          }
          return column
        })
      })
    }
  }

  const toggle = (data = []) => {
    setIsOpen(!isOpen)
    setCachedData(data)
  }

  const eventHandler = (cb) => {
    if (props.editable) {
      cb()
    }
  }

  const toggleSplit = () => {
    setDropdownSplitOpen(!dropdownSplitOpen)
  }

  const handleSave = (multiple = false) : boolean | void => {
    
    if (multiple) {
      props.handleTableDataChange(cachedData, props.field.id)
    } else {
      let validationFired : boolean
      if (props.field.config.avoidFirstColDuplicated) {
        const uniqueElements = props.tablesData[props.field.id] || []

        if (uniqueElements.some(el => el.columnValues[0].value == data.columnValues[0].value)) {
          validationFired = true
        }
      }

      if (!data.columnValues[0].value || !data.columnValues[1].value) {
        validationFired = true
      }

      if (validationFired) {
        handleClick()
        return true
      }
      const aux =  props.tablesData ? props.tablesData[props.field.id] : []
      const index = aux.findIndex((el) => el?.id === data?.id)
      if (index !== -1) {
        aux[index] = data
        props.handleTableDataChange(aux)
        return 
      }
      props.handleTableDataChange(
        props.tablesData && props.tablesData[props.field.id]
          ? [...props.tablesData[props.field.id], data]
          : [data],
        props.field.id
      )
    }
  }

  const renderOptions = (options) => {
    if (!options) {
      return []
    }
    if (Array.isArray(options)) {
      return props.options.map((option, i) => {
        return { ...option, id: option.value, nombre: option.label }
      })
    }
    if (options.search('FromDB') >= 0) {
      return state.selects[options.substr(0, props.field.options.length - 6)]
    } else {
      return listasPredefinidas[props.field.options]?.options.map(
        (option, i) => {
          return {
            nombre: option,
            id: option
          }
        }
      )
    }
  }
  const options = renderOptions(props.field.options)

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

  const endIndex = currentPage * 6
  const startIndex = endIndex - 6

  const currentElements = () => {
    return items.slice(startIndex, endIndex)
  }
  return (
    <ItemsTable>
      <TooltipLabel title field={props.field} />
      <ButtonContainer>
        <Button
          color='primary'
          disabled={!props.editable}
          onClick={() => {
            eventHandler(() => toggle(props.tablesData && props.tablesData[props.field.id] ? [...props.tablesData[props.field.id]] : []))
          }}
        >
          {
            props.field?.config?.btnSubmitLangKey
              ? t(props.field?.config?.btnSubmitLangKey, 'Agregar')
              : props.field.btnSubmitText
          }
        </Button>
        <StyledButtonDropdown
          isOpen={dropdownSplitOpen}
          toggle={toggleSplit}
          disabled={!props.editable}
        >
          <div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
            <CustomInput
              className='custom-checkbox mb-0 d-inline-block'
              type='checkbox'
              id='checkAll'
              disabled={!props.editable}
              onClick={() => {
                if (props.editable) {
                  if (
                    props.tablesData[props.field.id] &&
                    selectedIds.length ===
                      props.tablesData[props.field.id].length
                  ) {
                    setSelectedIds([])
                  } else {
                    setSelectedIds(
                      props.tablesData[props.field.id].map(
                        (element) => element.id
                      )
                    )
                  }
                }
              }}
              checked={
                props.tablesData[props.field.id] &&
                selectedIds.length ===
                  props.tablesData[props.field.id].length &&
                selectedIds.length > 0
              }
            />
          </div>
          <DropdownToggle
            caret
            color='primary'
            className='dropdown-toggle-split btn-lg'
            disabled={!props.editable}
          />
          <DropdownMenu right>
            <DropdownItem
              onClick={() => {
                handleDeleteItems(selectedIds)
                setSelectedIds([])
              }}
            >
              {t('expediente_ce>informacion_general>informacion>extensiones>eliminar', 'Eliminar')}
            </DropdownItem>
          </DropdownMenu>
        </StyledButtonDropdown>
      </ButtonContainer>
      <br />
      <table style={{ width: '100%' }}>
        <tr>
          {props.field.config.columns?.map((column) => (
            <th>
              {t(column.langKey, column.titulo)}
            </th>
          ))}
          <th />
        </tr>
        {currentElements().map((element, i) => (//here comes the change
              <TableItem
                isFirst={i === 0}
                item={element}
                avoidCutText={props.field.config.avoidCutText}
                handleDeleteItems={handleDeleteItems}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
                eventHandler={eventHandler}
                options={props.field.options}
                toggle={toggle}
                handleEdit={(item) => {
                  setData(item)
                  toggle([item])
                }}
              />
            ))}
      </table>
      <Pagination
        currentPage={currentPage}
        totalPage={Math.ceil(items.length / 6)}
        onChangePage={(i) => setCurrentPage(i)}
      />

      <Modal isOpen={isOpen} onClose={() => toggle()} className={classes.modal} size={props.field.config.columns.some(el => el.type) ? 'md' : 'lg'}>
        {snackbar('error', `${props.field.config.avoidFirstColDuplicated ? 'Solo puede haber un registro del mismo tipo y ' : ''}todos los campos son requeridos`)}
        <ModalHeader toggle={() => toggle()}>
          {props.field.modalTitle}
        </ModalHeader>
        <ModalBody>
          {props.field.options
            ? (
              <ItemsTable>
                <tr>
                  {props.field.config.columns.map((column, i) => {
                    return <th>{t(column.langKey, t(column.langKey, column.titulo))}</th>
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
              )
            : (<div style={{ display: 'flex', width: '100%' }}>
              {props.field.config.columns.map((column, i) => {
                return column.type
                  ? <div style={{ width: '20%' }}>
                    <Label>{t(column.langKey, column.titulo)}</Label>
                    <Datetime
                    onChange={(e) => {
                      const aux = String(e?.valueOf())?.length >= 4 ? e?.valueOf() :  null
                      const date = new Date(aux)
                      const year = date.getFullYear()
                      eventHandler(() => {
                        handletableChange(aux ? year : e, i, true)
                      })
                      console.log(e)
                    }}
                    inputProps={{className:`form-control`}}
                    dateFormat={"YYYY"}
                    timeFormat={false}/>
                    
                  }
                </div>
                :
                <div style={{width: "100%", marginRight: "10px"}}>
                  <Label>{column.titulo}</Label>
                  <Input
                    type={column.inputType || 'text'}
                    style={{width: "100%"}}
                    value={data?.columnValues[i] ? data?.columnValues[i]?.value : undefined}
                    onChange={(e) => {
                      eventHandler(() => {
                        handletableChange(e.target.value || e.target.defaultValue, i)
                      })
                    }}
                  />
                </div>
            })}
          </div>            
          )}
          <br />
          <Row>
            <CenteredCol xs={12}>
              <Button
                color='primary'
                outline
                onClick={() => {
                  eventHandler(() => {
                    toggle()
                  })
                }}
              >
                Cancelar
              </Button>
              <Button
                color='primary'
                onClick={() => {
                  eventHandler(() => {
                    const avoidToggle = handleSave(options.length !== 0)
                    if (!avoidToggle) {
                      toggle()
                    }
                  })
                }}
              >
                Guardar
              </Button>
            </CenteredCol>
          </Row>
        </ModalBody>
      </Modal>
    </ItemsTable>
  )
}

const TableItem = (props, avoidCutText) => {
  if (!props.item) return
  const values = props.options ? [...props.item.columnValues].reverse() : props.item.columnValues
  return (
    <Item isFirst={props.isFirst}>
      {values.map((item) => {
        if (typeof item.value === 'number' || avoidCutText) {
          return <td>{item.value}</td>
        }
        return <td>{maxLengthString(item.value, 23)}</td>
      })}
      <td>
        <CustomInput
          className='custom-checkbox mb-0 d-inline-block'
          type='checkbox'
          id='checkAll'
          onClick={() => {
            props.eventHandler(() => {
              if (props.selectedIds.includes(props.item.id)) {
                props.setSelectedIds(
                  props.selectedIds.filter((id) => id != props.item.id)
                )
              } else {
                props.setSelectedIds([...props.selectedIds, props.item.id])
              }
            })
          }}
          checked={props.selectedIds.includes(props.item.id)}
        />
        <TableItemMenu
          handleDeleteItem={() =>
            props.eventHandler(() =>
              props.handleDeleteItems([props.item.id]),
            )
          }
          handleEdit={() => {
            props.eventHandler(() => props.handleEdit(props.item))
          }}
        />
      </td>
    </Item>
  )
}

const TableItemMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(false)
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <IconButton
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            props.handleDeleteItem()
            handleClose()
          }}
        >
          Eliminar
        </MenuItem>
        <MenuItem onClick={() => {
              handleClose()
              props.handleEdit()
              // props.setEditableForm(true)
          }}>
              Editar
          </MenuItem>
      </Menu>
    </>
  )
}

const Item = styled.tr`
  background-color: white;
  border-top: ${(props) =>
    props.isFirst ? '1px solid rgba(236, 235, 235, 0.87)' : '0px'};
  border-bottom: 1px solid rgba(236, 235, 235, 0.87);
`

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

const CenteredOptions = styled.td`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const CenteredHeader = styled.th`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const TableContainer = styled.div`
  height: 26rem;
  overflow-x: hidden;
  /* width */
  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 30%;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 15px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

const StyledButtonDropdown = styled(ButtonDropdown)`
  margin-left: 10px;
  margin-right: 10px;
`

export default CRUDTable
