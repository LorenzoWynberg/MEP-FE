import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { parseISO, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { Button } from 'reactstrap'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'

import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'

import Table from 'Components/table/simple/'
import SimpleModal from 'Components/Modal/simple'
import FormCursoLectivo from './formCursoLectivo'
import CalendarioLanding from './landing'
import { progressInCard } from 'Utils/progress'
import ConfirmModal from 'Components/Modal/ConfirmModal'

import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import colors from 'Assets/js/colors'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

import {
  getCursosLectivosByYear,
  createCursoLectivo,
  editCursoLectivo,
  deleteCursoLectivo,
  getCalendarsByCursoLectivo,
  deleteCalendar,
  setCursoLectivoActive,
  setCursoLectivoCalendarActive,
  changeStateCursoLectivo,
  changeStateCursoLectivoCalendario
} from 'Redux/cursoLectivo/actions'

const listState = [
  { nombre: 'ACTIVA', id: 1 },
  { nombre: 'INACTIVA', id: 0 }
]

type TState = {
	calendarios: any
	cursosLectivos: any
	currentYear: any
	cursoLectivoActivo: any
}
interface IProps {
	setCurrentTab: Function
	hasAddAccess: boolean
	hasEditAccess: boolean
	hasDeleteAccess: boolean
}

type TStore = {
	cursoLectivo: TState
	educationalYear: any
}
type TCursoLectivo = {
	id: number
	nombre: string
	description: string
	estado: boolean
	fechaInicio: string
	fechaFinal: string
}

const CursosLectivos: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const { setCurrentTab } = props
  const [modalCursosLectivos, setModalCursosLectivos] =
		useState<boolean>(false)
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [confirmModalCalendar, setConfirmModalCalendar] =
		useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const [itemId, setItemId] = useState<number>(null)
  const [calendarioSeleccionado, setCalendarioSeleccionado] = useState(null)
  const [snackbar, handleClick] = useNotification()

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props

  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    setValue,
    reset,
    watch,
    control
  } = useForm()

  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })

  const handleSnackbar = (msg, variant) => {
    setSnackbarContent({ msg, variant })
    handleClick()
  }
  const actions = useActions({
    getCursosLectivosByYear,
    createCursoLectivo,
    editCursoLectivo,
    deleteCursoLectivo,
    getCalendarsByCursoLectivo,
    deleteCalendar,
    setCursoLectivoActive,
    setCursoLectivoCalendarActive,
    changeStateCursoLectivo,
    changeStateCursoLectivoCalendario
  })

  const state: TState = useSelector((store: TStore): TState => {
    return {
      cursosLectivos: store.cursoLectivo.cursosLectivos,
      calendarios: store.cursoLectivo.calendarios,
      cursoLectivoActivo: store.cursoLectivo.cursoLectivoActivo,
      currentYear: store.educationalYear.anioEducativoSeleccionado
    }
  })

  useEffect(() => {
    register('nombre')
    register('description')
    register('estado')
  }, [register])

  const verCalendarios = async (el: TCursoLectivo) => {
    progressInCard(true)
    el.id && (await actions.getCalendarsByCursoLectivo(el.id))
    await actions.setCursoLectivoActive(el)
    progressInCard(false)
    setItemId(el.id)
  }

  const addCurso = async () => {
    setModalCursosLectivos(true)
  }

  const closeModalCurso = async () => {
    setModalCursosLectivos(false)
    clearErrors()
    reset()
    setEditing(false)
    await actions.setCursoLectivoActive(null)
  }

  const updateCurso = async (el: TCursoLectivo) => {
    clearErrors()
    await actions.setCursoLectivoActive(el)
    setEditing(true)
    setModalCursosLectivos(true)
  }

  const sendData = async (data) => {
    const _data = {
      ...data,
      anioEducativoId: state.currentYear,
      estado: Boolean(data.estado.id),
      description: data.description || ''
    }
    let response
    if (state.cursoLectivoActivo?.id) {
      _data.id = state.cursoLectivoActivo.id
      response = await actions.editCursoLectivo(_data)
      handleSnackbar(
        'El curso lectivo se ha actualizado correctamente',
        'success'
      )
    } else {
      response = await actions.createCursoLectivo(_data)
      handleSnackbar('El curso lectivo se ha creado con éxito', 'success')
    }

    if (response.error) {
      handleSnackbar('Ha ocurrido un error', 'error')
    } /* else {
			handleSnackbar('El curso lectivo se ha creado con éxito', 'success')
		} */
    closeModalCurso()
  }

  const openConfirmModal = async (item): Promise<void> => {
    setConfirmModal(true)
    await actions.setCursoLectivoActive(item)
  }
  const openConfirmModalCalendar = (item): void => {
    setConfirmModalCalendar(!confirmModalCalendar)
    setCalendarioSeleccionado(item)
  }
  const closeConfirmModalCalendar = async (): Promise<void> => {
    await actions.setCursoLectivoActive(null)
    setConfirmModalCalendar(!confirmModalCalendar)
    setCalendarioSeleccionado(null)
  }
  const closeConfirmModal = async (): Promise<void> => {
    setConfirmModal(false)
    await actions.setCursoLectivoActive(null)
  }

  const changeState = async () => {
    progressInCard(true)

    const response = await actions.changeStateCursoLectivo(
      state.cursoLectivoActivo.id,
      state.cursoLectivoActivo.estado ? 0 : 1
    )
    progressInCard(false)

    if (response.error) {
      setSnackbarContent({
        variant: 'error',
        msg: response.error
      })
    } else {
      setSnackbarContent({
        variant: 'success',
        msg: `Registro ${
					state.cursoLectivoActivo.estado
						? 'deshabilitado'
						: 'habilitado'
				} con éxito`
      })
    }
    handleClick()
    closeConfirmModal()
  }
  const changeStateCalendario = async () => {
    progressInCard(true)
    const response = await actions.changeStateCursoLectivoCalendario(
      calendarioSeleccionado.id,
      calendarioSeleccionado.estado ? 0 : 1,
      state.cursoLectivoActivo.id
    )
    progressInCard(false)

    if (response.error) {
      setSnackbarContent({
        variant: 'error',
        msg: response.error
      })
    } else {
      setSnackbarContent({
        variant: 'success',
        msg: `Registro ${
					state.cursoLectivoActivo.estado
						? 'deshabilitado'
						: 'habilitado'
				} con éxito`
      })
    }
    handleClick()
    closeConfirmModalCalendar()
  }

  const editCalendar = async (el): Promise<void> => {
    setCurrentTab(2)

    await actions.setCursoLectivoCalendarActive({
      ...el,
      startDateYear: state.cursoLectivoActivo?.fechaInicio,
      endDateYear: state.cursoLectivoActivo?.fechaFinal,
      fechaFinAnioEducativo: state.cursoLectivoActivo?.fechaFinAnioEducativo,
      fechaInicioAnioEducativo: state.cursoLectivoActivo?.fechaInicioAnioEducativo
    })
  }

  const addCalendar = async (): Promise<void> => {
    setCurrentTab(2)
  }
  const data = useMemo(() => {
    return (
      state.cursosLectivos.map((el) => ({
        ...el,
        fechaInicioP: el.fechaInicio
          ? format(parseISO(el.fechaInicio), 'dd/MM/yyyy')
          : 'No definido',
        fechaFinalP: el.fechaFinal
          ? format(parseISO(el.fechaFinal), 'dd/MM/yyyy')
          : 'No definido',
        estadoP: el.estado ? 'Habilitado ' : 'Deshabilitado'
      })) || []
    )
  }, [state.cursosLectivos])
  const columns = useMemo(
    () => [
      {
        column: 'nombre',
        label: 'Nombre',
        accessor: 'nombre',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_nombre', 'Nombre'),
        actionCell: verCalendarios
      },
      {
        column: 'fechaInicioP',
        label: 'Fecha inicio',
        accessor: 'fechaInicioP',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_fecha_inicio', 'Fecha inicio')
      },
      {
        column: 'fechaFinalP',
        label: 'Fecha final',
        accessor: 'fechaFinalP',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_fecha_final', 'Fecha final')
      },
      {
        column: 'estadoP',
        label: 'Estado',
        accessor: 'estadoP',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_estado', 'Estado')
      },
      {
        column: 'actions',
        label: 'Acciones',
        accessor: 'actions',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones', 'Acciones'),
        Cell: ({ row }) => {
          if (!hasEditAccess) {
            return <></>
          }
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title={t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>hover>seleccionar', 'Seleccionar')}>
                <TouchAppIcon
                  style={{
									  color: colors?.darkGray,
									  cursor: 'pointer'
                  }}
                  onClick={() => {
									  verCalendarios(row.original)
                  }}
                  className='mr-2'
                />
              </Tooltip>
              <Tooltip title={t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>hover>actualizar', 'Actualizar')}>
                <EditIcon
                  style={{
									  color: colors?.darkGray,
									  cursor: 'pointer'
                  }}
                  onClick={() => updateCurso(row.original)}
                  className='mr-2'
                />
              </Tooltip>
              {row.original.estado
                ? (
                  <Tooltip title={t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>hover>deshabilitar', 'Deshabilitar')}>
                    <div
                      style={{
										  color: colors?.darkGray,
										  cursor: 'pointer'
                      }}
                      onClick={() => {
										  openConfirmModal(row.original)
                      }}
                    >
                      <BookDisabled />
                    </div>
                  </Tooltip>
                  )
                : (
                  <Tooltip title={t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>hover>habilitar', 'Habilitar')}>
                    <div
                      style={{
										  color: colors?.darkGray,
										  cursor: 'pointer'
                      }}
                      onClick={() => {
										  openConfirmModal(row.original)
                      }}
                    >
                      <BookAvailable />
                    </div>
                  </Tooltip>
                  )}
            </div>
          )
        }
      }
    ],
    [data, t]
  )

  const dataCalendar = useMemo(() => {
    return state.calendarios[itemId]
      ? state.calendarios[itemId].map((el) => ({
        ...el,
        fechaInicioP: el.fechaInicio
          ? format(parseISO(el.fechaInicio), 'dd/MM/yyyy')
          : 'No definido',
        fechaFinalP: el.fechaInicio
          ? format(parseISO(el.fechaFinal), 'dd/MM/yyyy')
          : 'No definido',
        estadoP: el.estado
          ? 'Habilitado '
          : 'Deshabilitado'
			  }))
      : []
  }, [state.calendarios, itemId])
  const columnsCalendar = useMemo(
    () => [
      {
        column: 'nombre',
        label: 'Nombre',
        accessor: 'nombre',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_nombre', 'Nombre')
      },
      {
        column: 'fechaInicioP',
        label: 'Fecha inicio',
        accessor: 'fechaInicioP',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_fecha_inicio', 'Fecha inicio')
      },
      {
        column: 'fechaFinalP',
        label: 'Fecha final',
        accessor: 'fechaFinalP',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_fecha_final', 'Fecha final')
      },
      {
        column: 'actions',
        label: 'Acciones',
        accessor: 'actions',
        Header: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones', 'Acciones'),
        Cell: ({ row }) => {
          if (!hasEditAccess) {
            return <></>
          }
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title={t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>hover>actualizar', 'Actualizar')}>
                <EditIcon
                  style={{
									  color: colors?.darkGray,
									  cursor: 'pointer'
                  }}
                  onClick={() => {
									  editCalendar(row.original)
                  }}
                  className='mr-2'
                />
              </Tooltip>
              {row.original.estado
                ? (
                  <Tooltip title={t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>hover>deshabilitar', 'Deshabilitar')}>
                    <div
                      style={{
										  color: colors?.darkGray,
										  cursor: 'pointer'
                      }}
                      onClick={() => {
										  openConfirmModalCalendar(
										    row.original
										  )
                      }}
                    >
                      <BookDisabled />
                    </div>
                  </Tooltip>
                  )
                : (
                  <Tooltip title='Habilitar'>
                    <div
                      style={{
										  color: colors?.darkGray,
										  cursor: 'pointer'
                      }}
                      onClick={() => {
										  openConfirmModalCalendar(
										    row.original
										  )
                      }}
                    >
                      <BookAvailable />
                    </div>
                  </Tooltip>
                  )}
            </div>
          )
        }
      }
    ],
    [dataCalendar]
  )

  const actionRow = [
    {
      actionName: 'Actualizar',
      actionFunction: (el) => updateCurso(el),
      actionDisplay: () => true,
      icon: <Icon className='fas fa-pencil-alt' />
    },
    {
      actionName: 'Deshabilitar',
      actionFunction: async (el) => openConfirmModal(el),
      actionDisplay: (el) => el.estado,
      icon: <BookDisabled />
    },
    {
      actionName: 'Habilitar',
      actionFunction: async (el) => openConfirmModal(el),
      actionDisplay: (el) => !el.estado,
      icon: <BookAvailable />
    }
  ]
  if (!hasEditAccess) {
    actionRow.splice(0, 1)
    actionRow.splice(1, 1)
    actionRow.splice(2, 1)
  }
  const actionsRowCalendar = [
    {
      actionName: 'Actualizar',
      actionFunction: (el) => editCalendar(el),
      actionDisplay: () => true,
      icon: <Icon className='fas fa-pencil-alt' />
    },
    {
      actionName: 'Deshabilitar',
      actionFunction: async (el) => openConfirmModalCalendar(el),
      actionDisplay: (el) => el.estado,
      icon: <BookDisabled />
    },
    {
      actionName: 'Habilitar',
      actionFunction: async (el) => openConfirmModalCalendar(el),
      actionDisplay: (el) => !el.estado,
      icon: <BookAvailable />
    }
  ]

  if (!hasEditAccess) {
    actionsRowCalendar.splice(0, 1)
    actionsRowCalendar.splice(1, 1)
    actionsRowCalendar.splice(2, 1)
  }
  return (
    <div>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}

      <Grid container spacing={1} className='mb-5'>
        <Grid
          item
          xs
          component={Card}
          style={{
					  margin: 16
          }}
        >
          <CardContent
            style={{
						  overflow: 'scroll'
            }}
          >
            <CardHeader>
              <CardHeaderLabel>{t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos', 'Cursos lectivos')}</CardHeaderLabel>
              {hasAddAccess && (
                <Button color='primary' onClick={addCurso}>
                  {t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>agregar>titulo', 'Agregar curso lectivo')}
                </Button>
              )}
            </CardHeader>
            <TableReactImplementation
              avoidSearch
              columns={columns}
              data={data}
            />
          </CardContent>
        </Grid>
        <Grid
          item
          xs
          component={Card}
          style={{
					  margin: 16
          }}
        >
          <CardContent>
            <CardHeader>
              <CardHeaderLabel>
                {t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados', 'Calendarios asociados')}
                {state.cursoLectivoActivo && (
                  <span>
                    {state.cursoLectivoActivo.nombre}
                  </span>
                )}
              </CardHeaderLabel>
              {hasAddAccess && (
                <div>
                  {itemId && (
                    <Button
                    color='primary'
                    onClick={() => addCalendar()}
                  >
                    {t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendario', 'Agregar calendario')}
                  </Button>
                  )}
                </div>
              )}
            </CardHeader>

            {itemId
              ? (
                <>
                  <TableReactImplementation
                    avoidSearch
                    columns={columnsCalendar}
                    data={dataCalendar}
                  />
                </>
                )
              : (
                <CalendarioLanding
                  txt={t("configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>mensaje_seleccione", "Selecciona un curso lectivo para ver los calendarios asociados")}
                />
                )}
          </CardContent>
        </Grid>
      </Grid>

      <SimpleModal
        openDialog={modalCursosLectivos}
        onClose={closeModalCurso}
        onConfirm={handleSubmit(sendData)}
        txtBtn={editing ? t('general>actualizar', 'Actualizar') : t('general>agregar', 'Agregar')}
        txtBtnCancel={t('general>cancelar', 'Cancelar')}
        title={`${editing ? t('general>actualizar', 'Actualizar') : t('general>agregar', 'Agregar')} ${t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>agregar>titulo', 'curso lectivo')}`}
      >
        <FormCursoLectivo
          editing={editing}
          errors={errors}
          register={register}
          watch={watch}
          setValue={setValue}
          control={control}
          data={state.cursoLectivoActivo}
        />
      </SimpleModal>

      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfirmModal}
        onConfirm={changeState}
        colorBtn='primary'
        txtBtn={
					state.cursoLectivoActivo?.estado
					  ? t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>Deshabilitar', 'Deshabilitar')
					  : t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>Habilitar', 'Habilitar')
				}
        txtBtnCancel={t('general>cancelar', 'Cancelar')}
        msg={`${t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>inicio_pregunta', '¿Está seguro que desea')} ${
					state.cursoLectivoActivo?.estado
						? t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>deshabilitar', 'deshabilitar')
						: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>habilitar', 'habilitar')
				} ${t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>final_pregunta', ' el curso lectivo:')} ${state.cursoLectivoActivo?.nombre} ?`}
        title={`${
					state.cursoLectivoActivo?.estado
						? t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>Deshabilitar', 'Deshabilitar')
						: t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>Habilitar', 'Habilitar')
				} ${t('configuracion>anio_educativo>columna_acciones>ver>cursos_lectivos>columna_acciones>deshabilitar>curso_lectivo', 'curso lectivo')}`}
      />

      <ConfirmModal
        openDialog={confirmModalCalendar}
        onClose={closeConfirmModalCalendar}
        onConfirm={changeStateCalendario}
        colorBtn='primary'
        txtBtn={
					calendarioSeleccionado?.estado
					  ? t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>Deshabilitar', 'Deshabilitar')
					  : t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>Habilitar', 'Habilitar')
				}
        msg={`${t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>mensaje_inicio', '¿Está seguro que desea')} ${
					calendarioSeleccionado?.estado
						? t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>deshabilitar', 'deshabilitar')
						: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>habilitar', 'habilitar')
				} ${t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>mensaje_final', 'el calendario asociado:')} ${calendarioSeleccionado?.nombre} ?`}
        title={`${
					calendarioSeleccionado?.estado
						? t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>Deshabilitar', 'Deshabilitar')
						: t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>Habilitar', 'Habilitar')
				} ${t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>columna_acciones>deshabilitar>titulo', 'calendario asociado')}`}
      />
    </div>
  )
}

const Icon = styled.i`
	font-size: 14px;
`

const CardHeader = styled.div`
	padding: 10px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const CardHeaderLabel = styled.h4`
	margin: 0;
	span {
		width: 100%;
		position: relative;
		float: left;
		font-size: 12px;
		color: #908a8a;
		font-weight: 600;
	}
`

export default CursosLectivos
