import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardBody,
  Form,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  FormFeedback,
  Button,
  InputGroupAddon,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CustomInput
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import { EditButton } from 'Components/EditButton'
import useNotification from 'Hooks/useNotification'
import styled from 'styled-components'
import { Column } from '../../../../../../components/JSONFormParser/Interfaces'
import StyledMultiSelect from '../../../../../../components/styles/StyledMultiSelect'
import HTMLTable from 'Components/HTMLTable'
import NavigationContainer from '../../../../../../components/NavigationContainer'
import swal from 'sweetalert'
import RequiredLabel from 'Components/common/RequeredLabel'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { getOfertas } from 'Redux/ofertas/actions'
import { useActions } from 'Hooks/useActions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Tooltip } from '@material-ui/core'
import { Edit, Delete, Lock } from '@material-ui/icons'
import colors from 'Assets/js/colors'
import search from 'Utils/search'
import { enableAndDisable } from 'Redux/modelosOferta/actions'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import IconButton from '@mui/material/IconButton'
import BarLoader from 'Components/barLoader/barLoader'
import { useTranslation } from 'react-i18next'

interface IProps {
	type:
		| 'Modalidad'
		| 'Nivel'
		| 'Oferta'
		| 'OfertaModelServ'
		| 'Servicio'
		| 'Especialidad'
	data: Array<any>
	tableNombre: string
	nombre: string
	modalities: boolean
	loading: boolean
	hasAddAccess: boolean
	hasEditAccess: boolean
	handleDelete: (e) => {}
	hasDeleteAccess: boolean
	refreshUpdate: () => {}
	handleCreate: (e) => {}
	handleEdit: (e) => {}
	title: string
	categories: Array<any>
	tableName: string
	hideOrder: boolean
	showButtonEdit: boolean
	validateUsing: boolean
}

const GenericTable = (props: IProps) => {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [editable, setEditable] = useState(false)
  const [snackBarContent, setSnackBarContent] = useState({
    variant: '',
    msg: ''
  })
  const [item, setItem] = useState({})
  const [searchValue, setSearchValue] = useState('')
  const [snackBar, handleClick] = useNotification()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isOpenCategories, setIsOpenCategories] = useState(false)
  const [stagedCategories, setStagedCategories] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [name, setName] = useState('')
  const [missingCategories, setMissingCategories] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [openDropdown, setOpenDropdown] = useState(false)

  useEffect(() => {
    setItems(
      data.sort((a, b) => {
        return a.orden - b.orden
      })
    )
  }, [data])

  const {
    register,
    reset,
    setValue,
    errors,
    handleSubmit,
    clearErrors,
    control,
    watch
  } = useForm({ mode: 'onChange' })

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true,
    validateUsing = false
  } = props

  const [selectedIds, setSelectedIds] = useState([])

  const onSearch = (value) => {
    
    setSearchValue(value)
    setItems(
      search(searchValue).in(
        data,
        columns.map((column) => {
          column.column,
          console.log(column, 'COLUMNNN', data, 'DATAAAA')
        })
      )
    )
  }

  const columns = useMemo(
    () => [
      /* {
				label: '',
				column: 'id',
				accessor: 'id',
				Header: '',
				Cell: ({ row }) => {
					return (
						<div
							style={{
								textAlign: 'center',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<input
								className="custom-checkbox mb-0 d-inline-block"
								type="checkbox"
								id="checki"
								style={{
									width: '1rem',
									height: '1rem',
									marginRight: '1rem'
								}}
								onClick={(e) => {
									if (selectedIds.includes(row.original.id)) {
										setSelectedIds(
											selectedIds.filter(
												(el) => el !== row.original.id
											)
										)
									} else {
										setSelectedIds([
											...selectedIds,
											row.original.id
										])
									}
								}}
								checked={selectedIds.includes(row.original.id)}
							/>
						</div>
					)
				}
			}, */
      /* {
				column: 'idP',
				label: 'Código',
				Header: 'Código',
				accessor: 'idP'
			}, */
      {
        column: 'nombre',
        label: props.tableNombre || props.nombre,
        Header: props.tableNombre || props.nombre,
        accessor: 'nombre'
      },
      {
        column: 'estadoP',
        label: 'Estado',
        Header: t(
          'configuracion>ofertas_educativas>ofertas_educativas>columna_estado',
          'Estado'
        ),
        accessor: 'estadoP'
      },
      {
        column: 'orden',
        label: 'Orden',
        Header: t(
          'configuracion>ofertas_educativas>ofertas_educativas>columna_orden',
          'Orden'
        ),
        accessor: 'orden'
      },
      {
        column: 'actions',
        label: 'Acciones',
        Header: t(
          'configuracion>ofertas_educativas>ofertas_educativas>columna_acciones',
          'Acciones'
        ),
        accessor: 'actions',
        Cell: ({ _, row, data }) => {
          const fullRow = data[row.index]
          return (
            <>
              <div className='d-flex justify-content-center align-items-center'>
                {hasEditAccess && (
                  <>
                    <Tooltip title={t("boton>general>editar", "Editar")}>
                      <Edit
                        style={{
												  cursor: 'pointer',
												  color: colors.darkGray
                        }}
                        onClick={() => {
												  toggleForm(row.original)
												  setEditable(true)
												  // props.setInputState(true)
                        }}
                      />
                    </Tooltip>
                  </>
                )}

                {hasDeleteAccess && (
                  <Tooltip title={t("boton>general>eliminar", "Eliminar")}>
                    <Delete
                      style={{
											  cursor: 'pointer',
											  color: colors.darkGray
                      }}
                      onClick={() => {
											  swal({
											    title: t(
											      'generic_table>mensaje_eliminar>confirmacion',
											      'Confirmación'
											    ),
											    text: t(
											      'generic_table>mensaje_eliminar>texto',
											      '¿Estás seguro de que deseas ELIMINAR este registro?'
											    ),
											    icon: 'warning',
											    className:
														'text-alert-modal',
											    buttons: {
											      cancel: t(
											        'boton>general>cancelar',
											        'Cancelar'
											      ),
											      ok: {
											        text: t(
											          'boton>general>si_seguro',
											          'Sí, seguro'
											        ),
											        value: true,
											        className:
																'btn-alert-color'
											      }
											    }
											  }).then(async (res) => {
											    if (res) {
											      setLoading(true)
											      const response =
															await props.handleDelete(
															  [
															    row.original
															      .id
															  ]
															)
											      setLoading(false)
											      if (!response.error) {
											        toggleSnacBar(
											          'success',
                                'Se ha eliminado 1 registro'
											        )
											        props.refreshUpdate()
											      } else {
											        toggleSnacBar(
											          'error',
											          response.data
											        )
											      }
											    }
											  })
                      }}
                    />
                  </Tooltip>
                )}
                {hasEditAccess && !row.original.esActivo && (
                  <>
                    <Tooltip title={t('boton>general>habilitar', 'Habilitar')}>
                      <IconButton
                        onClick={async () => {
												  swal({
												    title: t(
												      'generic_table>mensaje_eliminar>confirmacion',
												      'Confirmación'
												    ),
												    text: t(
												      'generic_table>mensaje_habilitar>texto',
												      '¿Estás seguro de que deseas habilitar este registro?'
												    ),
												    icon: 'warning',
												    className:
															'text-alert-modal',
												    buttons: {
												      cancel: t(
												        'boton>general>cancelar',
												        'Cancelar'
												      ),
												      ok: {
												        text: t(
												          'boton>general>si_seguro',
												          'Sí, seguro'
												        ),
												        value: true,
												        className:
																	'btn-alert-color'
												      }
												    }
												  }).then(async (res) => {
												    if (res) {
												      setLoading(true)
												      const response =
																await actions.enableAndDisable(
																  props.type,
																  [
																    row
																      .original
																      ?.id
																  ]
																)
												      setLoading(false)
												      if (
												        !response.error
												      ) {
												        toggleSnacBar(
												          'success',
                                  t('configuracion>ofertas>msj_habilitado','Se ha habilitado el registro')
												        )
												        props.refreshUpdate()
												      } else {
												        toggleSnacBar(
												          'error',
												          response.error
												        )
												      }
												    }
												  })
                        }}
                      >
                        <BookAvailable
                          style={{
													  cursor: 'pointer',
													  color: colors.darkGray
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {hasEditAccess && row.original.esActivo && (
                  <>
                    <Tooltip title={t('boton>general>deshabilitar', 'Deshabilitar')}>
                      <IconButton
                        onClick={async () => {
												  swal({
												    title: t(
												      'generic_table>mensaje_eliminar>confirmacion',
												      'Confirmación'
												    ),
												    text: t(
												      'generic_table>mensaje_deshabilitar>texto',
												      '¿Estás seguro de que deseas deshabilitar este registro?'
												    ),
												    icon: 'warning',
												    className:
															'text-alert-modal',
												    buttons: {
												      cancel: t(
												        'boton>general>cancelar',
												        'Cancelar'
												      ),
												      ok: {
												        text: t(
												          'boton>general>si_seguro',
												          'Sí, seguro'
												        ),
												        value: true,
												        className:
																	'btn-alert-color'
												      }
												    }
												  }).then(async (res) => {
												    if (res) {
												      setLoading(true)
												      const response =
																await actions.enableAndDisable(
																  props.type,
																  [
																    row
																      .original
																      ?.id
																  ]
																)
												      setLoading(false)
												      if (
												        !response.error
												      ) {
												        toggleSnacBar(
												          'success',
                                  t('configuracion>ofertas>msj_deshabilitado','Se ha deshabilitado el registro')
												        )
												        props.refreshUpdate()
												      } else {
												        toggleSnacBar(
												          'error',
												          response.error
												        )
												      }
												    }
												  })
                        }}
                      >
                        <BookDisabled
                          style={{
													  cursor: 'pointer',
													  color: colors.darkGray
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </div>
            </>
          )
        }
      }
    ],
    [hasEditAccess, hasDeleteAccess, selectedIds]
  )

  const columnsWithoutOrder = useMemo(
    () => [
      /* {
				label: '',
				column: 'id',
				accessor: 'id',
				Header: '',
				Cell: ({ row }) => {
					return (
						<div
							style={{
								textAlign: 'center',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<input
								className="custom-checkbox mb-0 d-inline-block"
								type="checkbox"
								id="checki"
								style={{
									width: '1rem',
									height: '1rem',
									marginRight: '1rem'
								}}
								onClick={(e) => {
									if (selectedIds.includes(row.original.id)) {
										setSelectedIds(
											selectedIds.filter(
												(el) => el !== row.original.id
											)
										)
									} else {
										setSelectedIds([
											...selectedIds,
											row.original.id
										])
									}
								}}
								checked={selectedIds.includes(row.original.id)}
							/>
						</div>
					)
				}
			},
			/*{
				column: 'idP',
				label: 'Código',
				Header: t('configuracion>ofertas_educativas>especialidades>columna_codigo','Código'),
				accessor: 'idP'
			}, */
      {
        column: 'nombre',
        label: props.tableNombre || props.nombre,
        Header: props.tableNombre || props.nombre,
        accessor: 'nombre'
      },
      {
        column: 'estadoP',
        label: 'Estado',
        Header: t(
          'configuracion>ofertas_educativas>ofertas_educativa>columna_estado',
          'Estado'
        ),
        accessor: 'estadoP'
      },
      {
        column: 'orden',
        label: 'Orden',
        Header: 'Orden',
        accessor: 'orden'
      },
      {
        column: 'actions',
        label: 'Acciones',
        Header: t(
          'configuracion>ofertas_educativas>especialidades>columna_acciones',
          'Acciones'
        ),
        accessor: 'actions',
        Cell: ({ _, row, data }) => {
          const fullRow = data[row.index]
          return (
            <>
              <div className='d-flex justify-content-center align-items-center'>
                {hasEditAccess && (
                  <>
                    <Tooltip title={t("boton>general>editar", "Editar")}>
                      <Edit
                        style={{
												  cursor: 'pointer',
												  color: colors.darkGray
                        }}
                        onClick={() => {
												  toggleForm(row.original)
												  setEditable(true)
                        }}
                      />
                    </Tooltip>
                  </>
                )}

                {hasDeleteAccess && (
                  <Tooltip title={t("boton>general>eliminar", "Eliminar")}>
                    <Delete
                      style={{
											  cursor: 'pointer',
											  color: colors.darkGray
                      }}
                      onClick={() => {
											  swal({
											    title: t(
											      'generic_table>mensaje_eliminar>confirmacion',
											      'Confirmación'
											    ),
											    text: t(
											      'generic_table>mensaje_eliminar>texto',
											      '¿Estás seguro de que deseas ELIMINAR este registro?'
											    ),
											    icon: 'warning',
											    className:
														'text-alert-modal',
											    buttons: {
											      cancel: t(
											        'boton>general>cancelar',
											        'Cancelar'
											      ),
											      ok: {
											        text: t(
											          'boton>general>si_seguro',
											          'Sí, seguro'
											        ),
											        value: true,
											        className:
																'btn-alert-color'
											      }
											    }
											  }).then(async (res) => {
											    if (res) {
											      setLoading(true)
											      const response =
															await props.handleDelete(
															  [
															    row.original
															      .id
															  ]
															)
											      setLoading(false)
											      if (!response.error) {
											        toggleSnacBar(
											          'success',
                                t('configuracion>ofertas>msj_eliminado','Se ha eliminado 1 registro')
											        )
											        props.refreshUpdate()
											      } else {
											        toggleSnacBar(
											          'error',
											          response.data
											        )
											      }
											    }
											  })
                      }}
                    />
                  </Tooltip>
                )}
                {hasEditAccess && !row.original.esActivo && (
                  <>
                    <Tooltip title={t('boton>general>habilitar', 'Habilitar')}>
                      <IconButton
                        onClick={async () => {
												  swal({
												    title: t(
												      'generic_table>mensaje_eliminar>confirmacion',
												      'Confirmación'
												    ),
												    text: t(
												      'generic_table>mensaje_habilitar>texto',
												      '¿Estás seguro de que deseas habilitar este registro?'
												    ),
												    icon: 'warning',
												    className:
															'text-alert-modal',
												    buttons: {
												      cancel: t(
												        'boton>general>cancelar',
												        'Cancelar'
												      ),
												      ok: {
												        text: t(
												          'boton>general>si_seguro',
												          'Sí, seguro'
												        ),
												        value: true,
												        className:
																	'btn-alert-color'
												      }
												    }
												  }).then(async (res) => {
												    if (res) {
												      setLoading(true)
												      const response =
																await actions.enableAndDisable(
																  props.type,
																  [
																    row
																      .original
																      ?.id
																  ]
																)
												      setLoading(false)
												      if (
												        !response.error
												      ) {
												        toggleSnacBar(
												          'success',
                                  t('configuracion>ofertas>msj_habilitado','Se ha habilitado el registro')
												        )
												        props.refreshUpdate()
												      } else {
												        toggleSnacBar(
												          'error',
												          response.error
												        )
												      }
												    }
												  })
                        }}
                      >
                        <BookAvailable
                          style={{
													  cursor: 'pointer',
													  color: colors.darkGray
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {hasEditAccess && row.original.esActivo && (
                  <>
                    <Tooltip title={t('boton>general>deshabilitar', 'Deshabilitar')}>
                      <IconButton
                        onClick={async () => {
												  swal({
												    title: t(
												      'generic_table>mensaje_eliminar>confirmacion',
												      'Confirmación'
												    ),
												    text: t(
												      'generic_table>mensaje_deshabilitar>texto',
												      '¿Estás seguro de que deseas deshabilitar este registro?'
												    ),
												    icon: 'warning',
												    className:
															'text-alert-modal',
												    buttons: {
												      cancel: t(
												        'boton>general>cancelar',
												        'Cancelar'
												      ),
												      ok: {
												        text: t(
												          'boton>general>si_seguro',
												          'Sí, seguro'
												        ),
												        value: true,
												        className:
																	'btn-alert-color'
												      }
												    }
												  }).then(async (res) => {
												    if (res) {
												      setLoading(true)
												      const response =
																await actions.enableAndDisable(
																  props.type,
																  [
																    row
																      .original
																      ?.id
																  ]
																)
												      setLoading(false)
												      if (
												        !response.error
												      ) {
												        toggleSnacBar(
												          'success',
                                  t('configuracion>ofertas>msj_deshabilitado','Se ha deshabilitado el registro')
												        )
												        props.refreshUpdate()
												      } else {
												        toggleSnacBar(
												          'error',
												          response.error
												        )
												      }
												    }
												  })
                        }}
                      >
                        <BookDisabled
                          style={{
													  cursor: 'pointer',
													  color: colors.darkGray
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </div>
            </>
          )
        }
      }
    ],
    [hasEditAccess, hasDeleteAccess, selectedIds]
  )

  const actions = useActions({
    getOfertas,
    enableAndDisable
  })

  useEffect(() => {
    toggleForm(item, true)
  }, [editable])
  useEffect(() => {
    setData(
      props.data.map((el) => ({
        ...el,
        idP: String(el.id).padStart(3, '0')
      }))
    )
  }, [props.data])

  const toggleForm = async (_item = {}, resetData = false) => {
    if (!resetData) {
      setItem(_item)
      await setShowForm(!showForm)
    }
    setValue('codigo', _item.idP)
    setValue('nombre', _item.nombre)
    setValue('orden', _item.orden)
    setValue('descripcion', _item.descripcion)
    setMissingCategories(false)
    _item.id
      ? setValue('esActivo', _item.esActivo ? 1 : 0)
      : setValue('esActivo', 1)
    if (props.modalities) {
      setSelectedCategories(
        _item.categorias
          ? _item.categorias.map((category) => category.id)
          : []
      )
    }
    clearErrors()
  }

  const actionRow: ActionRow[] = [
    {
      actionName: 'crud.edit',
      actionFunction: (item: object) => {
        toggleForm(item)
        setEditable(true)
      },
      actionDisplay: () => true
    },
    {
      actionName: 'crud.delete',
      actionFunction: async (item: object) => {
        const response = await props.handleDelete([item.id])

        if (!response.error) {
          toggleSnacBar('success', 'Se ha eliminado 1 registro')
          props.refreshUpdate()
        } else {
          toggleSnacBar('error', response.data)
        }
      },
      actionDisplay: (item) => {
        if (item.totalUsing) {
          return false
        }
        return item.estado
      }
    }
  ]

  if (!hasEditAccess) {
    actionRow.splice(0, 1)
  }

  if (!hasDeleteAccess) {
    actionRow.splice(1, 1)
  }

  const tableActions = [
    {
      actionName: 'Inactivar',
      actionFunction: async (ids: number[]) => {
        if (ids.length > 0) {
          swal({
            title: 'Atención',
            text: '¿Está seguro de querer desactivar estos registros ?',
            dangerMode: true,
            icon: 'warning',
            buttons: ['Cancelar', 'Aceptar']
          }).then(async (val) => {
            if (val) {
              const response = await props.handleDelete(ids)
              if (!response.error) {
                toggleSnacBar(
                  'success',
                  ids.length === 1
                    ? 'Se ha desactivado 1 registro'
                    : `Se han desactivados ${ids.length} registros`
                )
                props.refreshUpdate()
              } else {
                toggleSnacBar('error', response.data)
              }
            }
          })
        } else {
          swal({
            title: 'Error',
            text: 'Debe seleccionar almenos un (1) registro',
            dangerMode: true,
            icon: 'warning'
          })
        }
      }
    }
  ]

  const toggleSnacBar = (variant, msg) => {
    setSnackBarContent({
      variant,
      msg
    })
    handleClick()
  }

  const sendData = async (data) => {
    let response
    let _data = { ...data } /* , orden: data.orden.value */
    if (props.modalities) {
      if (selectedCategories.length < 1) {
        setMissingCategories(true)
        return
      }
      _data = { ..._data, categorias: selectedCategories }
    }
    setLoading(true)
    if (!item.id) {
      response = await props.handleCreate(_data)
    } else {
      response = await props.handleEdit({ ..._data, id: item.id })
    }
    if (!response.error) {
      toggleForm()
      toggleSnacBar(
        'success',
        !item.id
          ? t('general>msj_guardado','Se guardó correctamente')
          : t('general>msj_actualizado','Se actualizó correctamente')
      )
    } else {
      toggleSnacBar('error', response.error)
    }
    setLoading(false)
  }

  const RequiredField = (props) => (
    <FormFeedback>{t("campo_requerido","Este campo es requerido")} {props.extraMsg}</FormFeedback>
  )

  const RequiredFieldSpan = (props) => (
    <FormFeedbackSpan>
      {t("campo_requerido","Este campo es requerido")} {props.extraMsg}
    </FormFeedbackSpan>
  )

  const toggleCategories = (e, save = false) => {
    if (save) {
      setSelectedCategories(stagedCategories)
    } else {
      setStagedCategories(selectedCategories)
    }
    setIsOpenCategories(!isOpenCategories)
  }

  const handleChangeItem = (item) => {
    if (!stagedCategories.includes(item.id)) {
      setStagedCategories([...stagedCategories, item.id])
    } else {
      setStagedCategories(
        stagedCategories.filter((el) => el !== item?.id)
      )
    }
  }

  const options = [
    { value: 1, label: 'Activo' },
    { value: 0, label: 'Inactivo' }
  ]

  const getNumbersOrder = () => {
    const content = []
    for (let i = 1; i <= 400; i++) {
      content.push({ label: i, value: i })
    }

    return content
  }

  return (
    <div>
      {snackBar(snackBarContent.variant, snackBarContent.msg)}
      {loading && <BarLoader />}
      <h3>{props.title}</h3>
      <br />
      {showForm ? (
        <Form onSubmit={handleSubmit(sendData)}>
          <NavigationContainer goBack={toggleForm} />
          <Row>
            <Col xs={12} md={6}>
              <Card>
                <CardBody>
                  <CardTitle>{props.title}</CardTitle>
                  <FormGroup>
                    <Label>
                    {t(
											  'configuracion>ofertas_educativas>ofertas_educativas>agregar>codigo',
											  'Código'
                  )}
                  </Label>
                    <Input
                    type='text'
                    name='codigo'
                    invalid={errors.codigo}
                    innerRef={register}
                    readOnly
                  />
                    {errors.codigo && <RequiredField />}
                  </FormGroup>
                  <FormGroup>
                    <RequiredLabel for='nombre'>
                    {props.nombre}
                  </RequiredLabel>
                    <InputUpperCase
                    type='text'
                    name='nombre'
                    invalid={errors.nombre}
                    innerRef={register({
											  required: true
                  })}
                    readOnly={
												!editable ||
												(item?.totalUsing > 0 &&
													validateUsing)
											}
                  />
                    {errors.nombre && <RequiredField />}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                    {t(
											  'configuracion>ofertas_educativas>ofertas_educativas>agregar>estado',
											  'Estado'
                  )}
                  </Label>

                    <Controller
                    render={(
											  {
											    onChange,
											    onBlur,
											    value,
											    name,
											    ref
											  },
											  { invalid, isTouched, isDirty }
                  ) => (
                  <Select
                  className='react-select'
                  classNamePrefix='react-select'
                  placeholder=''
                  invalid={errors.esActivo}
                  value={options.find(
													  (el) =>
													    el.value == value
                )}
                  onChange={(e) =>
													  setValue(
													    'esActivo',
													    e.value
													  )}
                  options={options}
                  isDisabled
                  noOptionsMessage={() =>
													  'Sin opciones '}
                  getOptionLabel={(
													  option: any
                ) => option.label}
                  getOptionValue={(
													  option: any
                ) => option.value}
                  components={{
													  Input: CustomSelectInput
                }}
                />
                  )}
                    name='esActivo'
                    control={control}
                    rules={{ required: true }}
                  />
                    {errors.esActivo && (
                    <RequiredField />
                  )}
                  </FormGroup>
                  {!props.hideOrder && (
                    <FormGroup>
                    <RequiredLabel for='orden'>
                    {t(
												  'configuracion>ofertas_educativas>ofertas_educativas>agregar>orden',
												  'Orden'
                  )}
                  </RequiredLabel>
                    <Controller
                    name='orden'
                    control={control}
                    rules={{ required: true }}
                    render={(
												  { onChange, value },
												  { invalid }
                  ) => (
                  <Select
                  placeholder=''
                  className={`select-rounded react-select form-control ${
															invalid
																? 'is-invalid'
																: ''
														}`}
                  classNamePrefix='select-rounded react-select'
                  disabled={
															!hasEditAccess
														}
                  isDisabled={
															!hasEditAccess ||
															(item?.totalUsing >
																0 &&
																validateUsing)
														}
                  styles={{
														  container: (
														    base
														  ) => ({
														    ...base,
														    border: 'none',
														    padding: '0'
														  })
                }}
                  value={getNumbersOrder().find(
														  (el) =>
														    el.value ==
																value
                )}
                  onChange={(e) => {
														  onChange(e)
														  setValue(
														    'orden',
														    e.value
														  )
                }}
                  options={getNumbersOrder().filter(
														  (element) => {
														    return !data.find(
														      (
														        elementFind
														      ) =>
														        elementFind.orden ===
																		element.value
														    )
														  }
                )}
                  noOptionsMessage={() =>
														  'Sin opciones '}
                  getOptionLabel={(
														  option: any
                ) => option.label}
                  getOptionValue={(
														  option: any
                ) => option.value}
                  components={{
														  Input: CustomSelectInput
                }}
                />
                  )}
                  />
                    {errors.orden && (
                    <FormFeedback>
                    {t('campo_requerido>positivo','Este campo es requerido y debe ser mayor a 0')}
												</FormFeedback>
                  )}
                  </FormGroup>
                  )}
                  <FormGroup>
                    <RequiredLabel for='descripcion'>
                    {t(
											  'configuracion>ofertas_educativas>ofertas_educativas>agregar>descripcion',
											  'Descripción'
                  )}
                  </RequiredLabel>
                    <InputUpperCase
                    type='textarea'
                    name='descripcion'
                    invalid={errors.descripcion}
                    innerRef={register({
											  required: true
                  })}
                    readOnly={
												!editable ||
												(item?.totalUsing > 0 &&
													validateUsing)
											}
                  />
                    {errors.descripcion && (
                    <RequiredField />
                  )}
                  </FormGroup>
                  {props.modalities && (
                    <>
                    <Label>
                    {t(
												  'configuracion>ofertas_educativas>modalidades>agregar>categoria_vinculada_modalidad',
												  'Categoría vinculada a la modalidad'
                  )}
                  </Label>
                    <StyledMultiSelect
                    toggle={toggleCategories}
                    selectedOptions={
													selectedCategories
												}
                    isOpen={isOpenCategories}
                    editable={editable}
                    options={props.categories || []}
                    stagedOptions={stagedCategories}
                    handleChangeItem={
													handleChangeItem
												}
                    columns={1}
                    height='20rem'
                    noDescription
                    length={180}
                  />
                    {missingCategories && (
                    <RequiredFieldSpan />
                  )}
                  </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            {validateUsing
						  ? !item?.totalUsing &&
							  hasEditAccess && (
  <CenteredCol xs={12} md={6}>
    <EditButton
      loading={loading}
      editable={editable}
      setEditable={(value) => {
											  if (!value) {
											    toggleForm()
											  }
											  setEditable(value)
      }}
    />
  </CenteredCol>
							  )
						  : hasEditAccess && (
  <CenteredCol xs={12} md={6}>
    <EditButton
      loading={loading}
      editable={editable}
      setEditable={(value) => {
											  if (!value) {
											    toggleForm()
											  }
											  setEditable(value)
      }}
    />
  </CenteredCol>
							  )}
          </Row>
        </Form>
      ) : (
        <>
          {/* <HTMLTable
            columns={props.hideOrder ? columnsWithoutOrder : columns}
            hideMultipleOptions={!hasEditAccess}
            selectDisplayMode="datalist"
            showAddButton={hasAddAccess}
            showHeaders
            data={data}
            actions={tableActions}
            isBreadcrumb={false}
            showHeadersCenter={false}
            actionRow={(hasEditAccess && hasDeleteAccess) ? actionRow: []}
            match={props.match}
            tableName={props.tableName}
            toggleEditModal={(item: object) => {
              toggleForm(item)
              setEditable(false)
            }}
            toggleModal={() => {
              toggleForm()
              setEditable(true)
            }}
            modalOpen={false}
            pageSize={6}
            selectedOrderOption={{ column: 'detalle', label: 'Nombre Completo' }}
            editModalOpen={false}
            roundedStyle
            buttonSearch
            modalfooter={true}
            loading={props.loading}
            orderBy={false}
          /> */}
          <div className='d-flex justify-content-between align-items-center'>
            {/* <SearchContainer className="mr-4">
							<div className={`search-sm--rounded`}>
								<input
									type="text"
									name="keyword"
									id="search"
									value={searchValue || ''}
									onKeyPress={(e) => {
										if (
											e.charCode == 13 ||
											e.keyCode == 13 ||
											e.key === 'Enter'
										) {
											onSearch(e.target.value)
										}
									}}
									onChange={(e) => {
										setSearchValue(e.target.value)
									}}
									placeholder={t('place_holder>general>buscar_en_tabla',`Buscar en tabla`)}
								/>
								<StyledInputGroupAddon
									style={{ zIndex: 2 }}
									addonType="append"
								>
									<Button
										color="primary"
										className="buscador-table-btn-search"
										onClick={() => onSearch(searchValue)}
										id="buttonSearchTable"
									>
										{t('general>buscar','Buscar')}
									</Button>
								</StyledInputGroupAddon>
							</div>
						</SearchContainer> */}
            <div>
              <div
                style={{
								  display: 'flex',
								  justifyContent: 'flex-end'
                }}
              >
                {/* <Button
									onClick={() => {
										toggleForm()
										setEditable(true)
									}}
									color="primary"
								>
									Agregar
								</Button> */}
                {/* <StyledButtonDropdown
									isOpen={openDropdown}
									toggle={() => {
										setOpenDropdown(!openDropdown)
									}}
								>
									<div className="btn btn-primary btn-lg pl-4 pr-0 check-button check-all">
										<CustomInput
											className="custom-checkbox mb-0 d-inline-block"
											type="checkbox"
											id="checkAll"
											onClick={(e) => {
												if (
													selectedIds.length ===
													items.length
												) {
													setSelectedIds([])
												} else {
													setSelectedIds(
														items.map((el) => el.id)
													)
												}
											}}
											checked={
												selectedIds.length ===
												items.length
											}
										/>
									</div>
									<DropdownToggle
										caret
										color="primary"
										className="dropdown-toggle-split btn-lg"
									/>
									<DropdownMenu right>
										<DropdownItem
											onClick={() => {
												if (selectedIds.length > 0) {
													swal({
														title: t('generic_table>mensaje_eliminar>confirmacion','Confirmación'),
														text: '¿Estás seguro de que deseas deshabilitar o habilitar estos registros?',
														icon: 'warning',
														className:
															'text-alert-modal',
														buttons: {
															cancel: t('boton>general>cancelar','Cancelar'),
															ok: {
																text: t('boton>general>si_seguro','Sí, seguro'),
																value: true,
																className:
																	'btn-alert-color'
															}
														}
													}).then(async (res) => {
														if (res) {
															const response =
																await actions.enableAndDisable(
																	props.type,
																	selectedIds
																)
															props.refreshUpdate()
															if (
																!response.error
															) {
																toggleSnacBar(
																	'success',
																	`Se han deshabilitado los registros`
																)
																props.refreshUpdate()
															} else {
																toggleSnacBar(
																	'error',
																	response.error
																)
															}
														}
													})
												} else {
													swal({
														title: 'Error',
														text: 'Debe seleccionar al menos un (1) registro',
														dangerMode: true,
														icon: 'warning'
													})
												}
											}}
										>
											Deshabilitar
										</DropdownItem>
									</DropdownMenu>
								</StyledButtonDropdown> */}
              </div>
            </div>
          </div>
          <TableReactImplementation
            columns={
							props.hideOrder ? columnsWithoutOrder : columns
						}
            showAddButton
            onSubmitAddButton={() => {
						  toggleForm()
						  setEditable(true)
            }}
			textButton='boton>general>agregrar'
			msjButton
            data={items}
          />
        </>
      )}
    </div>
  )
}

const FormFeedbackSpan = styled.span`
	color: red;
`

const CenteredCol = styled(Col)`
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
`
const InputUpperCase = styled(Input)`
	text-transform: uppercase;
`

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`
const SearchContainer = styled.div`
	width: 32vw;
	min-width: 16rem;
`

const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`

export default GenericTable
