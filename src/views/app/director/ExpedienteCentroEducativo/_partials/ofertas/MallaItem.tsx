import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Label,
  FormGroup,
  CustomInput,
  Form,
  Input
} from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import withRouter from 'react-router-dom/withRouter'
import { SendMallaCurricularData } from './interfaces'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import colors from 'Assets/js/colors'
import GetAppIcon from '@material-ui/icons/GetApp'
import ItemsToShow from './ItemsToShow'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment'
import {
  createAsignaturasMallaInstitucionByMallaInstitucion,
  getAsignaturasMallaInstitucionByMallaInstitucionId,
  editAsignaturasMallaInstitucionByMallaInstitucion,
  getPeriodoBloques,
  deleteMallasAsignaturasInstitucionMultiples
} from '../../../../../../redux/mallasCurriculares/actions'
import useNotification from '../../../../../../hooks/useNotification'
import swal from 'sweetalert'
import GridEscalaCalificacion from 'views/app/director/Configuracion/_partials/Mallas/GridEscalaCalificacion'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import * as XLSX from 'xlsx'
import { sortBy } from 'lodash'
import { getElementFromObject } from 'views/app/director/Configuracion/_partials/Mallas/utils'
import { useTranslation } from 'react-i18next'
import { getAllPeriodos } from 'Redux/periodos/actions'
const fileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

const MallaItem = (props) => {
  const { t } = useTranslation()

  const { state, data, setStagedAsignaturas, stagedAsignaturas, disableButton = false, hasEditAccess = true, hasDeleteAccess = true } = props
  const [printRef, setPrintRef] = React.useState(null)
  const [disabledPeriod, setDisabledPeriod] = useState(false)
  const [createMallaAsignaturaOpen, setCreateMallaAsignaturaOpen] =
    useState<boolean>(false)
  const [currentSpeciality, setCurrentSpeciality] = useState<object>({})
  const [createMallaAsignaturaOpenTab, setCreateMallaAsignaturaOpenTab] =
    useState<1 | 0>(0)
  const [stagedRubrica, setStagedRubrica] = useState<object>({})
  const [snackbarContent, setSnackbarContent] = useState<object>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [createAsignaturaOpen, setCreateAsignaturaOpen] = useState(false)
  const [newAsignatura, setNewAsignatura] = useState(null)
  const [sortedLevels, setSortedLevels] = useState<any>([])
  const [asignaturasParsed, setAsignaturasParsed] = useState([])
  const [currenNivelesOferta, setCurrenNivelesOferta] = useState(
    state.currenNivelesOferta
  )

  const [snackbar, handleClick] = useNotification()

  const handleCreateMallaDataChange = (e) => {
    
    if (e.target.name) {
      setStagedRubrica(
        state.indicadoresAprendizaje.find((el) => el.id == e.target.value)
      )
    }
    setCreateMallaAsignaturaData({
      ...createMallaAsignaturaData,
      sendData: {
        ...createMallaAsignaturaData.sendData,
        [e.target.name]: e.target.value
      }
    })
  }
  const [stagedComponentes, setStagedComponentes] = useState([])
  const [errors, setErrors] = useState(null)

  const [createMallaAsignaturaData, setCreateMallaAsignaturaData] =
    useState<SendMallaCurricularData>({
      nivelOferta: {},
      sendData: {},
      currentLevel: {},
      currentAsignatura: {}
    })

  /* const handleCreateMallaDataChange = (e) => {
    setErrors({
      ...errors,
      [e?.target?.name]: false
    })
    if (e.target.name) {
      setStagedRubrica(
        state.indicadoresAprendizaje.find((el) => el.id == e.target.value)
      )
    }
    setCreateMallaAsignaturaData({
      ...createMallaAsignaturaData,
      sendData: {
        ...createMallaAsignaturaData.sendData,
        [e.target.name]: e.target.value
      }
    })
  } */

  const exportToCSV = () => {
    const _data = [
      [
        'Nombre de la asignatura/figura afín',
        ...sortedLevels.map((el, idx) => {
          return el.nombre
        })
      ],
      ...asignaturasParsed.map((_asignatura) => {
        return [
          _asignatura.nombre,
          ...sortedLevels.map((level) => {
            let levelAsignatura = null
            let currentNivelOferta = null
            if (currentSpeciality) {
              const levels = state.currenNivelesOferta.filter((lvlOffer) => {
                return (
                  lvlOffer.nivelId === level.id &&
                  (lvlOffer.especialidadId === currentSpeciality.id ||
                    (currentSpeciality.id === 0 && !lvlOffer.especialidadId))
                )
              })
              currentNivelOferta =
                levels.length > 1
                  ? levels.find((el) => el.calendarioId)
                  : levels[0]
            }
            levelAsignatura = stagedAsignaturas[
              _asignatura.asignaturasAgrupadas
            ]?.find((j) => {
              if (currentNivelOferta) {
                return j.nivelOfertaId === currentNivelOferta.id
              }
              return j.nivelId === level.id
            })
            return levelAsignatura ? levelAsignatura.cantidadLecciones : '-'
          })
        ]
      })
    ]
    const worksheet = XLSX.utils.aoa_to_sheet(_data)
    const new_workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'SheetJS')
    XLSX.writeFile(new_workbook, `${data.nombreModeloOferta.trim()}.xlsx`)
  }

  const actions = useActions({
    getPeriodoBloques,
    createAsignaturasMallaInstitucionByMallaInstitucion,
    editAsignaturasMallaInstitucionByMallaInstitucion,
    getAsignaturasMallaInstitucionByMallaInstitucionId,
    deleteMallasAsignaturasInstitucionMultiples,
    getAllPeriodos
  })

  useEffect(() => {
    setAsignaturasParsed(
      getElementFromObject(stagedAsignaturas, state.asignaturas)
    )
  }, [stagedAsignaturas])

  useEffect(() => {
    setSortedLevels(sortBy(state.currentOfferLevels, 'orden'))
  }, [state.currentOfferLevels])

  useEffect(() => {
    setCurrentSpeciality(props.state.currentOfferSpecialties[0] || {})
  }, [props.state.currentOfferSpecialties])

  useEffect(() => {
    // debugger
    actions.getAllPeriodos()
    // actions.getPeriodoBloques(createMallaAsignaturaData.sendData.periodoId)
  }, [createMallaAsignaturaData.sendData.periodoId])

  useEffect(() => {
    if (currentSpeciality?.id) {
      const _currenNivelesOferta = state.currenNivelesOferta.filter((el) => {
        return el.especialidadId === currentSpeciality.id
      })
      setCurrenNivelesOferta(_currenNivelesOferta)
    } else {
      setCurrenNivelesOferta(state.currenNivelesOferta)
    }
  }, [currentSpeciality, state.currenNivelesOferta])

  const toggleEdit = (element = {}) => {
    props.setEdit(!props.edit)
  }

  const toggleCreateMallaAsignatura = (
    currentAsignatura = {},
    currentLevel = {},
    sendData = null
  ) => {
    const foo = currenNivelesOferta.find((el) => {
      if ((currentSpeciality && !currentSpeciality.id) || !currentSpeciality) {
        return el.nivelId === currentLevel.id
      }
      return currentLevel.nivelId
        ? el.nivelId === currentLevel.nivelId &&
        el.especialidadId === currentSpeciality.id
        : el.nivelId === currentLevel.id &&
        el.especialidadId === currentSpeciality.id
    })
    // debugger
    setDisabledPeriod(sendData?.periodoId)
    setCreateMallaAsignaturaData({
      sendData: sendData
        ? {
            ...sendData,
            rubricaAprendizaje: sendData.rubricaAprendizajeId,
            creditosOn: sendData.cantidadcreditos > 0
          }
        : {},
      currentLevel,
      currentAsignatura,
      nivelOferta: foo
    })
    setStagedComponentes(
      sendData?.componenteclasificacion
        ? JSON.parse(sendData.componenteclasificacion).map((el) => ({
          ...el,
          id: parseInt(el.sb_componenteCalificacionId)
        }))
        : []
    )
    setStagedRubrica(
      sendData?.rubricaAprendizaje
        ? JSON.parse(sendData.rubricaAprendizaje)
        : {}
    )
    setCreateMallaAsignaturaOpenTab(0)
    setCreateMallaAsignaturaOpen(!createMallaAsignaturaOpen)
  }

  const createMallaAsignatura = async () => {
    const data: any = createMallaAsignaturaData.sendData
    const tipoEvaluacion = Number(data.tipoEvaluacionId)
    if (!data.cantidadLecciones ||
      !tipoEvaluacion ||
      !data.periodoId ||
      !data.elementosCatalogoId ||
      !data.redondeo ||
      !data.notadepromocion) {
      console.clear()
      console.log({
        cantidadLecciones: !data.cantidadLecciones,
        tipoEvaluacionId: !data.tipoEvaluacionId,
        periodoId: !data.periodoId
      })
      setErrors({
        cantidadLecciones: !data.cantidadLecciones,
        tipoEvaluacionId: !data.tipoEvaluacionId,
        periodoId: !data.periodoId,
        notadepromocion: !data.notadepromocion && data.tipoEvaluacionId && Number(data.tipoEvaluacionId) !== 1,
        elementosCatalogoId: !data.elementosCatalogoId && data.tipoEvaluacionId && Number(data.tipoEvaluacionId) !== 1,
        redondeo: !data.redondeo && data.tipoEvaluacionId && Number(data.tipoEvaluacionId) !== 1
      })
      if (Number(data.tipoEvaluacionId) !== 1 &&       (!data.cantidadLecciones ||
        !tipoEvaluacion ||
        !data.periodoId ||
        !data.elementosCatalogoId ||
        !data.redondeo ||
        !data.notadepromocio)) {
        return
      }
    }
    // debugger
    const _sendData = {
      mallaCurricularAsignaturaInstitucionId: data.mallaCurricularAsignaturaInstitucionId,
      cantidadLecciones: parseInt(data.cantidadLecciones),
      opcional: true,
      sb_anioEducativoId: state.selectedActiveYear.id,
      sb_nivelOfertaId: data?.nivelOfertaId || createMallaAsignaturaData?.nivelOferta?.id,
      sb_tipoEvaluacionId: data.tipoEvaluacionId,
      sb_elementosCatalogoId: data.elementosCatalogoId,
      SB_NivelesModeloId: createMallaAsignaturaData.currentLevel.nivelModeloId,
      sb_asignaturaId: createMallaAsignaturaData.currentAsignatura.id,
      sb_periodoId: data.periodoId,
      sb_mallaCurricularesInstitucionId: data.mallaCurricularesInstitucionId,
      notapromocion: data.notadepromocion,
      cantidadcreditos: parseInt(data.cantidadcreditos),
      redondeo: parseInt(data.redondeo),
      rubricaAprendizaje: JSON.stringify(stagedRubrica), // TODO: RUBRICA
      sb_rubricaAprendizajeId: parseInt(data.rubricaAprendizaje),
      componenteclasificacion: JSON.stringify(stagedComponentes),
      escalaCalificacion: data?.escalaCalificacion,
      estado: true
    }
    let response = null
    setLoading(true)

    if (
      stagedComponentes.length > 0 &&
      stagedComponentes.reduce((prevValue, nextValue) => {
        return prevValue + parseInt(nextValue.valor)
      }, 0) !== 100
    ) {
      toggleSnackbar(
        'error',
        'El porcentaje de los componentes de calificación debe sumar 100%'
      )
      handleClick()
      return
    }

    if (
      createMallaAsignaturaData.sendData.mallaCurricularAsignaturaInstitucionId
    ) {
      response =
        await actions.editAsignaturasMallaInstitucionByMallaInstitucion(
          _sendData
        )
      if (
        !response.error &&
        createMallaAsignaturaData.sendData.tipoEvaluacionId == 2 &&
        createMallaAsignaturaOpenTab === 0 &&
        stagedComponentes.length === 0
      ) {
        toggleSnackbar(
          'success',
          'Se ha guardado correctamente. Por favor ingrese los componentes de calificación'
        )
        handleClick()
      } else if (!response.error) {
        toggleSnackbar('success', 'Se ha guardado correctamente.')
        actions.getAsignaturasMallaInstitucionByMallaInstitucionId(
          data.mallaCurricularesInstitucionId
        )
        handleClick()
        toggleCreateMallaAsignatura()
      } else if (response.error) {
        toggleSnackbar(
          'error',
          'Ha ocurrido un error'
        )
      }
    } else {
      response =
        await actions.createAsignaturasMallaInstitucionByMallaInstitucion(
          _sendData
        )
        // debugger
      if (!response.error) {
        setCreateMallaAsignaturaData({
          ...createMallaAsignaturaData,
          sendData: {
            ...createMallaAsignaturaData.sendData,
            mallaCurricularAsignaturaInstitucionId: response.newId
          }
        })
      }
      if (
        !response.error &&
        createMallaAsignaturaData.sendData.tipoEvaluacionId == 2 &&
        stagedComponentes.length === 0
      ) {
        setCreateMallaAsignaturaOpenTab(1)
        toggleSnackbar(
          'success',
          'Se ha guardado correctamente. Por favor ingrese los componentes de calificación'
        )
        actions.getAsignaturasMallaInstitucionByMallaInstitucionId(
          data.mallaCurricularInstitucionId
        )
        handleClick()
      } else if (!response.error) {
        toggleSnackbar('success', 'Se ha guardado correctamente.')
        actions.getAsignaturasMallaInstitucionByMallaInstitucionId(
          data.mallaCurricularInstitucionId
        )
        toggleCreateMallaAsignatura()
      }
    }
    setLoading(false)
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
    setStagedComponentes(copiedComponents)
  }

  const toggleSnackbar = (variant, msg) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const deleteMultiple = (elementsIds = [], asignaturaId = null) => {
    const _elementos = elementsIds.filter((item) => item)
    if (_elementos.length < 1) {
      const _stagedAsignatures = { ...stagedAsignaturas }
      delete _stagedAsignatures[asignaturaId]
      setStagedAsignaturas(_stagedAsignatures)
      return
    }
    swal({
      title: t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>eliminar_asignatura>titulo', 'Seguro de que quiere eliminar los registros seleccionados'),
      text: t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>eliminar_asignatura>mensaje', 'Este cambio no puede ser revertido'),
      icon: 'warning',
      className: 'text-alert-modal',
      buttons: {
        ok: {
          text: t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>eliminar_asignatura>btn_aceptar', '¡Entendido!'),
          value: true,
          className: 'btn-alert-color'
        }
      }
    }).then(async (result) => {
      if (result) {
        await actions.deleteMallasAsignaturasInstitucionMultiples(_elementos)
        actions.getAsignaturasMallaInstitucionByMallaInstitucionId(
          data.mallaCurricularInstitucionId
        )
      }
    })
  }

  const toggleCreateAsignatura = () => {
    setCreateAsignaturaOpen(!createAsignaturaOpen)
  }

  return (
    <div>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      <div
        style={{ display: 'flex', justifyContent: 'space-between' }}
        className='mb-5 mt-3'
      >
        <div
          style={{
            display: 'flex',
            cursor: 'pointer',
            flex: 0,
            alignItems: 'center'
          }}
        >
          <ArrowBackIosIcon onClick={toggleEdit} />
          <h3 className='m-0 p-0' onClick={toggleEdit}>
            {t('edit_button>regresar', 'REGRESAR')}
          </h3>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {state.currentOfferSpecialties.length > 0 && (
            <Input
              type='select'
              className='radius50'
              value={
                currentSpeciality
                  ? currentSpeciality.id
                  : { nombre: 'SIN ESPECIALIDAD', id: 0 }
              }
              style={{ marginRight: '1rem', width: 'auto' }}
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
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => {
              exportToCSV()
            }}
          >
            <GetAppIcon /> {t('general>descargar', 'Descargar')}
          </Button>
        </div>
      </div>
      <ItemsToShow
        currenNivelesOferta={currenNivelesOferta}
        currentSpeciality={currentSpeciality}
        sortedLevels={sortedLevels}
        asignaturasParsed={asignaturasParsed}
        {...props}
        deleteMultiple={deleteMultiple}
        toggleCreateMallaAsignatura={toggleCreateMallaAsignatura}
        toggleCreateAsignatura={toggleCreateAsignatura}
        ref={(el) => setPrintRef(el)}
        disableButton={disableButton}
        hasEditAccess={hasEditAccess}
        hasDeleteAccess={hasDeleteAccess}
      />
      <Modal isOpen={createAsignaturaOpen} toggle={toggleCreateAsignatura}>
        <ModalHeader toggle={toggleCreateAsignatura}>
          {t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>agregar_asignatura', 'Agregar asignatura/figura afín')}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>escoger_asignatura', 'Escoger la asignatura/figura afín')}</Label>
              <Input
                type='select'
                value={newAsignatura}
                onChange={(e) => setNewAsignatura(e.target.value)}
              >
                <option style={{ display: 'none', opacity: 0 }} />
                {state.asignaturas
                  .filter(
                    (item) =>
                      !Object.keys(stagedAsignaturas)
                        .map((el) => parseInt(el))
                        .includes(item.id)
                  )
                  .map((el) => {
                    return <option value={el.id}>{el.nombre}</option>
                  })}
              </Input>
            </FormGroup>
            {/* <div style={{display: "flex"}}>
                            <CustomInput label="Código de asignatura" type="checkbox" onClick={() => {
                                setShowCode(!showCode)
                            }}/>
                            {showCode && <Input style={{width: "13rem", marginLeft: "9px"}} type="text"/>}
                        </div> */}
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                color='primary'
                outline
                style={{ marginRight: '20px' }}
                onClick={() => {
                  setNewAsignatura(null)
                  toggleCreateAsignatura()
                }}
              >
                {t('general>cancelar', 'Cancelar')}
              </Button>

              <Button
                color='primary'
                onClick={() => {
                  if (newAsignatura) {
                    setStagedAsignaturas({
                      ...stagedAsignaturas,
                      [newAsignatura]: []
                    })
                    toggleCreateAsignatura()
                  }
                }}
              >
                {t('general>guardar', 'Guardar')}
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
              {t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion', 'Configuración de la asignatura/figura afín')}
            </span>
            {createMallaAsignaturaData.sendData
              .mallaCurricularAsignaturaInstitucionId &&
              (createMallaAsignaturaData.sendData.tipoEvaluacionId == 2 ||
                createMallaAsignaturaData.sendData.tipoEvaluacionId == 4) && (
                  <span
                    className='cursor-pointer'
                    style={{
                      color:
                      createMallaAsignaturaOpenTab === 1 ? colors.primary : ''
                    }}
                    onClick={() => setCreateMallaAsignaturaOpenTab(1)}
                  >
                    {t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>componentes_calificacion', 'Componentes de la calificación')}
                  </span>
            )}
          </div>
          <hr />
          <Form>
            {createMallaAsignaturaOpenTab === 0 ? (
              <div>
                <FormGroup>
                  <Label>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>cantidad_lecciones_semanales', 'Cantidad de lecciones semanales')} *</Label>
                  <Input
                    disabled={props.readOnly}
                    name='cantidadLecciones'
                    type='number'
                    onChange={handleCreateMallaDataChange}
                    value={createMallaAsignaturaData.sendData.cantidadLecciones}
                    style={{ width: '4rem', border: errors?.cantidadLecciones ? '1px solid red' : '' }}
                    required
                  />
                  {
                    errors?.cantidadLecciones && (
                      <span style={{ color: 'red' }}>Este campo es requerido</span>
                    )
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>tipo_evaluacion', 'Tipo de evaluación de la asignatura/figura afín')} *</Label>
                  <Input
                    disabled={props.readOnly}
                    name='tipoEvaluacionId'
                    type='select'
                    required
                    onChange={handleCreateMallaDataChange}
                    style={{
                      border: errors?.tipoEvaluacionId ? '1px solid red' : ''
                    }}
                    value={createMallaAsignaturaData.sendData.tipoEvaluacionId}
                  >
                    <option
                      style={{ display: 'none', opacity: 0 }}
                      disabled={props.readOnly}
                    />
                    {state.tiposEvaluacion.map((el) => {
                      return <option value={el.id}>{el.nombre}</option>
                    })}
                  </Input>
                  {
                    errors?.tipoEvaluacionId && (
                      <span style={{ color: 'red' }}>Este campo es requerido</span>
                    )
                  }
                </FormGroup>
                {createMallaAsignaturaData.sendData.tipoEvaluacionId == 1 && (
                  <FormGroup>
                    <Label>Rúbrica del aprendizaje *</Label>
                    <Input
                      disabled={props.readOnly}
                      name='rubricaAprendizaje'
                      type='select'
                      onChange={handleCreateMallaDataChange}
                      value={
                        createMallaAsignaturaData.sendData.rubricaAprendizaje
                      }
                      style={{
                        border: errors?.rubricaAprendizaje ? '1px solid red' : ''
                      }}
                    >
                      <option
                        style={{ display: 'none', opacity: 0 }}
                        disabled={props.readOnly}
                      />
                      {state.indicadoresAprendizaje.map((el) => {
                        return (
                          <option value={el.id} disabled={props.readOnly}>
                            {el.nombre}
                          </option>
                        )
                      })}
                    </Input>
                  </FormGroup>
                )}
                <FormGroup>
                  <Label>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>periodos', 'Períodos de la asignatura')} *</Label>
                  <Input
                    name='periodoId'
                    type='select'
                    onChange={(e) => {
                      handleCreateMallaDataChange(e)
                    }}
                    value={createMallaAsignaturaData.sendData.periodoId}
                    disabled={(props.readOnly || disabledPeriod)}
                    required
                    style={{
                      border: errors?.periodoId ? '1px solid red' : ''
                    }}
                  >
                    <option style={{ display: 'none', opacity: 0 }} />
                    {state.periodosAll.map((el) => {
                      return <option value={el.id}>{el.nombre}</option>
                    })}
                  </Input>
                  {
                    errors?.periodoId && (
                      <span style={{ color: 'red' }}>Este campo es requerido</span>
                    )
                  }
                </FormGroup>
                {createMallaAsignaturaData.sendData.tipoEvaluacionId == 4 && (
                  <GridEscalaCalificacion
                    data={
                      createMallaAsignaturaData?.sendData?.escalaCalificacion
                    }
                    readonly={props.readOnly}
                    setData={(value) =>
                      handleCreateMallaDataChange({
                        target: { name: 'escalaCalificacion', value }
                      })}
                  />
                )}
                {createMallaAsignaturaData.sendData.periodoId && (
                  <table className='mallasTable-2'>
                    <thead>
                      <tr>
                        <td scope='col'>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>columna_nombre', 'Nombre')}</td>
                        <td scope='col'>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>columna_fecha_inicio', 'Fecha inicio')}</td>
                        {/* <td scope="col">Fecha inicio</td>
                        <td scope="col">Fecha de finalización</td>
                        <td scope="col">Fecha de cierre</td> */}
                        <td scope='col'>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>columna_porcentaje', 'Porcentaje')}</td>
                      </tr>
                    </thead>
                    <tbody>
                      {state.periodosAll.filter((el) => el.id === Number(createMallaAsignaturaData.sendData.periodoId))[0].bloques.map((el) => {
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
                {createMallaAsignaturaData.sendData.tipoEvaluacionId == 2
                  ? (
                    <>
                      <div style={{ display: 'flex' }}>
                        <FormGroup style={{ marginRight: '3rem', width: '45%' }}>
                          <Label>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>redondeo', 'Redondeo')} *</Label>
                          <Input
                            name='redondeo'
                            type='select'
                            onChange={handleCreateMallaDataChange}
                            value={createMallaAsignaturaData.sendData.redondeo}
                            disabled={props.readOnly}
                            style={{
                              border: errors?.redondeo ? '1px solid red' : ''
                            }}
                          >
                            <option
                              style={{ display: 'none', opacity: 0 }}
                            />
                            <option
                              value={50}
                              disabled={props.readOnly}
                              disabled={props.readOnly}
                            >
                              {t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>redondeo>mayor>05', 'Igual o mayor a 0.5')}
                            </option>
                            <option value={51} disabled={props.readOnly}>
                              {t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>redondeo>igual_mayor>051', 'Igual o mayor a 0.51')}
                            </option>
                          </Input>
                          {
                            errors?.redondeo && (
                              <span style={{ color: 'red' }}>Este campo es requerido</span>
                            )
                          }
                        </FormGroup>
                        <FormGroup>
                          <Label>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>actividad', 'Actividad de evaluación adicional')} *</Label>
                          <Input
                            name='elementosCatalogoId'
                            type='select'
                            onChange={handleCreateMallaDataChange}
                            value={
                              createMallaAsignaturaData.sendData
                                .elementosCatalogoId
                            }
                            style={{
                              border: errors?.elementosCatalogoId ? '1px solid red' : ''
                            }}
                            disabled={props.readOnly}
                          >
                            <option
                              style={{ display: 'none', opacity: 0 }}
                            />
                            {state.tipoEvaluacion.map((el) => {
                              return (
                                <option value={el.id} disabled={props.readOnly}>
                                  {el.nombre}
                                </option>
                              )
                            })}
                          </Input>
                          {
                            errors?.elementosCatalogoId && (
                              <span style={{ color: 'red' }}>Este campo es requerido</span>
                            )
                          }
                        </FormGroup>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <FormGroup style={{ marginRight: '3rem', width: '45%' }}>
                          <Label>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>nota_promocion', 'Nota de promoción')} *</Label>
                          <Input
                            disabled={props.readOnly}
                            name='notadepromocion'
                            type='number'
                            onChange={handleCreateMallaDataChange}
                            value={
                              createMallaAsignaturaData.sendData.notadepromocion
                            }
                            style={{ width: '4rem', border: errors?.notadepromocion ? '1px solid red' : '' }}
                          />
                          {
                            errors?.notadepromocion && (
                              <span style={{ color: 'red' }}>Este campo es requerido</span>
                            )
                          }
                        </FormGroup>
                        <FormGroup>
                          <CustomInput
                            disabled={props.readOnly}
                            label={t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>habilitar_creditos', 'Habilitar créditos')}
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
                              disabled={props.readOnly}
                              name='cantidadcreditos'
                              type='number'
                              onChange={handleCreateMallaDataChange}
                              value={
                                createMallaAsignaturaData.sendData
                                  .cantidadcreditos
                              }
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
                          disabled={props.readOnly}
                          label={t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>configuracion>habilitar_creditos', 'Habilitar créditos')}
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
                            disabled={props.readOnly}
                            name='cantidadcreditos'
                            type='number'
                            onChange={handleCreateMallaDataChange}
                            value={
                              createMallaAsignaturaData.sendData.cantidadcreditos
                            }
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
                        <h6>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>componentes_calificacion>componente_evaluacion', 'Componente de evaluación')}</h6>
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
                          noOptionsMessage={() => t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>componentes_calificacion>sin_opciones', 'Sin opciones')}
                          getOptionLabel={(option: any) => option.nombre}
                          getOptionValue={(option: any) => option.id}
                          onChange={(e) => handleComponenteChangeSelect(e, idx)}
                          isDisabled={props.readOnly}
                          components={{ Input: CustomSelectInput }}
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
                        <h6 style={{ padding: '0 1rem' }}>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>componentes_calificacion>porcentaje', 'Porcentaje')}</h6>
                        <div className='d-flex align-items-center justify-content-center'>
                          <Input
                            disabled={props.readOnly}
                            type='number'
                            name='valor'
                            value={el.valor}
                            onChange={(e) => handleComponenteChange(e, idx)}
                            style={{ width: '100%', marginLeft: '1rem' }}
                          />
                          <span style={{ fontSize: '21', marginLeft: '10px' }}>
                            %
                          </span>
                          {!props.readOnly &&
                            (state.componenteCalificacionAll.findIndex(
                              (el) =>
                                el?.id ===
                                stagedComponentes[idx]
                                  ?.sb_componenteCalificacionId
                            ) === -1 ||
                              !state.componenteCalificacionAll[
                                state.componenteCalificacionAll.findIndex(
                                  (el) =>
                                    el?.id ===
                                    stagedComponentes[idx]
                                      ?.sb_componenteCalificacionId
                                )
                              ]?.noRequiereInstrumentos) && (
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
                      {state.componenteCalificacionAll.findIndex(
                        (el) =>
                          el?.id ===
                          stagedComponentes[idx]?.sb_componenteCalificacionId
                      ) !== -1 &&
                        state.componenteCalificacionAll[
                          state.componenteCalificacionAll.findIndex(
                            (el) =>
                              el?.id ===
                              stagedComponentes[idx]
                                ?.sb_componenteCalificacionId
                          )
                        ]?.noRequiereInstrumentos && (
                          <div className='ml-3'>
                            <h6>Indicador de aprendizaje</h6>
                            <div className='d-flex align-items-center'>
                              <Select
                                placeholder=''
                                isDisabled={props.readOnly}
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
                                  const copiedComponents = [
                                    ...stagedComponentes
                                  ]
                                  copiedComponents[idx] = {
                                    ...copiedComponents[idx],
                                    sb_rubricaaprendizajeId: value?.id
                                  }
                                  // handleComponenteChangeSelect()
                                  setStagedComponentes(copiedComponents)
                                }}
                                noOptionsMessage={() => t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>componentes_calificacion>sin_opciones', 'Sin opciones')}
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
                    display: 'flex',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div className='' style={{ width: '15rem' }} />
                  <div className='' style={{ width: '20%' }}>
                    <h6 style={{ marginLeft: '1rem' }}>{t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>componentes_calificacion>total', 'Total')}</h6>
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
                {!props.readOnly && (
                  <Button
                    color='primary'
                    onClick={() => {
                      addDataComponenteCalificacion()
                    }}
                    style={{ marginBottom: '2rem' }}
                  >
                    {t('configuracion>centro_educativo>ver_centro_educativo>oferta_educativa>mallas_curriculares>modelo_oferta>componentes_calificacion>agregar', 'Agregar componente')}
                  </Button>
                )}
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
                {t('general>cancelar', 'Cancelar')}
              </Button>
              {!props.readOnly && (
                <>
                  <Button
                    color='primary'
                    style={{ marginRight: '20px' }}
                    onClick={() => {
                      createMallaAsignatura()
                    }}
                  >
                    {t('general>guardar', 'Guardar')}
                  </Button>

                  {createMallaAsignaturaData.sendData.id && (
                    <Button
                      color='danger'
                      onClick={() => {
                        deleteMultiple([createMallaAsignaturaData.sendData.id]) // deleteMallasAsignaturasInstitucionMultiples
                        toggleCreateMallaAsignatura()
                      }}
                    >
                      Eliminar
                    </Button>
                  )}
                </>
              )}
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default withRouter(MallaItem)
