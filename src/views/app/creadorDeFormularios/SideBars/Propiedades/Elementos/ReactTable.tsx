import React, { useEffect } from 'react'
import {
  Form,
  FormGroup,
  Label,
  Button,
  Input
  , InputGroup, InputGroupAddon
} from 'reactstrap'
import { PropsTextArea } from '../../../Types/propiedades.tsx'
import { cloneDeep } from 'lodash'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { IOSSwitch } from '../../../../../../components/IosSwitch.tsx'
import '../../../styles.scss'
import DefinirFuenteLista from '../utils/definirFuenteLista.tsx'

import { guidGenerator } from 'Utils/GUIDGenerator'
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@material-ui/core'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import EditIcon from '@material-ui/icons/Edit'
import CustomInput from 'Views/user/Registration/Steps/CustomInput'
import DeleteIcon from '@material-ui/icons/Delete'
import colors from 'Assets/js/colors'
import VisibilityIcon from '@material-ui/icons/Visibility'

const getLabelValueDefined = (field) => {
  const options = field.options || ''

  return options.length == 0 ? 'No definido' : 'Otro'
}

const Select = () => {
  return (
    <button
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: 'grey'
      }}
      onClick={() => {}}
    >
      <Tooltip title='Seleccionar centro educativo'>
        <IconButton>
          <TouchAppIcon style={{ fontSize: 30 }} />
        </IconButton>
      </Tooltip>
    </button>
  )
}

const Checkbox = () => {
  return (
    <CustomInput
      className='custom-checkbox mb-0 d-inline-block'
      type='checkbox'
      id='checkAll'
      onClick={() => {}}
      checked
    />
  )
}

const TextArea: React.FC<PropsTextArea> = (props) => {
  const [required, setRequired] = React.useState(props.required)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [columnsLength, setColumnsLength] = React.useState(Number(props.field.config?.columnsLength || 2))
  const [valueOptions, setValueOptions] = React.useState(
    getLabelValueDefined(props.field)
  )
  const inputRefs = {
    column1: React.createRef(null),
    column2: React.createRef(null)
  }
  const handleChange = (idx, value, type: 'Header' | 'accessor' = 'Header') => {
    const _columns = cloneDeep(props.field.config.columns)
    props.handleChange('columns', _columns.map((item, i) => {
      if (i === idx) {
        return { ...item, [type]: value }
      }
      return item
    }), true)
  }

  const handleOptions = () => {
    props.handleChange('multipleOptions', !props.field.config.multipleOptions, true)
  }

  const setValueDefined = (value) => {
    setValueOptions(value)
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  React.useEffect(() => {
    setColumnsLength(Number(props.field.config?.columnsLength))
  }, [props.field.config?.columnsLength])

  React.useEffect(() => {
    const length = Number(props?.field?.config?.columnsLength)
    if (
      length &&
      length !== props?.field?.config?.columns?.length
    ) {
      if (length > props?.field?.config?.columns?.length) {
        const newColumns = props?.field?.config?.columns
        const aux = new Array(length - props?.field?.config?.columns?.length)

        for (let i = 0; i < aux.length; i++) {
          aux[i] = {
            Header: 'Columna',
            accessor: `accessor${props?.field?.config?.columns?.length + i + 1}`,
            id: guidGenerator(),
            column: '',
            label: ''
          }
        }
        const sum = newColumns.concat(aux)
        props.handleChange('columns', sum, true)
      } else if (length < props?.field?.config?.columns?.length) {
        const newColumns = props?.field?.config?.columns
        const substrac = props?.field?.config?.columns?.length - length
        props.handleChange('columns', newColumns.splice(substrac, props?.field?.config?.columns?.length), true)
      }
    }
  }, [props?.field?.config?.columnsLength])

  React.useEffect(() => {
    if (props?.field?.config?.columns?.filter((el) => el?.accessor === 'actions')?.length > 0) {
      const newColumns = [...props?.field?.config?.columns]
      const index = newColumns.findIndex((el) => el.accessor === 'actions')
      if (props?.field?.config?.select && !props?.field?.config?.checkbox && index !== -1) {
        newColumns[index] = {
          ...newColumns[index],
          Cell: ({ row }) => {
            return (
              <div className='d-flex justify-content-center align-items-center'>
                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'grey'
                  }}
                  onClick={() => {}}
                >
                  <IconButton>
                    <TouchAppIcon style={{ fontSize: 30 }} />
                  </IconButton>
                </button>
              </div>
            )
          }
        }
      } else if (!props?.field?.config?.select && props?.field?.config?.checkbox && index !== -1) {
        newColumns[index] = {
          ...newColumns[index],
          Cell: (
            <div className='d-flex justify-content-center align-items-center'>
              <input
                checked
                className='custom-checkbox mb-0 d-inline-block'
                type='checkbox'
                onClick={(e) => {}}
              />
            </div>
          )
        }
      } else if (props?.field?.config?.select && props?.field?.config?.checkbox && index !== -1) {
        newColumns[index] = {
          ...newColumns[index],
          Cell: (
            <div className='d-flex justify-content-center align-items-center'>
              <div className='ml-3'>
                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'grey'
                  }}
                  onClick={() => {}}
                >
                  <IconButton>
                    <TouchAppIcon style={{ fontSize: 30 }} />
                  </IconButton>
                </button>
              </div>
              <div>
                <input
                  checked
                  className='custom-checkbox mb-0 d-inline-block'
                  type='checkbox'
                  onClick={(e) => {}}
                />
              </div>
            </div>
          )
        }
      } else if (props?.field?.config?.edit && props?.field?.config?.delete && props?.field?.config?.checkbox && index !== -1) {
        newColumns[index] = {
          ...newColumns[index],
          Cell: () => {
            return (
              <div className='d-flex justify-content-center align-items-center'>
                <Tooltip title='Editar'>
                  <EditIcon
                    style={{
                      fontSize: 30,
                      color: colors.darkGray
                    }}
                  />
                </Tooltip>
                <Tooltip title='Eliminar'>
                  <DeleteIcon
                    style={{
                      fontSize: 30,
                      color: colors.darkGray
                    }}
                  />
                </Tooltip>
                <input
                  checked
                  className='custom-checkbox mb-0 d-inline-block'
                  type='checkbox'
                  onClick={(e) => {}}
                />
              </div>
            )
          }
        }
      }
      props.handleChange('columns', newColumns, true)
    }
  }, [props?.field?.config])

  return (
    <div>
      <h4>[TABLA]</h4>
      <div className='content-form'>
        <Form>
          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={props.field?.config?.avoidSearch}
                  onClick={(e) => {
                    const aux = props.field?.config?.checkbox !== undefined ? !e.target?.checked : e.target?.checked
                    props.handleChange(e.target?.name, aux, true)
                  }}
                  name='avoidSearch'
                  color='primary'
                />
                }
              label='Quitar Buscador'
              labelPlacement='start'
              className='switch-required'
            />
          </FormGroup>
          <FormGroup>
            <Label for='columnsLength'>Columnas</Label>
            <Input
              type='number'
              name='columnsLength'
              value={props.field.config?.columnsLength || props.field?.columns?.length}
              id='columnsLength'
              placeholder=''
              onChange={(e) => {
                props.handleChange('columnsLength', e.target.value, true)
              }}
            />
          </FormGroup>
          <FormControlLabel
            control={
              <IOSSwitch
                checked={props.field.config?.columns?.filter((el) => el?.accessor === 'actions')?.length > 0}
                onClick={(e) => {
                  if (!e.target?.checked === true && props?.field?.config?.columns?.filter((el) => el?.accessor === 'actions')?.length === 0) {
                    props.handleChange(
                      'columns',
                      [
                        ...props?.field?.config?.columns,
                        {
                          Header: 'Acciones',
                          accessor: 'actions',
                          label: '',
                          column: ''
                        }
                      ],
                      true
                    )
                  } else {
                    props.handleChange(
                      'columns',
                      [
                        ...props?.field?.config?.columns.filter((el) => el?.accessor !== 'actions')
                      ],
                      true
                    )
                  }
                }}
                name='actions'
                color='primary'
              />
              }
            label='Habilitar Acciones'
            labelPlacement='start'
            className='switch-required'
          />
          <FormControlLabel
            control={
              <IOSSwitch
                checked={props.field.config.showAddButton}
                onClick={(e) => {
                  const aux = props.field.config.showAddButton !== undefined ? !e.target?.checked : e.target?.checked
                  props.handleChange(e.target?.name, aux, true)
                }}
                name='showAddButton'
                color='primary'
              />
              }
            label='Mostrar botón añadir'
            labelPlacement='start'
            className='switch-required'
          />
          {
              props.field?.config?.columns?.filter((el) => el?.accessor === 'actions')?.length > 0 && (
                <>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={props.field.config?.checkbox}
                        onClick={(e) => {
                          const aux = props.field?.config?.checkbox !== undefined ? !e.target?.checked : e.target?.checked
                          props.handleChange(e.target?.name, aux, true)
                        }}
                        name='checkbox'
                        color='primary'
                      />
                    }
                    label='Habilitar checkbox'
                    labelPlacement='start'
                    className='switch-required'
                  />
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={props.field.config.select}
                        onClick={(e) => {
                          const aux = props.field?.config?.select !== undefined ? !e.target?.checked : e.target?.checked
                          props.handleChange(e.target?.name, aux, true)
                        }}
                        name='select'
                        color='primary'
                      />
                    }
                    label='Habilitar select'
                    labelPlacement='start'
                    className='switch-required'
                  />
                </>
              )
            }
          {
                new Array(columnsLength || 0).fill(0).map((el, index) => (
                  <FormGroup key={`column${index}`}>
                    <Label for={`column${index}`}>Valor de la columna {index + 1}</Label>
                    <Input
                      type='text'
                      name={`column${index}`}
                      value={props.field.config?.columns[index]?.Header}
                      id={`column${index}`}
                      placeholder=''
                      onChange={(e) => {
                        handleChange(index, e.target.value, 'Header')
                      }}
                    />
                  </FormGroup>
                ))
            }
          {
                new Array(columnsLength || 0).fill(0).map((el, index) => (
                  <FormGroup key={`accessor${index}`}>
                    <Label for={`accessor${index}`}>Valor del accessor {index + 1}</Label>
                    <Input
                      type='text'
                      name={`accessor${index}`}
                      value={props.field.config?.columns[index]?.accessor}
                      id={`accessor${index}`}
                      innerRef={inputRefs.column1}
                      placeholder=''
                      onChange={(e) => {
                        handleChange(index, e.target.value, 'accessor')
                      }}
                    />
                  </FormGroup>
                ))
            }
        </Form>
      </div>
    </div>
  )
}

export default TextArea
