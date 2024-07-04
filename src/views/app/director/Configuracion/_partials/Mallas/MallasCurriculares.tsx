import React, { useState, useEffect, useMemo } from 'react'
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  CustomInput
} from 'reactstrap'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import colors from 'Assets/js/colors'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import {
  getAllAsignaturas,
  getTiposEvaluacion
} from '../../../../../../redux/asignaturas/actions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import {
  saveMalla,
  getMallas,
  getMalla,
  saveMallaAsignatura,
  editMallaAsignatura,
  editMalla,
  getLvlOfertas,
  saveOfertasList,
  getPeriodoBloques,
  deleteMallasAsignaturasMultiples,
  cleanBloques,
  syncMalla
} from '../../../../../../redux/mallasCurriculares/actions'
import LaunchIcon from '@material-ui/icons/Launch'
import { getCatalogs } from '../../../../../../redux/selects/actions'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import { getAllComponenteCalificacion } from '../../../../../../redux/componentesEvaluacion/actions'
import { GetByIdAnio } from '../../../../../../redux/periodos/actions'
import {
  getLevelsByModel,
  getOfferModels,
  getSpecialtiesByModel,
  cleanLvlsState
} from '../../../../../../redux/modelosOferta/actions'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import DeleteIcon from '@material-ui/icons/Delete'
import { getIndicadorAprendizaje } from '../../../../../../redux/IndicadoresAprendizaje/actions'
import useNotification from '../../../../../../hooks/useNotification'
import moment from 'moment'
import swal from 'sweetalert'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import GridEscalaCalificacion from './GridEscalaCalificacion'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import Feedback from 'Components/Form/feedback'
import { sortBy } from 'lodash'
import { getElementFromObject } from './utils'
import { IoMdTrash } from 'react-icons/io'
import { RiPencilFill } from 'react-icons/ri'
import { IoEyeSharp } from 'react-icons/io5'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import { getAllPeriodos } from 'Redux/periodos/actions'

const MallasCurriculares = () => {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const [listData, setListData] = useState([])
  const [edit, setEdit] = useState(false)
  const [sortedLevels, setSortedLevels] = useState<any>([])
  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    variant: 'error',
    msg: 'error'
  })
  const [createAsignaturaOpen, setCreateAsignaturaOpen] = useState(false)
  const [stagedAsignaturas, setStagedAsignaturas] = useState({})
  const [asignaturasParsed, setAsignaturasParsed] = useState([])
  const [data, setData] = useState({ mallaCurricularAsignatura: [] })
  const [currentComponent, setCurrentComponent] = useState(null)
  const [createMallaAsignaturaData, setCreateMallaAsignaturaData] = useState({
    nivelOferta: {},
    sendData: {},
    currentLevel: {},
    currentAsignatura: {}
  })
  const [createMallaAsignaturaOpen, setCreateMallaAsignaturaOpen] =
    useState(false)
  const [createMallaAsignaturaOpenTab, setCreateMallaAsignaturaOpenTab] =
    useState(0)
  const [newAsignatura, setNewAsignatura] = useState(null)
  const [stagedComponentes, setStagedComponentes] = useState([])
  const [currentSpeciality, setCurrentSpeciality] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [dataToDelete, setDataToDelete] = useState(null)
  const [showMultipleDeleteModal, setShowMultipleDeleteModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [multipleDataToDelete, setMultipleDataToDelete] = useState<{
    elementsIds: Array<any>
    asignaturaId: number
  } | null>(null)
  const [syncMallaModal, setSyncMallaModal] = useState<{show: boolean, selectedYear: Number}>({show:false, selectedYear: null})

  const actions = useActions({
    syncMalla,
    getOfferModels,
    getAllAsignaturas,
    saveMalla,
    getMallas,
    getMalla,
    saveMallaAsignatura,
    getCatalogs,
    getTiposEvaluacion,
    getAllComponenteCalificacion,
    GetByIdAnio,
    getSpecialtiesByModel,
    getLevelsByModel,
    getLvlOfertas,
    saveOfertasList,
    editMallaAsignatura,
    editMalla,
    getIndicadorAprendizaje,
    cleanLvlsState,
    getPeriodoBloques,
    deleteMallasAsignaturasMultiples,
    cleanBloques,
    getAllPeriodos
  })

  const state = useSelector((store:any) => {
    return {
      modelOffers: store.modelosOfertas.modelOffers,
      currentOfferSpecialties: store.modelosOfertas.currentOfferSpecialties,
      currentOfferLevels: store.modelosOfertas.currentOfferLevels,
      ...store.authUser,
      ...store.asignaturas,
      ...store.mallasCurriculares,
      ...store.componentesEvaluacion,
      ...store.periodos,
      periodosAll: store.periodos.periodosAll.filter(i=>i.esActivo) || [] ,
      ...store.selects,
      ...store.indicadorAprendizaje,
      anioEducativoCatalog: store.authUser.activeYears?.map(i=>({...i, label: i.nombre, value: i.id}))
    }
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getCatalogs(catalogsEnumObj.TIPOEVALUACION.id)
      await actions.getAllComponenteCalificacion()
      await actions.getIndicadorAprendizaje()
      await actions.getTiposEvaluacion()
    }
    fetch()
  }, [])

  useEffect(() => {
    const fetch = async () => {
      await actions.cleanBloques()
    }
    fetch()
  }, [createMallaAsignaturaOpen])

  useEffect(() => {
    if (!edit) {
      handlePagination()
    }
  }, [edit])

  useEffect(() => {
    setListData(
      state.mallas.entityList.map((el) => ({
        ...el,
        activo: el.esActivo ? 1 : 0,
        estadoP: el.esActivo ? 'Activo' : 'Inactivo',
        lecciones: el.lecciones ? el.lecciones : 0
      }))
    )
  }, [state.mallas.entityList])

  useEffect(() => {
    if (data.id || data.ofertaId) {
      const id = data.ofertaId || data.sb_modeloOfertaId || data.id
      getItemLvlsAndSp(id)
    }
  }, [data.id, data.ofertaId])

  useEffect(() => {
    if (state.selectedActiveYear.id) {
      // actions.GetByIdAnio(state.selectedActiveYear.id)
      actions.getOfferModels()
      actions.getAllAsignaturas()
      handlePagination()
    }
  }, [state.selectedActiveYear.id])
  useEffect(() => {
    if (state.currentMalla.id) {
      const _data = {
        ...state.currentMalla,
        activo: state.currentMalla.esActivo ? 1 : 0
      }
      setData({ ...data, ..._data })
      const asignaturasMallaByAsignature = {}
      sortBy(
        state.currentMalla.mallaCurricularAsignatura,
        'asignaturanombre'
      )?.forEach((item) => {
        asignaturasMallaByAsignature[item.sb_asignaturaId] =
          asignaturasMallaByAsignature[item.sb_asignaturaId]
            ? [...asignaturasMallaByAsignature[item.sb_asignaturaId], item]
            : [item]
      })
      setStagedAsignaturas(asignaturasMallaByAsignature)
    } else {
      setData({ mallaCurricularAsignatura: [] })
    }
  }, [
    state.currentMalla,
    state.currentMalla.mallaCurricularAsignatura,
    state.currentMallaAsignatura.id
  ])

  useEffect(() => {
    if (state.currentMallaAsignatura.id) {
      setCreateMallaAsignaturaData({
        ...createMallaAsignaturaData,
        sendData: {
          ...state.currentMallaAsignatura,
          creditosOn: state.currentMallaAsignatura.creditos > 0
        }
      })
      setStagedComponentes(
        state.currentMallaAsignatura?.asignaturaMallaComponenteCalificacion ||
          []
      )
      const asignaturasMallaByAsignature = {}
      sortBy(
        state.currentMalla.mallaCurricularAsignatura,
        'asignaturanombre'
      ).forEach((item) => {
        asignaturasMallaByAsignature[item.sb_asignaturaId] =
          asignaturasMallaByAsignature[item.sb_asignaturaId]
            ? [...asignaturasMallaByAsignature[item.sb_asignaturaId], item]
            : [item]
      })
      setStagedAsignaturas(asignaturasMallaByAsignature)
    } else {
      setCreateMallaAsignaturaData({
        nivelOferta: {},
        sendData: {},
        currentLevel: {},
        currentAsignatura: {}
      })
    }
  }, [state.currentMallaAsignatura])

  useEffect(() => {
    setCurrentSpeciality(state.currentOfferSpecialties[0])
  }, [state.currentOfferSpecialties])

  useEffect(() => {
    //
    actions.getAllPeriodos()
    // actions.getPeriodoBloques(createMallaAsignaturaData.sendData.sb_periodoId)
  }, [])

  useEffect(() => {
    if (state.currentOfferLevels.length > 0) {
      setSortedLevels(sortBy(state.currentOfferLevels, 'orden'))
    }
  }, [state.currentOfferLevels])

  useEffect(() => {
    setAsignaturasParsed(
      getElementFromObject(stagedAsignaturas, state.asignaturas)
    )
  }, [stagedAsignaturas])

  const toggle = (data = { mallaCurricularAsignatura: [] }) => {
    setModalOpen(!modalOpen)
    setData(data)
  }

  const toggleEditData = (el) => {
    actions.getMalla(el.id)
    getItemLvlsAndSp(el.sb_modeloOfertaId)
    setData({ ...data, ...el })
    toggleEdit()
  }

  const toggleCreateAsignatura = () => {
    setNewAsignatura(null)

    setCreateAsignaturaOpen(!createAsignaturaOpen)
  }

  const toggleEdit = () => {
    setEdit(!edit)
    if (edit) {
      actions.cleanLvlsState()
    }
  }

  const sendData = async (data) => {
    let response
    if (data.id) {
      response = await actions.editMalla({
        id: data.id,
        nombre: data.nombre,
        estado: true,
        esActivo: data.esActivo,
        sb_modeloOfertaId: data.sb_modeloOfertaId,
        sb_anioEducativoId: data.sb_anioEducativoId
      })
      !response.error && actions.cleanLvlsState()
    } else {
      response = await actions.saveMalla({
        nombre: data.nombre,
        estado: true,
        sb_modeloOfertaId: data.ofertaId,
        sb_anioEducativoId: state.selectedActiveYear.id
      })
      !response.error && toggleEdit()
    }
    !response.error && setModalOpen(!modalOpen)
  }

  const handleSnackbar = (msg, variant) => {
    setSnackbarContent({ msg, variant })
    handleClick()
  }

  const updateData = (el = null, disable = false) => {
    const _data = el || data
    let response = null
    response = actions.editMalla(
      {
        id: _data.id,
        nombre: _data.nombre,
        estado: true,
        esActivo: _data.activo > 0,
        sb_modeloOfertaId: _data.sb_modeloOfertaId,
        sb_anioEducativoId: state.selectedActiveYear.id
      },
      disable
    )
    if (!response.error && _data.activo === 0) {
      handleSnackbar('Se ha deshabilitado correctamente.', 'success')
    } else if (!response.error && _data.activo === 1) {
      handleSnackbar('Se ha habilitado correctamente.', 'success')
    }
  }

  const deleteSingleData = async () => {
    if (!dataToDelete) return
    await actions.editMalla(
      {
        id: dataToDelete.id,
        nombre: dataToDelete.nombre,
        estado: false,
        esActivo: dataToDelete.activo > 0,
        sb_modeloOfertaId: dataToDelete.sb_modeloOfertaId,
        sb_anioEducativoId: state.selectedActiveYear.id
      },
      true
    )
    setShowDeleteModal(false)
  }

  const validationsSchema = (data): boolean => {
    setErrors({})
    let _errors = {}
    let error = false
    if (!data.cantidadLecciones) {
      _errors = { ..._errors, cantidadLecciones: true }
      error = true
    }
    if (Number(data.sb_tipoEvaluacionId) === 2) {
      if (!data.notadepromocion) {
        _errors = { ..._errors, notadepromocion: true }
        error = true
      }
    }
    setErrors(_errors)
    return error
  }

  const createMallaAsignatura = async () => {
    const _sendData = {
      ...createMallaAsignaturaData.sendData,
      cantidadLecciones: createMallaAsignaturaData.sendData.cantidadLecciones
        ? parseInt(createMallaAsignaturaData.sendData.cantidadLecciones)
        : 0,
      opcional: true,
      // sb_nivelOfertaId: createMallaAsignaturaData.nivelOferta.id,
      SB_NivelesModeloId: createMallaAsignaturaData.currentLevel.nivelModeloId,
      sb_mallaCurricularId: data.id,
      sb_tipoEvaluacionId:
        createMallaAsignaturaData.sendData.sb_tipoEvaluacionId,
      sb_elementosCatalogoId:
        createMallaAsignaturaData.sendData.sb_elementosCatalogoId,
      sb_asignaturaId: createMallaAsignaturaData.currentAsignatura.id,
      sb_periodoId: createMallaAsignaturaData.sendData.sb_periodoId,
      notadepromocion: createMallaAsignaturaData.sendData.notadepromocion,
      creditos: parseInt(createMallaAsignaturaData.sendData.creditos),
      redondeo: parseInt(createMallaAsignaturaData.sendData.redondeo),
      sb_rubricaAprendizajeId: parseInt(
        createMallaAsignaturaData.sendData.sb_rubricaAprendizajeId
      ),
      estado: true,
      escalaCalificacion:
        createMallaAsignaturaData?.sendData?.escalaCalificacion
    }
    const isValidated = validationsSchema(_sendData)

    if (isValidated) return

    let response = null
    setLoading(true)

    if (
      stagedComponentes.length > 0 &&
      stagedComponentes.reduce((prevValue, nextValue) => {
        return prevValue + parseInt(nextValue.valor)
      }, 0) !== 100
    ) {
      setSnackbarContent({
        variant: 'error',
        msg: 'El porcentaje de los componentes de calificación debe sumar 100%'
      })
      handleClick()
      return
    }

    if (createMallaAsignaturaData.sendData.id) {
      response = await actions.editMallaAsignatura(_sendData)
      if (
        !response.error &&
        (createMallaAsignaturaData.sendData.sb_tipoEvaluacionId == 2 ||
          createMallaAsignaturaData.sendData.sb_tipoEvaluacionId == 4) &&
        createMallaAsignaturaOpenTab === 0
      ) {
        setSnackbarContent({
          variant: 'success',
          msg: 'Se ha guardado correctamente. Por favor ingrese los componentes de calificación'
        })
        handleClick()
      } else if (!response.error) {
        setSnackbarContent({
          variant: 'success',
          msg: 'Se ha guardado correctamente.'
        })
        handleClick()
        toggleCreateMallaAsignatura()
      }
      senDataComponentesCalificacion()
    } else {
      response = await actions.saveMallaAsignatura(_sendData)
      if (
        !response.error &&
        (createMallaAsignaturaData.sendData.sb_tipoEvaluacionId == 2 ||
          createMallaAsignaturaData.sendData.sb_tipoEvaluacionId == 4)
      ) {
        setCreateMallaAsignaturaOpenTab(1)
        setSnackbarContent({
          variant: 'success',
          msg: 'Se ha guardado correctamente. Por favor ingrese los componentes de calificación'
        })
        handleClick()
      } else if (!response.error) {
        setSnackbarContent({
          variant: 'success',
          msg: 'Se ha guardado correctamente.'
        })
        handleClick()
        toggleCreateMallaAsignatura()
      }
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]:
        e.target.name === 'nombre'
          ? e.target.value.toUpperCase()
          : e.target.value
    })
  }

  const handlePagination = (
    pageNumber = 1,
    pageSize = 10,
    searchValue = ''
  ) => {
    actions.getMallas(pageNumber, pageSize, searchValue)
  }

  const deleteMultipleData = async () => {
    if (!multipleDataToDelete) return

    const { elementsIds, asignaturaId } = multipleDataToDelete
    const _elementos = elementsIds.filter((item) => item)
    if (_elementos.length < 1) {
      const _stagedAsignatures = { ...stagedAsignaturas }
      delete _stagedAsignatures[asignaturaId]
      setStagedAsignaturas(_stagedAsignatures)
      return
    }
    await actions.deleteMallasAsignaturasMultiples(_elementos)

    setShowMultipleDeleteModal(false)
  }

  const toggleCreateMallaAsignatura = (
    currentAsignatura = {},
    currentLevel = {},
    sendData = null
  ) => {
    const levels = state.currenNivelesOferta.filter((el) => {
      if (!currentSpeciality) {
        return el.nivelId === currentLevel.id
      }
      return (
        el.nivelId === currentLevel.id &&
        el.especialidadId === currentSpeciality.id
      )
    })

    setCreateMallaAsignaturaData({
      sendData: sendData
        ? { ...sendData, creditosOn: sendData.creditos > 0 }
        : {},
      currentLevel,
      currentAsignatura,
      nivelOferta:
        levels.length > 1 ? levels.find((el) => el.calendarioId) : levels[0]
    })
    setStagedComponentes(sendData?.asignaturaMallaComponenteCalificacion || [])
    setCreateMallaAsignaturaOpenTab(0)
    setCreateMallaAsignaturaOpen(!createMallaAsignaturaOpen)
  }

  const handleCreateMallaDataChange = (e) => {
    setCreateMallaAsignaturaData({
      ...createMallaAsignaturaData,
      sendData: {
        ...createMallaAsignaturaData.sendData,
        [e.target.name]: e.target.value
      }
    })
  }

  const senDataComponentesCalificacion = async () => {
    const _data = {
      listItems: stagedComponentes,
      mallaAsignaturaId: createMallaAsignaturaData.sendData.id
    }
    const response = await actions.saveOfertasList(_data, data.id)
    if (!response.error) {
      setSnackbarContent({
        variant: 'success',
        msg: 'Se ha guardado correctamente.'
      })
      handleClick()
      toggleCreateMallaAsignatura()
    }
  }

  const addDataComponenteCalificacion = () => {
    setStagedComponentes([
      ...stagedComponentes,
      {
        orden: 0,
        valor: 0,
        etiqueta: '',
        estado: true,
        sb_mallaCurricularAsignaturaId: createMallaAsignaturaData.sendData.id,
        sb_componenteCalificacionId: null
      }
    ])
  }

  const handleComponenteChange = (e, index) => {
    const copiedComponents = [...stagedComponentes]
    copiedComponents[index][e.target.name] = e.target.value
    setStagedComponentes(copiedComponents)
  }

  const handleComponenteChangeSelect = (e, index) => {
    const copiedComponents = [...stagedComponentes]
    copiedComponents[index].sb_componenteCalificacionId = e.id
    copiedComponents[index].noRequiereInstrumentos = e.noRequiereInstrumentos
    setStagedComponentes(copiedComponents)
  }

  const getItemLvlsAndSp = async (id: number) => {
    await actions.getLvlOfertas(id)
    await actions.getLevelsByModel(id)
    await actions.getSpecialtiesByModel(id)
  }

  const setEscalaCalificacion = (array) => {
    const _sendData = {
      ...createMallaAsignaturaData.sendData,
      escalaCalificacion: array
    }

    setCreateMallaAsignaturaData({
      ...createMallaAsignaturaData,
      sendData: _sendData
    })
  }

  const handleCreateAsignatura = () => {
    const asignaturasMallaByAsignature = {}
    sortBy(
      state.currentMalla.mallaCurricularAsignatura
        ? [...state.currentMalla.mallaCurricularAsignatura, newAsignatura]
        : [newAsignatura],
      'nombre'
    )?.forEach((item) => {
      asignaturasMallaByAsignature[item.sb_asignaturaId || item.id] =
        asignaturasMallaByAsignature[item.sb_asignaturaId || item.id]
          ? [
              ...asignaturasMallaByAsignature[item.sb_asignaturaId || item.id],
              item
            ]
          : [item]
    })
    setStagedAsignaturas(asignaturasMallaByAsignature)
  }

  const columns = useMemo(() => {
    return [
      {
        Header: t('configuracion>mallas_curriculares>columna_nombre', 'Nombre'),
        column: 'nombre',
        accessor: 'nombre',
        label: '',
        Cell: ({ value }) => <div>{value?.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>columna_asignatura_figura_afin', 'Asignatura/figura afín'),
        column: 'asignaturas',
        accessor: 'asignaturas',
        label: ''
      },
      {
        Header: t('configuracion>mallas_curriculares>columna_total_lecciones', 'Total de lecciones'),
        column: 'lecciones',
        accessor: 'lecciones',
        label: ''
      },
      {
        Header: t('configuracion>mallas_curriculares>columna_estado', 'Estado'),
        column: 'estadoP',
        accessor: 'estadoP',
        label: '',
        Cell: ({ value }) => <div>{value?.toUpperCase()}</div>
      },
      {
        Header: t('configuracion>mallas_curriculares>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center'
              }}
            >
              <button
                className='btn-void'
                onClick={() => {
                  toggleEditData(fullRow)
                }}
              >
                <Tooltip title={t("estudiantes>expediente>buscador>col_acciones>ver", "Ver")}>
                  <IconButton>
                    <IoEyeSharp style={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </button>
              <button
                className='btn-void'
                onClick={() => {
                  toggle(fullRow)
                }}
              >
                <Tooltip title={t("boton>general>editar", "Editar")}>
                  <IconButton>
                    <RiPencilFill style={{ fontSize: 25 }} />
                  </IconButton>
                </Tooltip>
              </button>
              {fullRow.estadoP === 'Activo'
                ? (
                  <button
                    className='btn-void'
                    onClick={() => {
                      swal({
                        title:
                        t('configuracion>mallas_curriculares>mallas_curriculares>deshabilitar>mensaje', '¿Seguro de que quiere deshabilitar este registro?'),
                        text: t('configuracion>mallas_curriculares>mallas_curriculares>deshabilitar>mensaje2', 'Este cambio no puede ser revertido'),
                        icon: 'warning',
                        className: 'text-alert-modal',
                        buttons: {
                          cancel: t('boton>general>cancelar', 'Cancelar'),
                          ok: {
                            text: t('configuracion>mallas_curriculares>mallas_curriculares>boton>general>entendido', '¡Entendido!'),
                            value: true,
                            className: 'btn-alert-color'
                          }
                        }
                      }).then((result) => {
                        if (result) {
                          updateData({ ...fullRow, activo: 0 }, true)
                        }
                      })
                    }}
                  >
                    <Tooltip title={t("boton>general>deshabilitar", "Deshabilitar")}>
                      <IconButton>
                        <BookDisabled />
                      </IconButton>
                    </Tooltip>
                  </button>
                  )
                : (
                  <button
                    className='btn-void'
                    onClick={() => {
                      swal({
                        title: t('configuracion>mallas_curriculares>mallas_curriculares>habilitar>mensaje', '¿Seguro de que quiere habilitar este registro?'),
                        text: t('configuracion>mallas_curriculares>mallas_curriculares>habilitar>mensaje2', 'Este cambio no puede ser revertido'),
                        icon: 'warning',
                        className: 'text-alert-modal',
                        buttons: {
                          cancel: t('configuracion>mallas_curriculares>mallas_curriculares>boton>general>cancelar', 'Cancelar'),
                          ok: {
                            text: t('configuracion>mallas_curriculares>mallas_curriculares>boton>general>entendido', '¡Entendido!'),
                            value: true,
                            className: 'btn-alert-color'
                          }
                        }
                      }).then((result) => {
                        if (result) {
                          updateData({ ...fullRow, activo: 1 }, true)
                        }
                      })
                    }}
                  >
                    <Tooltip title={t("general>habilitar", "Habilitar")}>
                      <IconButton>
                        <BookAvailable />
                      </IconButton>
                    </Tooltip>
                  </button>
                  )}
              <button
                className='btn-void'
                onClick={() => {
                  setDataToDelete(fullRow)
                  setShowDeleteModal(true)
                }}
              >
                <Tooltip title={t("boton>general>eliminar", "Eliminar")}>
                  <IconButton>
                    <IoMdTrash style={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </button>
            </div>
          )
        }
      }
    ]
  }, [listData, t])

  /*
    toggleEditModal={toggleEditData}
   */
  function syncMallaConfirm () {
    
    if(!syncMallaModal.selectedYear) return
    setLoading(true)
    actions.syncMalla(
      data.id,
      syncMallaModal.selectedYear.id
    ).then(r=>{
      if(r.errorCode)
        throw r.errorMessage

      handleSnackbar('Sincronizacion realizada exitosamente!','info')
      setLoading(false)
      setSyncMallaModal({selectedYear: null, show:false})
    }).catch(e=>{
      handleSnackbar('Ha ocurrido un error al sincronizar','error')
      console.error(e)
      setLoading(false)
    })
  }
  return (
    <div>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      <ConfirmModal
        openDialog={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteSingleData()}
        colorBtn='primary'
        txtBtn={t('configuracion>mallas_curriculares>mallas_curriculares>boton>eliminar', 'Eliminar')}
        msg={t('configuracion>mallas_curriculares>mallas_curriculares>eliminar>mensaje', '¿Está seguro que quiere eliminar la malla curricular seleccionada?')}
        title={t('configuracion>mallas_curriculares>mallas_curriculares>eliminar>mallas_curriculares', 'Mallas curriculares')}
      />
      <ConfirmModal
        openDialog={showMultipleDeleteModal}
        onClose={() => setShowMultipleDeleteModal(false)}
        onConfirm={() => deleteMultipleData()}
        colorBtn='primary'
        txtBtn={t('configuracion>mallas_curriculares>mallas_curriculares>boton>eliminar', 'Eliminar')}
        msg={t('configuracion>mallas_curriculares>mallas_curriculares>eliminar>mensajeRegistro','¿Está seguro de querer eliminar el registro seleccionado?')}
        title={t('configuracion>mallas_curriculares>mallas_curriculares>eliminar>mallas_curriculares', 'Mallas curriculares')}
      />
      <ConfirmModal
        openDialog={syncMallaModal.show}
        onClose={() => setSyncMallaModal({show:false, selectedYear:null})}
        onConfirm={syncMallaConfirm}
        colorBtn='primary'
        txtBtn={"Sincronizar"}
        title={"Sincronizar Malla Curricular"}
      >
        <div style={{minHeight: '200px'}}>
          <p>{t('configuracion>mallas_curriculares>ver>sincronizar_malla>titulo', 'Esta accion afectara a todo centro educativo con la malla asignada')}</p>
          <p>{t('configuracion>mallas_curriculares>ver>sincronizar_malla>texto', '¿ Seguro que quiere sincronizar la malla de manera masiva?')}</p>
          <p><Select onChange={obj=>setSyncMallaModal(e=>({...e,selectedYear:obj}))} value={syncMallaModal.selectedYear} placeholder="Seleccione el año educativo" options={state.anioEducativoCatalog}/></p>
        </div>
      </ConfirmModal>
      <h1>{t('configuracion>mallas_curriculares>mallas_curriculares', 'Mallas curriculares')}</h1>
      {!edit && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'right',
              alignContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button color='primary' onClick={toggle}>
              {' '}
              {t('boton>general>agregrar', 'Agregar')}{' '}
            </Button>
          </div>
          <TableReactImplementation
            data={listData}
            handleGetData={(searchValue, _, pageSize, page) => {
              handlePagination(page, pageSize, searchValue)
            }}
            columns={columns}
            orderOptions={[]}
            /* onSubmitAddButton={toggle} 
            showAddButton
            msjButton */
            backendPaginated
            pageSize={10}
            paginationObject={{
              totalCount: state.mallas.totalPages,
              page: state.mallas.pageNumber
            }}
          />
        </div>
      )}
      {edit && (
        <div>
          <div style={{ display: 'flex' }}>
            <ArrowBackIosIcon onClick={toggleEdit} />
            <h3 onClick={toggleEdit} style={{ cursor: 'pointer' }}>
              {t('edit_button>regresar', 'REGRESAR')}
            </h3>
          </div>
          <Card>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>{t('configuracion>mallas_curriculares>ver>editar_malla', 'Editar malla curricular')}</h4>
                <div style={{ display: 'flex' }}>
                  {state.currentOfferSpecialties.length > 0 && (
                    <Input
                      type='select'
                      className='radius50'
                      value={
                        currentSpeciality
                          ? currentSpeciality.id
                          : { nombre: 'SIN ESPECIALIDAD', id: 0 }
                      }
                      style={{ marginRight: '1rem', width: '12rem' }}
                      onChange={(e) => {
                        setCurrentSpeciality(
                          state.currentOfferSpecialties.find(
                            (el) => el.id === parseInt(e.target.value)
                          )
                        )
                      }}
                    >
                      {[
                        { nombre: 'SIN ESPECIALIDAD', id: 0 },
                        ...state.currentOfferSpecialties
                      ].map((item) => {
                        return <option value={item.id}>{item.nombre}</option>
                      })}
                    </Input>
                  )}
                    <Button
                      color='primary'
                      style={{ width: '12rem', margin: '1rem' }}
                      onClick={() => {
                        setSyncMallaModal({selectedYear: null, show:true})
                        /* swal({
                          title:
                            t('configuracion>mallas_curriculares>ver>sincronizar_malla>titulo', 'Esta accion afectara a todo centro educativo con la malla asignada'),
                          text: t('configuracion>mallas_curriculares>ver>sincronizar_malla>texto', '¿ Seguro que quiere sincronizar la malla de manera masiva?'),
                          icon: 'warning',
                          className: 'text-alert-modal',
                          buttons: {
                            ok: {
                              text: t('configuracion>mallas_curriculares>mallas_curriculares>boton>general>entendido', '¡Entendido!'),
                              value: true,
                              className: 'btn-alert-color'
                            }
                          }
                        }).then(async (result) => {
                          if (result) {
                            debugger
                            await actions.syncMalla(
                              data.id,
                              data.sb_modeloOfertaId,
                              state.selectedActiveYear.id || null
                            )
                            toggleEdit()
                          }
                        }) */
                      }}
                    >
                      {t('configuracion>mallas_curriculares>ver>sincronizar_malla', 'Sincronizar malla')}
                    </Button>
                </div>
              </div>
              <Container>
                <Row>
                  <Col sm='6'>
                    <div
                      style={{
                        color: 'white',
                        backgroundColor: colors.primary,
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '15px'
                      }}
                    >
                      <p>{t('configuracion>mallas_curriculares>ver>detalle_malla_curricular', 'Detalle malla curricular')}</p>
                      <p>{t('configuracion>mallas_curriculares>ver>nombre', 'Nombre:')} {data.nombre}</p>
                      <p>
                        {t('configuracion>mallas_curriculares>ver>modelo_de_oferta', ' Modelo de oferta')}:{' '}
                        {
                          state.modelOffers.find(
                            (el) =>
                              el.id == data.ofertaId ||
                              el.id == data.sb_modeloOfertaId
                          )?.nombre
                        }
                      </p>
                    </div>
                  </Col>
                  <Col sm='12'>
                    <table className='mallasTable'>
                      <thead>
                        <tr>
                          <td scope='col'>
                            {t('configuracion>mallas_curriculares>ver>nombre_asignatura_figura_afin', 'Nombre de la asignatura/figura afín')}
                          </td>
                          {sortedLevels.map((el) => {
                            return <td scope='col'>{el.nombre}</td>
                          })}
                          <td scope='col' />
                        </tr>
                      </thead>
                      <tbody>
                        {asignaturasParsed.map((_asignatura) => {
                          return (
                            <tr>
                              <td scope='row'>
                                {_asignatura?.nombre?.toUpperCase()}
                              </td>
                              {sortedLevels.map((level) => {
                                let levelAsignatura = null
                                let currentNivelOferta = null
                                if (currentSpeciality) {
                                  const levels =
                                    state.currenNivelesOferta.filter(
                                      (lvlOffer) => {
                                        return (
                                          lvlOffer.nivelId === level.id &&
                                          (lvlOffer.especialidadId ===
                                            currentSpeciality.id ||
                                            (currentSpeciality.id === 0 &&
                                              !lvlOffer.especialidadId))
                                        )
                                      }
                                    )
                                  currentNivelOferta =
                                    levels.length > 1
                                      ? levels.find((el) => el.calendarioId)
                                      : levels[0]
                                }
                                levelAsignatura = stagedAsignaturas[
                                  _asignatura.asignaturasAgrupadas
                                ]?.find((j) => {
                                  if (currentNivelOferta) {
                                    return (
                                      j.sb_nivelOfertaId ===
                                      currentNivelOferta.id
                                    )
                                  }
                                  return j.sb_NivelesId === level.id
                                })

                                return (
                                  <td>
                                    {levelAsignatura
                                      ? (
                                        <span className='hoverController'>
                                          {levelAsignatura.cantidadLecciones}{' '}
                                          <LaunchIcon
                                            className='hoverItem'
                                            onClick={() => {
                                              toggleCreateMallaAsignatura(
                                                _asignatura,
                                                level,
                                                levelAsignatura
                                              )
                                            }}
                                          />
                                        </span>
                                        )
                                      : (
                                        <span className='hoverController'>
                                          {' '}
                                          -{' '}
                                          <LaunchIcon
                                            className='hoverItem'
                                            onClick={() => {
                                              toggleCreateMallaAsignatura(
                                                _asignatura,
                                                level
                                              )
                                            }}
                                          />
                                        </span>
                                        )}
                                  </td>
                                )
                              })}
                              <td>
                                <DeleteIcon
                                  className='cursor-pointer'
                                  color='primary'
                                  onClick={() => {
                                    setMultipleDataToDelete({
                                      elementsIds: state.currentOfferLevels
                                        .filter(
                                          (item) =>
                                            item.modeloOfertaId ==
                                              data.ofertaId ||
                                            item.modeloOfertaId ==
                                              data.sb_modeloOfertaId
                                        )
                                        .map((level) => {
                                          let levelAsignatura = null
                                          let currentNivelOferta = null
                                          if (currentSpeciality) {
                                            currentNivelOferta =
                                              state.currenNivelesOferta.find(
                                                (lvlOffer) => {
                                                  return (
                                                    lvlOffer.nivelId ===
                                                      level.id &&
                                                    lvlOffer.especialidadId ===
                                                      currentSpeciality.id
                                                  )
                                                }
                                              )
                                          }
                                          levelAsignatura = stagedAsignaturas[
                                            _asignatura.asignaturasAgrupadas
                                          ].find((j) => {
                                            if (currentNivelOferta) {
                                              return (
                                                j.sb_nivelOfertaId ===
                                                currentNivelOferta.id
                                              )
                                            }
                                            return j.sb_NivelesId === level.id
                                          })
                                          if (levelAsignatura) {
                                            return levelAsignatura.id
                                          }
                                          return null
                                        }),
                                      asignaturaId: _asignatura.id
                                    })
                                    setShowMultipleDeleteModal(true)
                                  }}
                                />
                              </td>
                            </tr>
                          )
                        })}
                        <tr>
                          <td scope='row' className='lastItem'>
                            {t("configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>total", "Total")}
                          </td>
                          {sortedLevels.map((level) => {
                            return (
                              <td className='lastItem'>
                                {state.currentMalla.mallaCurricularAsignatura?.reduce(
                                  (prevValue, currentValue) => {
                                    let currentNivelOferta = null
                                    if (currentSpeciality) {
                                      const levels =
                                        state.currenNivelesOferta.filter(
                                          (lvlOffer) => {
                                            return (
                                              lvlOffer.nivelId === level.id &&
                                              lvlOffer.especialidadId ===
                                                currentSpeciality.id
                                            )
                                          }
                                        )
                                      currentNivelOferta =
                                        levels.length > 1
                                          ? levels.find((el) => el.calendarioId)
                                          : levels[0]
                                    }
                                    if (
                                      currentNivelOferta &&
                                      currentValue.sb_nivelOfertaId ===
                                        currentNivelOferta.id &&
                                      currentValue.cantidadLecciones
                                    ) {
                                      return (
                                        prevValue +
                                        currentValue.cantidadLecciones
                                      )
                                    }
                                    if (
                                      !currentNivelOferta &&
                                      currentValue.sb_NivelesId === level.id &&
                                      currentValue.cantidadLecciones
                                    ) {
                                      return (
                                        prevValue +
                                        currentValue.cantidadLecciones
                                      )
                                    }
                                    return prevValue
                                  },
                                  0
                                )}
                              </td>
                            )
                          })}
                          <td scope='row' className='lastItem' />
                        </tr>
                      </tbody>
                    </table>
                    <br />
                  </Col>
                  <Col sm='12'>
                    <Button color='primary' onClick={toggleCreateAsignatura}>
                      {t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>agregar_asignatura', 'Agregar asignatura/figura afín')}
                    </Button>
                  </Col>
                </Row>
              </Container>
            </CardBody>
          </Card>
          {/* <div style={{margin: "0 auto", width: "10rem", paddingTop:"10px"}}>
                        <Button color="primary" onClick={() => {
                            updateData()
                        }}>
                            Guardar
                        </Button>
                    </div> */}
        </div>
      )}
      <Modal isOpen={modalOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{t('configuracion>mallas_curriculares>agregar>agregar_malla_curricular', 'Agregar malla curricular')}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>{t('configuracion>mallas_curriculares>agregar>nombre_malla', 'Nombre de la malla')} </Label>
              <Input
                value={data.nombre}
                name='nombre'
                onChange={handleChange}
              />
            </FormGroup>
            {!data.id && (
              <FormGroup>
                <Label>{t('configuracion>mallas_curriculares>agregar>modelo_de_ofertas', 'Modelo de ofertas')}</Label>
                <Select
                  className='select-rounded react-select'
                  classNamePrefix='select-rounded react-select'
                  placeholder=''
                  value={{
                    id: data.ofertaId,
                    nombre: data?.ofertaId
                      ? state.modelOffers.find(
                        (item) => item.id == data.ofertaId
                      )?.nombre
                      : null
                  }}
                  options={state.modelOffers.map((level) => ({
                    ...level,
                    label: level.nombre,
                    value: level.id
                  }))}
                  noOptionsMessage={() => t("general>no_opt", "Sin opciones")}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                  components={{ Input: CustomSelectInput }}
                  onChange={(e) => setData({ ...data, ofertaId: e.id })}
                />
                <div className='listItemsDecoration'>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {state.currentOfferLevels
                      .filter(
                        (el) =>
                          el.modeloOfertaId == data.ofertaId ||
                          el.modeloOfertaId == data.sb_modeloOfertaId
                      )
                      .map((el) => {
                        return <p>{el.nombre}</p>
                      })}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {state.currentOfferSpecialties.map((el) => {
                      return <p>{el.nombre}</p>
                    })}
                  </div>
                </div>
              </FormGroup>
            )}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                color='primary'
                outline
                style={{ marginRight: '20px' }}
                onClick={() => {
                  toggle()
                  actions.cleanLvlsState()
                }}
              >
                {t('boton>general>cancelar', 'Cancelar')}
              </Button>

              <Button
                color='primary'
                onClick={() => {
                  sendData(data)
                }}
              >
                {t('boton>general>guardar', 'Guardar')}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={createAsignaturaOpen} toggle={toggleCreateAsignatura}>
        <ModalHeader toggle={toggleCreateAsignatura}>
          {t('configuracion>mallas_curriculares>ver>agregar_asignatura_figura_afin>agregar_asignatura_figura_afin', 'Agregar asignatura/figura afín')}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>{t('configuracion>mallas_curriculares>ver>agregar_asignatura_figura_afin>escoger_asignatura_afin', 'Escoger la asignatura/figura afín')}</Label>
              <Select
                className='react-select'
                classNamePrefix='react-select'
                placeholder=''
                value={newAsignatura}
                options={state.asignaturas
                  .filter(
                    (item) =>
                      !Object.keys(stagedAsignaturas)
                        .map((el) => parseInt(el))
                        .includes(item.id)
                  )
                  .map((x) => {
                    x.nombre = x.nombre.toUpperCase()
                    return x
                  })
                  .sort((a, b) => {
                    return a.nombre.localeCompare(b.nombre)
                  })}
                noOptionsMessage={() => t('configuracion>mallas>sin_asignaturas','Sin asignaturas/figuras ')}
                getOptionLabel={(option: any) => option.nombre}
                getOptionValue={(option: any) => option.id}
                components={{ Input: CustomSelectInput }}
                onChange={(e) => setNewAsignatura(e)}
              />
            </FormGroup>

            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                color='primary'
                outline
                style={{ marginRight: '20px' }}
                onClick={() => {
                  toggleCreateAsignatura()
                }}
              >
                {t('boton>general>cancelar', 'Cancelar')}
              </Button>

              <Button
                color='primary'
                onClick={() => {
                  if (newAsignatura) {
                    handleCreateAsignatura()
                    toggleCreateAsignatura()
                  }
                }}
              >
                {t('boton>general>guardar', 'Guardar')}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={createMallaAsignaturaOpen}
        toggle={toggleCreateMallaAsignatura}
        size='lg'
      >
        <ModalHeader toggle={toggleCreateMallaAsignatura}>
          {createMallaAsignaturaData.currentAsignatura.nombre} -{' '}
          {createMallaAsignaturaData.currentLevel.nombre}
        </ModalHeader>
        <ModalBody>
          <div style={{ display: 'flex' }}>
            <span
              className='cursor-pointer'
              style={{
                color: createMallaAsignaturaOpenTab === 0 ? colors.primary : '',
                marginRight: '1rem'
              }}
              onClick={() => setCreateMallaAsignaturaOpenTab(0)}
            >
              {t('configuracion>mallas>configuracion_asignatura','Configuración de la asignatura/figura afín')}
            </span>
            {createMallaAsignaturaData.sendData.id &&
              (createMallaAsignaturaData.sendData.sb_tipoEvaluacionId == 2 ||
                createMallaAsignaturaData.sendData.sb_tipoEvaluacionId ==
                  4) && (
                    <span
                      className='cursor-pointer'
                      style={{
                        color:
                      createMallaAsignaturaOpenTab === 1 ? colors.primary : ''
                      }}
                      onClick={() => setCreateMallaAsignaturaOpenTab(1)}
                    >
                      {t("menu>configuracion>camponente_calificacion", "Componentes de la calificación")}
                    </span>
            )}
          </div>
          <hr />
          <Form>
            {createMallaAsignaturaOpenTab === 0 ? (
              <div>
                <FormGroup>
                  <Label>{t("expediente_ce>recurso_humano>fun_ce>lecciones>cantidad_lecciones_semanales", "Cantidad de lecciones semanales")}</Label>
                  <Input
                    name='cantidadLecciones'
                    type='number'
                    onChange={handleCreateMallaDataChange}
                    value={createMallaAsignaturaData.sendData.cantidadLecciones}
                    style={{ width: '4rem' }}
                  />
                  {errors.cantidadLecciones && <Feedback />}
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>mallas>tipo_evaluacion','Tipo de evaluación de la asignatura/figura afín')}</Label>
                  <Input
                    name='sb_tipoEvaluacionId'
                    type='select'
                    onChange={handleCreateMallaDataChange}
                    value={
                      createMallaAsignaturaData.sendData.sb_tipoEvaluacionId
                    }
                  >
                    <option style={{ display: 'none', opacity: 0 }} />
                    {state.tiposEvaluacion.map((el) => {
                      return <option value={el.id}>{el.nombre}</option>
                    })}
                  </Input>
                </FormGroup>
                {createMallaAsignaturaData.sendData.sb_tipoEvaluacionId ==
                  1 && (
                    <FormGroup>
                      <Label>{t('configuracion>mallas>rubrica','Rúbrica del aprendizaje')}</Label>
                      <Input
                        name='sb_rubricaAprendizajeId'
                        type='select'
                        onChange={handleCreateMallaDataChange}
                        value={
                        createMallaAsignaturaData.sendData
                          .sb_rubricaAprendizajeId
                      }
                      >
                        <option style={{ display: 'none', opacity: 0 }} />
                        {state.indicadoresAprendizaje.map((el) => {
                          return <option value={el.id}>{el.nombre}</option>
                        })}
                      </Input>
                    </FormGroup>
                )}
                <FormGroup>
                  <Label>{t('configuracion>mallas>periodos','Períodos de la asignatura')}</Label>
                  <Input
                    name='sb_periodoId'
                    type='select'
                    onChange={handleCreateMallaDataChange}
                    value={createMallaAsignaturaData.sendData.sb_periodoId}
                  >
                    <option style={{ display: 'none', opacity: 0 }} />
                    {state.periodosAll.map((el) => {
                      return <option value={el.id}>{el.nombre}</option>
                    })}
                  </Input>
                </FormGroup>
                {createMallaAsignaturaData.sendData.sb_tipoEvaluacionId ==
                  4 && (
                    <FormGroup>
                      <GridEscalaCalificacion
                        data={
                        createMallaAsignaturaData?.sendData?.escalaCalificacion
                      }
                        setData={setEscalaCalificacion}
                      />
                    </FormGroup>
                )}
                {createMallaAsignaturaData.sendData.sb_periodoId && (
                  <table className='mallasTable-2'>
                    <thead>
                      <tr>
                        <td scope='col'>{t("configuracion>ofertas_educativas>modalidades>agregar>orden", "Orden")}</td>
                        <td scope='col'>{t(" dir_regionales>col_nombre", "Nombre")}</td>
                        {/* <td scope="col">Fecha inicio</td>
                        <td scope="col">Fecha de finalización</td>
                        <td scope="col">Fecha de cierre</td> */}
                        <td scope='col'>{t("configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>porcentaje", "Porcentaje")}</td>
                      </tr>
                    </thead>
                    <tbody>
                      {state.periodosAll.filter((el) => el.id === Number(createMallaAsignaturaData.sendData.sb_periodoId))[0].bloques.map((el) => {
                        return (
                          <tr>
                            <td scope='col'>{el.ordenBloque}</td>
                            <td scope='col'>{el.nombre}</td>
                            {/* <td scope="col">
                              {moment(el.fechaInicio).format('DD/MM/YYYY')}
                            </td>
                            <td scope='col'>
                              {moment(el.fechaFin).format('DD/MM/YYYY')}
                            </td>
                            <td scope='col'>
                              {moment(el.fechaCierre).format('DD/MM/YYYY')}
                            </td> */}
                            <td scope='col'>{`${el.porcentaje}%`}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
                {createMallaAsignaturaData.sendData.sb_tipoEvaluacionId == 2
                  ? (
                    <>
                      <div style={{ display: 'flex' }}>
                        <FormGroup style={{ marginRight: '3rem', width: '45%' }}>
                          <Label>{t('configuracion>mallas>redondeo','Redondeo')}</Label>
                          <Input
                            name='redondeo'
                            type='select'
                            onChange={handleCreateMallaDataChange}
                            value={createMallaAsignaturaData.sendData.redondeo}
                          >
                            <option
                              style={{ display: 'none', opacity: 0 }}
                            />
                            <option value={50}>{t('configuracion>mallas>igual_o_mayor','Igual o mayor a 0.5')}</option>
                            <option value={51}>{t('configuracion>mallas>igual_o_mayor','Igual o mayor a 0.5')}1</option>
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label>{t('configuracion>mallas>actividad_evaluacion','Actividad de evaluación adicional')}</Label>
                          <Input
                            name='sb_elementosCatalogoId'
                            type='select'
                            onChange={handleCreateMallaDataChange}
                            value={
                            createMallaAsignaturaData.sendData
                              .sb_elementosCatalogoId
                          }
                          >
                            <option
                              style={{ display: 'none', opacity: 0 }}
                            />
                            {state.tipoEvaluacion.map((el) => {
                              return <option value={el.id}>{el.nombre}</option>
                            })}
                          </Input>
                        </FormGroup>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <FormGroup style={{ marginRight: '3rem', width: '45%' }}>
                          <Label>{t("gestion_grupo>asistencia>nota_promocion", "Nota de promoción")}</Label>
                          <Input
                            name='notadepromocion'
                            type='number'
                            onChange={handleCreateMallaDataChange}
                            value={
                            createMallaAsignaturaData.sendData.notadepromocion
                          }
                            style={{ width: '4rem' }}
                          />
                          {errors.notadepromocion && <Feedback />}
                        </FormGroup>
                        <FormGroup>
                          <CustomInput
                            label={t('configuracion>mallas>habilitar_creditos','Habilitar créditos')}
                            name='creditosOn'
                            type='checkbox'
                            onClick={() =>
                              handleCreateMallaDataChange({
                                target: {
                                  name: 'creditosOn',
                                  value: !createMallaAsignaturaData.sendData
                                    .creditosOn
                                }
                              })}
                            checked={
                            !!createMallaAsignaturaData.sendData.creditosOn
                          }
                          />
                          {createMallaAsignaturaData.sendData.creditosOn && (
                            <Input
                              name='creditos'
                              type='number'
                              onChange={handleCreateMallaDataChange}
                              value={createMallaAsignaturaData.sendData.creditos}
                            />
                          )}
                        </FormGroup>
                      </div>
                    </>
                    )
                  : (
                    <div style={{ display: 'flex' }}>
                      <FormGroup>
                        <CustomInput
                          label={t('configuracion>mallas>habilitar_creditos','Habilitar créditos')}
                          name='creditosOn'
                          type='checkbox'
                          onClick={() =>
                            handleCreateMallaDataChange({
                              target: {
                                name: 'creditosOn',
                                value: !createMallaAsignaturaData.sendData
                                  .creditosOn
                              }
                            })}
                          checked={
                          !!createMallaAsignaturaData.sendData.creditosOn
                        }
                        />
                        {createMallaAsignaturaData.sendData.creditosOn && (
                          <Input
                            name='creditos'
                            type='number'
                            onChange={handleCreateMallaDataChange}
                            value={createMallaAsignaturaData.sendData.creditos}
                          />
                        )}
                      </FormGroup>
                    </div>
                    )}
              </div>
            ) : (
              <div>
                {stagedComponentes.map((el, idx) => {
                  return (
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '2rem',
                        alignItems: 'center'
                      }}
                    >
                      <div className=''>
                        <h6>{t('configuracion>mallas>componente_de_evaluacion','Componente de evaluación')}</h6>
                        <Select
                          placeholder=''
                          value={{
                            id: el.sb_componenteCalificacionId,
                            nombre: el.sb_componenteCalificacionId
                              ? state.componenteCalificacionAll.find(
                                (item) =>
                                  item.id == el.sb_componenteCalificacionId
                              )?.nombre
                              : null
                          }}
                          options={state.componenteCalificacionAll.map(
                            (item) => ({
                              ...item,
                              label: item.nombre,
                              value: item.id
                            })
                          )}
                          components={{ Input: CustomSelectInput }}
                          noOptionsMessage={() => t("general>no_opt", "Sin opciones")}
                          getOptionLabel={(option: any) => option.nombre}
                          getOptionValue={(option: any) => option.id}
                          onChange={(e) => {
                            handleComponenteChangeSelect(e, idx)
                          }}
                          styles={{
                            control: (styles) => ({
                              ...styles,
                              width: '15rem'
                            }),
                            indicatorSeparator: (styles) => ({
                              ...styles,
                              display: 'none'
                            })
                          }}
                        />
                      </div>
                      <div style={{ width: '20%' }}>
                        <h6 style={{ padding: '0 1rem' }}>{t("configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>porcentaje", "Porcentaje")}</h6>
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Input
                            type='number'
                            name='valor'
                            value={el.valor}
                            onChange={(e) => handleComponenteChange(e, idx)}
                            style={{ width: '100%', marginLeft: '1rem' }}
                          />
                          <span style={{ fontSize: '21', marginLeft: '10px' }}>
                            %
                          </span>
                          {!stagedComponentes[idx]?.noRequiereInstrumentos && (
                            <DeleteIcon
                              color='primary'
                              onClick={() => {
                                setStagedComponentes(
                                  stagedComponentes.filter(
                                    (_, _idx) => idx !== _idx
                                  )
                                )
                              }}
                            />
                          )}
                        </div>
                      </div>
                      {stagedComponentes[idx]?.noRequiereInstrumentos && (
                        <div className='ml-3'>
                          <h6>{t('configuracion>mallas>indicador_aprendizaje','Indicador de aprendizaje')}</h6>
                          <div className='d-flex align-items-center'>
                            <Select
                              placeholder=''
                              options={state.indicadoresAprendizaje.map(
                                (el) => {
                                  return {
                                    label: el?.nombre,
                                    value: el
                                  }
                                }
                              )}
                              value={
                                state.indicadoresAprendizaje.findIndex(
                                  (el) =>
                                    el?.id ===
                                    stagedComponentes[idx]
                                      ?.sb_rubricaaprendizajeId
                                ) === -1
                                  ? null
                                  : {
                                      label:
                                        state.indicadoresAprendizaje[
                                          state.indicadoresAprendizaje.findIndex(
                                            (el) =>
                                              el?.id ===
                                              stagedComponentes[idx]
                                                ?.sb_rubricaaprendizajeId
                                          )
                                        ]?.nombre,
                                      value:
                                        state.indicadoresAprendizaje[
                                          state.indicadoresAprendizaje.findIndex(
                                            (el) =>
                                              el?.id ===
                                              stagedComponentes[idx]
                                                ?.sb_rubricaaprendizajeId
                                          )
                                        ]
                                    }
                              }
                              components={{ Input: CustomSelectInput }}
                              onChange={({ value }) => {
                                const copiedComponents = [...stagedComponentes]
                                copiedComponents[idx] = {
                                  ...copiedComponents[idx],
                                  sb_rubricaaprendizajeId: value?.id
                                }
                                // handleComponenteChangeSelect()
                                setStagedComponentes(copiedComponents)
                              }}
                              noOptionsMessage={() => t("general>no_opt","Sin opciones")}
                              // getOptionLabel={(option: any) => option.nombre}
                              // getOptionValue={(option: any) => option.id}
                              styles={{
                                control: (styles) => ({
                                  ...styles,
                                  width: '15rem'
                                }),
                                indicatorSeparator: (styles) => ({
                                  ...styles,
                                  display: 'none'
                                })
                              }}
                            />
                            <DeleteIcon
                              color='primary'
                              onClick={() => {
                                setStagedComponentes(
                                  stagedComponentes.filter(
                                    (_, _idx) => idx !== _idx
                                  )
                                )
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                <div
                  style={{
                    marginBottom: '2rem',
                    display: 'flex'
                  }}
                >
                  <div className='' style={{ width: '15rem' }} />
                  <div className='' style={{ width: '20%' }}>
                    <h6 style={{ marginLeft: '1rem' }}>{t("configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>total", "Total")}</h6>
                    <Input
                      type='number'
                      value={stagedComponentes.reduce(
                        (prevValue, currentValue) => {
                          return (
                            parseInt(prevValue) + parseInt(currentValue.valor)
                          )
                        },
                        0
                      )}
                      disabled
                      style={{ width: '90%', marginLeft: '1rem' }}
                    />
                  </div>
                </div>
                <Button
                  color='primary'
                  onClick={() => {
                    addDataComponenteCalificacion()
                  }}
                  style={{ marginBottom: '2rem' }}
                >
                  {t("gestion_grupo>calificaciones>agregar_componente", "Agregar componente")}
                </Button>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                color='primary'
                outline
                style={{ marginRight: '20px' }}
                onClick={() => {
                  toggleCreateMallaAsignatura()
                }}
              >
                {t('boton>general>cancelar', 'Cancelar')}
              </Button>

              <Button
                color='primary'
                style={{ marginRight: '20px' }}
                onClick={() => {
                  createMallaAsignatura()
                }}
              >
                {t('boton>general>guardar', 'Guardar')}
              </Button>

              {createMallaAsignaturaData.sendData.id && (
                <Button
                  color='danger'
                  onClick={() => {
                    setMultipleDataToDelete({
                      elementsIds: [createMallaAsignaturaData.sendData.id],
                      asignaturaId: null
                    })
                    setShowMultipleDeleteModal(true)
                    // deleteMultiple([createMallaAsignaturaData.sendData.id])
                    // toggleCreateMallaAsignatura()
                  }}
                >
                  {t('boton>general>eliminar', 'Eliminar')}
                </Button>
              )}
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default MallasCurriculares
