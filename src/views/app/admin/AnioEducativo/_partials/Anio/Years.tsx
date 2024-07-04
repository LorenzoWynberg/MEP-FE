import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

import swal from 'sweetalert'
import moment from 'moment'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import { progressInCard, showProgress, hideProgress } from 'Utils/progress'
import SimpleModal from 'Components/Modal/simple'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import FormAnioEducativo from './formAnioEducativo'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'

import { HiDuplicate } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

import {
  getEducationalYears,
  createEducationalYears,
  editEducationalYears,
  deleteEducationalYear,
  toDisabledEducationalYear,
  cleanError,
  setAnioEducativoSelected,
  duplicateYear
} from 'Redux/anioEducativo/actions'

import { getCursosLectivosByYear } from 'Redux/cursoLectivo/actions'
import { Button } from 'reactstrap'
import EditIcon from '@material-ui/icons/Edit'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DeleteIcon from '@material-ui/icons/Delete'

type IProps = {
	setCurrentTab: Function
	setCurrentYear: Function
	match?: any
	hasAddAccess: boolean
	hasEditAccess: boolean
	hasDeleteAccess: boolean
}

const schema = yup.object().shape({
  nombre: yup.string().required('Este campo es requerido'),
  estado: yup.string().required('Este campo es requerido')
})

const Years: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const {
    register,
    errors,
    setValue,
    reset,
    clearErrors,
    handleSubmit,
    setError,
    watch,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      estado: 1,
      fechaInicio: null,
      fechaFin: null,
      nombre: ''
    }
  })

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props
  const [editing, setEditing] = useState<boolean>(false)
  const [editable, setEditable] = useState<boolean>(false)
  const [openModalDisabled, setOpenModalDisabled] = useState<boolean>(false)
  const [anioSelected, setAnioSelected] = useState(null)
  const [itemId, setItemId] = useState(null)
  const [snackbar, handleClick] = useNotification()
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)

  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })

  const actions = useActions({
    getEducationalYears,
    createEducationalYears,
    editEducationalYears,
    deleteEducationalYear,
    getCursosLectivosByYear,
    cleanError,
    toDisabledEducationalYear,
    setAnioEducativoSelected,
    duplicateYear
  })

  const state = useSelector((store: any) => {
    return {
      years: store.educationalYear.aniosEducativos,
      errors: store.educationalYear.errors,
      eFields: store.educationalYear.fields
    }
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getEducationalYears()
    }
    fetch()
  }, [])

  useEffect(() => {
    register('fechaInicio')
    register('fechaFin')
    register('nombre')
    register('estado')
  }, [register])

  useEffect(() => {
    setData(
      state.years.map((item, i) => {
        const numberKey = i + 1
        return {
          ...item,
          key: numberKey.toString().padStart(3, '0'),
          fechaInicioP: item.fechaInicio
            ? moment(item.fechaInicio).format('DD/MM/YYYY')
            : 'No definido',
          fechaFinP: item.fechaFin
            ? moment(item.fechaFin).format('DD/MM/YYYY')
            : 'No definido',
          estadoP: item.esActivo ? 'ACTIVO' : 'PASIVO'
        }
      })
    )
  }, [state.years])

  const onchangeNombre = (value) => {
    setValue('nombre', value)
  }

  const clear = async () => {
    reset()
    clearErrors()
    setItemId(null)
    setEditing(false)
    setEditable(false)
    await actions.cleanError()
  }

  const closeModal = async () => {
    setModal(false)
    await clear()
  }

  const editYears = (el: any): void => {
    setModal(true)
    setEditing(true)
    setAnioSelected(el)
    setItemId(el.id)
    setValue('estado', el.esActivo ? '1' : '0')
    setValue('nombre', new Date(el.nombre, 1, 1))
    setValue('fechaInicio', moment(el.fechaInicio).format('YYYY-MM-DD'))
    setValue('fechaFin', moment(el.fechaFin).format('YYYY-MM-DD'))
  }

  const addYears = (el: object = {}): void => {
    reset()
    setEditable(true)
    setModal(true)
  }

  const sendData = async (data) => {
    const date = moment(new Date(data.nombre)).format('YYYY')

    const _data = {
      nombre: `${date}`,
      esActivo: data.estado > 0,
      estado: true,
      fechaInicio: moment(new Date(data.fechaInicio)).format(
        'MM-DD-YYYY'
      ),
      fechaFin: moment(new Date(data.fechaFin)).format('MM-DD-YYYY')
    }

    let response
    if (itemId) {
      response = await actions.editEducationalYears({
        ..._data,
        id: itemId
      })
    } else {
      response = await actions.createEducationalYears(_data)
    }
    if (!response.error) {
      if (itemId) {
        setSnackbarContent({
          variant: 'success',
          msg: 'El año educativo se ha actualizado con éxito'
        })
      } else {
        setSnackbarContent({
          variant: 'success',
          msg: `El año educativo se ha ${
						itemId ? 'actualizado' : 'insertado'
					} correctamente`
        })
      }
      handleClick()
      closeModal()
    } else {
      setSnackbarContent({
        variant: 'error',
        msg: 'Error al insertar registro'
      })
      handleClick()
    }
  }

  const selectedYear = async (el) => {
    progressInCard(true)
    await actions.getCursosLectivosByYear(el)
    progressInCard(false)
    props.setCurrentTab(1)
    props.setCurrentYear(el)
    actions.setAnioEducativoSelected(el)
  }

  const deleteYear = async (el) => {
    const cancelar = t('general>cancelar', 'Cancelar')
    const aceptar = t('general>aceptar', 'Aceptar')
    await swal({
      title: t('configuracion>anio_educativo>eliminar>titulo', 'Atención'),
      text: t('configuracion>anio_educativo>eliminar>mensaje', '¿Está seguro que desea eliminar el año educativo?'),
      dangerMode: true,
      icon: 'warning',
      buttons: [cancelar, aceptar]
    }).then(async (val) => {
      if (val) {
        const response = await actions.deleteEducationalYear(el.id)
        if (response.error) {
          setSnackbarContent({
            variant: 'error',
            msg: response.error
          })
        } else {
          setSnackbarContent({
            variant: 'success',
            msg: t('configuracion>anio_educativo>eliminar>mensaje_exitoso', 'Registro eliminado con exito')
          })
        }
        handleClick()
      }
    })
  }

  const handleToDisable = async (item) => {
    setOpenModalDisabled(true)
    setAnioSelected(item)
  }

  const onToDisable = async () => {
    const response = await actions.toDisabledEducationalYear(
      anioSelected.id
    )
    if (response.error) {
      setSnackbarContent({
        variant: 'error',
        msg: response.error
      })
    } else {
      setSnackbarContent({
        variant: 'success',
        msg: 'Registro deshabilitado con exito'
      })
    }
    setOpenModalDisabled(false)
  }

  const closeConfirmModal = (e) => {
    setOpenModalDisabled(false)
    setAnioSelected(null)
  }

  const columns = useMemo(() => {
    return [
      {
        Header: t('configuracion>anio_educativo>columna_codigo', 'Código'),
        column: 'key',
        accessor: 'key',
        label: ''
      },
      {
        Header: t('configuracion>anio_educativo>columna_anio_educativo', 'Año educativo'),
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: t('configuracion>anio_educativo>columna_fecha_inicio', 'Fecha inicio'),
        column: 'fechaInicioP',
        accessor: 'fechaInicioP',
        label: ''
      },
      {
        Header: t('configuracion>anio_educativo>columna_fecha_final', 'Fecha final'),
        column: 'fechaFinP',
        accessor: 'fechaFinP',
        label: ''
      },
      {
        Header: t('configuracion>anio_educativo>columna_estado', 'Estado'),
        column: 'estadoP',
        accessor: 'estadoP',
        label: ''
      },
      {
        Header: t('configuracion>anio_educativo>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div
              className='d-flex justify-content-center align-items-center'
              style={{ gap: '15px' }}
            >
              {hasEditAccess && (
                <Tooltip title={t('configuracion>anio_educativo>columna_acciones>hover>ver', 'Ver')}>
                  <VisibilityIcon
                    onClick={() => {
										  selectedYear(fullRow.id)
                    }}
                    style={{
										  fontSize: 25,
										  color: colors.darkGray,
										  cursor: 'pointer'
                    }}
                  />
                </Tooltip>
              )}
              {hasEditAccess && (
                <Tooltip title={t('configuracion>anio_educativo>columna_acciones>hover>editar', 'Editar')}>
                  <EditIcon
                    onClick={() => {
										  editYears(fullRow)
                    }}
                    style={{
										  fontSize: 25,
										  color: colors.darkGray,
										  cursor: 'pointer'
                    }}
                  />
                </Tooltip>
              )}
              {/* {fullRow.esActivo && hasEditAccess && (
								<Tooltip title="Deshabilitar">
									<>
										<div
											onClick={handleToDisable}
											style={{
												cursor: 'pointer'
											}}
										>
											<BookDisabled
												onClick={handleToDisable}
												style={{
													fontSize: 25,
													color: colors.darkGray,
													cursor: 'pointer'
												}}
											/>
										</div>
									</>
								</Tooltip>
							)} */}
              {hasDeleteAccess && (
                <Tooltip title={t('configuracion>anio_educativo>columna_acciones>hover>eliminar', 'Eliminar')}>
                  <DeleteIcon
                    onClick={() => {
										  deleteYear(fullRow)
                    }}
                    style={{
										  fontSize: 25,
										  color: colors.darkGray,
										  cursor: 'pointer'
                    }}
                  />
                </Tooltip>
              )}
              {hasEditAccess && (
                <Tooltip title={t('configuracion>anio_educativo>columna_acciones>hover>duplicar', 'Duplicar')}>
                  <div
                    onClick={() => {
										  cloneYear(fullRow)
                    }}
                  >
                    <HiDuplicate
                      style={{
											  fontSize: 25,
											  color: colors.darkGray,
											  cursor: 'pointer'
                      }}
                    />
                  </div>
                </Tooltip>
              )}
            </div>
          )
        }
      }
    ]
  }, [data, t])

  const cloneYear = async (e) => {
    try {
      showProgress()

      const response = await actions.duplicateYear(e.id)
      hideProgress()
      response.error &&
				setSnackbarContent({
				  variant: 'error	',
				  msg: 'No se pudo duplicar el año'
				})
      !response.error &&
				setSnackbarContent({
				  variant: 'success',
				  msg: 'Se duplico el año correctamente'
				})
      handleClick()
    } catch (error) {
      hideProgress()
      setSnackbarContent({
        variant: 'error	',
        msg: 'No se pudo duplicar el año'
      })
      handleClick()
    }
  }

  const actionsRow = [
    {
      actionName: 'crud.select',
      actionFunction: selectedYear,
      actionDisplay: () => true
    },
    {
      actionName: 'label.edit',
      actionFunction: (el) => editYears(el),
      actionDisplay: () => true
    },
    {
      actionName: 'label.toDisable',
      actionFunction: handleToDisable,
      actionDisplay: (data) => {
        if (data.esActivo) {
          return true
        } else {
          return false
        }
      }
    },
    {
      actionName: 'label.delete',
      actionFunction: async (el) => deleteYear(el),
      actionDisplay: () => true
    }
  ]

  if (!hasEditAccess) {
    actionsRow.splice(0, 1)
    actionsRow.splice(1, 1)
    actionsRow.splice(2, 1)
  }

  if (!hasDeleteAccess) {
    actionsRow.splice(3, 1)
  }

  return (
    <div>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      <Helmet>
        <title>Año educativo</title>
      </Helmet>

      <SimpleModal
        openDialog={modal}
        onClose={closeModal}
        onConfirm={handleSubmit(sendData)}
        colorBtn='primary'
        txtBtn={editing ? t('configuracion>anio_educativo>editar>guardar', 'Guardar') : t('configuracion>anio_educativo>agregar>agregar', 'Agregar')}
        txtBtnCancel={t('general>cancelar', 'Cancelar')}
        title={`${editing ? t('configuracion>anio_educativo>editar>actualizar', 'Actualizar') : t('configuracion>anio_educativo>agregar>agregar', 'Agregar')} ${t('configuracion>anio_educativo>agregar>anio_educativo', 'año educativo')}`}
      >
        <FormAnioEducativo
          editable
          getValues={getValues}
          editing={editing}
          errors={errors}
          state={state}
          onchangeNombre={onchangeNombre}
          setValue={setValue}
          watch={watch}
          register={register}
        />
      </SimpleModal>
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {hasAddAccess && (
            <Button
              onClick={() => {
							  addYears()
              }}
              color='primary'
            >
              {t('general>agregar', 'Agregar')}
            </Button>
          )}
        </div>
        <TableReactImplementation
          data={data}
          handleGetData={() => {}}
          columns={columns}
          orderOptions={[]}
        />
      </div>

      <ConfirmModal
        openDialog={openModalDisabled}
        onClose={closeConfirmModal}
        onConfirm={onToDisable}
        colorBtn='primary'
        txtBtn='Deshabilitar'
        msg='¿Está seguro que desea deshabilitar el año educativo?'
        title='Deshabilitar año educativo'
      />
    </div>
  )
}

export default Years
