import React from 'react'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import {
  getOffers,
  getModelosOfertasOptions,
  getEspecialidadesOptions,
  saveInstitutionOffer,
  updateInstitutionOffer,
  deleteInstitutionOffer,
  activarMultiples
} from '../../../../../../redux/ofertasInstitucion/actions'
import { getOfertas } from '../../../../../../redux/ofertas/actions'
import { getModalidades } from '../../../../../../redux/modalidades/actions'
import { getServicios } from '../../../../../../redux/servicios/actions'
import { getNiveles } from '../../../../../../redux/niveles/actions'
import { getLvlOfertas } from 'Redux/mallasCurriculares/actions'
import { useTranslation } from 'react-i18next'
import { getEspecialidades } from '../../../../../../redux/especialidades/actions'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import BuildIcon from '@mui/icons-material/Build'
import { IconButton, Tooltip } from '@mui/material'
// import Especialidades from '../Ofertas/Especialidades'
import * as yup from 'yup'
enum TYPES {
	SET_OFERTA_ID,
	SET_OFERTA_CATALOGO,
	SET_MODALIDAD_ID,
	SET_MODALIDAD_CATALOGO,
	SET_SERVICIO_ID,
	SET_SERVICIO_CATALOGO,
	SET_ESPECIALIDAD_ID,
	SET_ESPECIALIDAD_CATALGO,
	SET_FORM_VALUES,
	SET_NIVEL_CATALOGO,
	SET_OFERTA_MODAL_SERV_BY_INSTITUCION_LIST,
	SET_FORM_OFERTA_MODAL_SERV_ID,
  SET_ANIO_EDUCATIVO_OBJ,
	TOGGLE_FORM,
	SET_ESTADO_ID,
	TOGGLE_EDITING_FORM,
	SET_OBSERVACIONES,
	SET_NIVEL_ESTADO,
	SET_ESPECIALIDAD_ESTADO,
	CLEAR_SELECT_VALUES,
	SET_CHECKLIST,
	SET_LOADING,
	SET_CODIGO_PRESUPUESTARIO
}

const initialState = {
  ofertaInstitucionId: null,
  ofertaId: null,
  ofertaCatalogo: [],
  modalidadId: null,
  modalidadCatalogo: [],
  servicioId: null,
  servicioCatalogo: [],
  especialidadId: null,
  especialidadCatalogo: [],
  estadoOferta: null,
  observaciones: '',
  ofertaModalidadServicioId: null,
  nivelCatalogo: null,
  nivelOfertaId: null,
  anioEducativo: null,
  loading: false,
  estadoId: null,
  showForm: false,
  editing: false,
  ofertaModalidadServicioInstitucion: [],
  ofertaDropDownCatalog: [],
  modalidadDropDownCatalog: [],
  servicioDropDownCatalog: [],
  nivelesCheckList: [],
  especialidadesCheckList: [],
  codigoPresupuestarioModalidad: null,
  codigoPresupuestarioOferta: null,
  codigoPresupuestarioServicio: null,
  codigoPresupuestario: '',
  observacion:''
}

const buildFullCatalogo = (
  obj,
  ofertaCatalogo,
  modalidadCatalogo,
  servicioCatalogo
) => {
  return obj.map((item) => {
    return {
      ...item,
      ofertaNombre: ofertaCatalogo.find((i) => i.id == item.ofertaId),
      modalidadNombre: modalidadCatalogo.find(
        (i) => i.id == item.modalidadId
      ),
      servicioNombre: servicioCatalogo.find(
        (i) => i.id == item.servicioId
      )
    }
  })
}
const dropDownMapper = (array, idProp, nameProp) => {
  return array.map((i) => {
    return {
      label: i[nameProp],
      value: i[idProp]
    }
  })
}

const buildCheckList = (
  ofertaModalidadServicioInstitucion,
  ofertaId,
  modalidadId,
  servicioId
) => {
  // const { ofertaModalidadServicioInstitucion } = state
  if (
    !ofertaModalidadServicioInstitucion ||
		!Array.isArray(ofertaModalidadServicioInstitucion)
  ) {
    return {
      niveles: []
    }
  }
  let ofertasModalServList = ofertaModalidadServicioInstitucion.filter(
    (i) => i.ofertaId == ofertaId
  )

  ofertasModalServList = ofertasModalServList.filter(
    (i) => i.modalidadId == modalidadId
  )

  if (!(servicioId == null || servicioId == undefined)) {
    ofertasModalServList = ofertasModalServList.filter(
      (i) => i.servicioId == servicioId
    )
  }

  const nivelesDictionary = {}
  const especialidadesDictionary = {}
  const nivelesArr = ofertasModalServList.flatMap((i) => {
    return [].concat(i.nivelesOferta)
  })

  for (const nivelOferta of nivelesArr) {
    nivelesDictionary[nivelOferta.nivelId] = nivelOferta.nivelNombre
    /* if (nivelOferta.especialidadId != 0)
			especialidadesDictionary[nivelOferta.especialidadId] =
				nivelOferta.especialidadNombre */
  }
  const niveles =
		Object.keys(nivelesDictionary).map((i) => {
		  const existenEstadosTrue = nivelesArr.some(
		    (j) => j.nivelId == i && j.estado == true
		  )
		  const hasMatricula = ofertasModalServList.some((j) =>
		    j.nivelesOferta.some(
		      (k) => k.nivelId == i && k.tieneMatricula == true
		    )
		  )
		  const especialidades =
				nivelesArr.filter(
				  (j) => j.nivelId == i && j.especialidadId != 0
				) || []

		  const nivelOfertaId =
				especialidades.length == 0
				  ? nivelesArr.find((j) => j.nivelId == i).nivelOfertaid
				  : null

		  return {
		    nivelId: i,
		    nivelNombre: nivelesDictionary[i],
		    nivelOfertaId,
		    estado: existenEstadosTrue,
		    tieneMatricula: hasMatricula,
		    especialidades
		  }
		}) || []

  return {
    niveles
  }
}

const buildDropdownCatalog = (state, ofertaId, modalidadId, servicioId) => {
  const { ofertaModalidadServicioInstitucion } = state
  const reduceMembersAsArray = (arr, idAtt, nameAtt) => {
    const dictionary = {}

    for (const obj of arr) {
      dictionary[obj[idAtt]] = obj[nameAtt]
    }
    return Object.keys(dictionary).map((i) => {
      return { value: i, label: dictionary[i] }
    })
  }
  const ofertasFiltradasXOferta = ofertaModalidadServicioInstitucion.filter(
    (i) => i.ofertaId == ofertaId
  )

  const ofertasFiltradasXModalidad = ofertasFiltradasXOferta.filter(
    (i) => i.modalidadId == modalidadId
  )
  const modalidadesDropdownCatalog = reduceMembersAsArray(
    ofertasFiltradasXOferta,
    'modalidadId',
    'modalidadNombre'
  )
  // const ofertasFiltradosXServicio = ofertasFiltradasXModalidad.filter((i) => i.servicioId == servicioId)
  const serviciosDropdownCatalog = reduceMembersAsArray(
    ofertasFiltradasXModalidad,
    'servicioId',
    'servicioNombre'
  )
  return {
    modalidadesDropdownCatalog,
    serviciosDropdownCatalog
  }
}

const estados = [
  {
    label: 'ACTIVA',
    value: 1
  },
  {
    label: 'INACTIVA',
    value: 0
  }
]

const reducer = (state = initialState, action): typeof initialState => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_OFERTA_CATALOGO:
      const ofertaDropDownCatalog = dropDownMapper(
        payload,
        'id',
        'nombre'
      )
      return { ...state, ofertaCatalogo: payload, ofertaDropDownCatalog }

    case TYPES.SET_MODALIDAD_CATALOGO:
      const modalidadDropDownCatalog = dropDownMapper(
        payload,
        'id',
        'nombre'
      )
      return {
        ...state,
        modalidadCatalogo: payload,
        modalidadDropDownCatalog
      }

    case TYPES.SET_SERVICIO_CATALOGO:
      const servicioDropDownCatalog = dropDownMapper(
        payload,
        'id',
        'nombre'
      )
      return {
        ...state,
        servicioCatalogo: payload,
        servicioDropDownCatalog
      }

    case TYPES.SET_ESPECIALIDAD_CATALGO:
      return { ...state, especialidadCatalogo: payload }

    case TYPES.SET_FORM_VALUES:
      return { ...state, ...payload }

    case TYPES.SET_NIVEL_CATALOGO:
      return { ...state, nivelCatalogo: payload }

    case TYPES.SET_OFERTA_MODAL_SERV_BY_INSTITUCION_LIST:
      return { ...state, ofertaModalidadServicioInstitucion: payload }

    case TYPES.SET_FORM_OFERTA_MODAL_SERV_ID: {
      
      const {
        ofertaId,
        modalidadId,
        servicioId,
        estado,       
        ofertaInstitucionalidadId,
        codigoPresupuestarioModalidad,
        codigoPresupuestarioOferta,
        codigoPresupuestarioServicio,
        ofertaInstitucionalidadEstado,
        nombreAnioEducativo,
        anioEducativoId,
        observaciones,
        codigoPresupuestario
      } = state.ofertaModalidadServicioInstitucion.find(
        (i) => i.ofertaModalServId == payload
      )
      const { niveles } = buildCheckList(
        state.ofertaModalidadServicioInstitucion,
        ofertaId,
        modalidadId,
        servicioId
      )
      return {
        ...state,
        ofertaId,
        modalidadId,
        servicioId,
        estadoId: estado,
        estadoOferta: ofertaInstitucionalidadEstado,
        observaciones,
        ofertaModalidadServicioId: payload,
        ofertaInstitucionId: ofertaInstitucionalidadId,
        nivelesCheckList: niveles,
        codigoPresupuestarioModalidad,
        codigoPresupuestarioOferta,
        codigoPresupuestarioServicio,
        codigoPresupuestario,
        anioEducativo: {label:nombreAnioEducativo,value:anioEducativoId}
      }
    }

    case TYPES.TOGGLE_FORM:
      return { ...state, showForm: !state.showForm, editing: payload }

    case TYPES.SET_OFERTA_ID:
      return {
        ...state,
        ofertaId: payload
      }

    case TYPES.SET_MODALIDAD_ID:
      return {
        ...state,
        modalidadId: payload
      }

    case TYPES.SET_SERVICIO_ID:
      return {
        ...state,
        servicioId: payload
      }

    case TYPES.SET_ESPECIALIDAD_ID: {
      return {
        ...state,
        especialidadId: payload
      }
    }

    case TYPES.SET_ESTADO_ID:
      return { ...state, estadoId: payload }

    case TYPES.TOGGLE_EDITING_FORM:
      return { ...state, editing: !state.editing }

    case TYPES.SET_OBSERVACIONES:
      return { ...state, observaciones: payload }

    case TYPES.SET_NIVEL_ESTADO: {
      const nivelesCheckList = state.nivelesCheckList.map((item) => {
        if (item.nivelId == payload) {
          const newEstado = !item.estado
          const { especialidades } = item
          const newEspecialidades = especialidades.map((esp) => {
            return { ...esp, estado: newEstado }
          })
          return {
            ...item,
            especialidades: newEspecialidades,
            estado: newEstado
          }
        } else {
          return item
        }
      })
      return {
        ...state,
        nivelesCheckList
      }
    }

    case TYPES.SET_ESPECIALIDAD_ESTADO: {
      const { nivelId, nivelofertaId } = payload
      const nivelesCheckList = state.nivelesCheckList.map((item) => {
        if (item.nivelId == nivelId) {
          const { especialidades } = item
          const newEspecialidades = especialidades.map((esp) => {
            if (esp.nivelOfertaid == nivelofertaId) { return { ...esp, estado: !esp.estado } } else return esp
          })
          return {
            ...item,
            especialidades: newEspecialidades
          }
        } else {
          return item
        }
      })

      return {
        ...state,
        nivelesCheckList
      }
    }

    case TYPES.CLEAR_SELECT_VALUES: {
      return {
        ...state,
        ofertaInstitucionId: null,
        ofertaId: null,
        modalidadId: null,
        servicioId: null,
        nivelesCheckList: [],
        especialidadesCheckList: [],
        estadoId: 1,
        codigoPresupuestario: '0000'
      }
    }
    case TYPES.SET_CHECKLIST: {
      return { ...state, nivelesCheckList: payload }
    }
    case TYPES.SET_LOADING: {
      return { ...state, loading: payload }
    }
    case TYPES.SET_CODIGO_PRESUPUESTARIO: {
      return { ...state, codigoPresupuestario: payload }
    }
    case TYPES.SET_ANIO_EDUCATIVO_OBJ:{
      return {...state,anioEducativo:payload }
    }
    default:
      return state
  }
}

const useOferta = ({ handleSnackbar, handleError }) => {
  const { t } = useTranslation()

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const reduxState = useSelector<any, any>((store) => {
    return {
      ofertas: store.ofertas.ofertas,
      modalidades: store.modalidades.modalidades,
      servicios: store.servicios.servicios,
      niveles: store.niveles.niveles,
      especialidades: store.especialidades.especialidades,
      currentInstitution: store.configuracion.currentInstitution,
      anioEducativos: store.authUser.activeYears,
      anioEducativoSelected: store.authUser.selectedActiveYear
    }
  })

  const setLoading = (estado) => {
    dispatch({ type: TYPES.SET_LOADING, payload: estado })
  }

  const fetchOfertas = async () => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad/getOfertas`
      const response = await axios.get(url)
      return response.data
    } catch (e) {
      console.log(e)
      return { error: true }
    }
  }

  const fetchModalidadByOfertaId = async (ofertaId) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad/getModalidadesByOfertaId?ofertaId=${ofertaId}`
      const response = await axios.get(url)
      return response.data
    } catch (e) {
      console.log(e)
      return { error: true }
    }
  }

  const fetchServiciosByModalidadId = async (modalidadId) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad/getServiciosByModalidadId?modalidadId=${modalidadId}`
      const response = await axios.get(url)
      return response.data
    } catch (e) {
      console.log(e)
      return { error: true }
    }
  }

  const fetchNivelesOfertaByOfertaModalidadServicio = async (
    ofertaId,
    modalidadId,
    servicioId
  ) => {
    const nullable = (key, value) => {
      if (!value || !key) return ''
      else return `${key}=${value}`
    }
    try {
      const url = `${
				envVariables.BACKEND_URL
			}/api/OfertasPorInstitucionalidad/GetNivelesOfertaByOfertaModalidadServicio?ofertaId=${ofertaId}&modalidadId=${modalidadId}${nullable(
				'&servicioId',
				servicioId
			)}`
      const response = await axios.get<any>(url)
      return response.data
    } catch (e) {
      console.log(e)
      return { error: true }
    }
  }

  const actions = useActions({
    getOfertas,
    getOffers,
    getModalidades,
    getServicios,
    getNiveles,
    getEspecialidades,
    updateInstitutionOffer,
    saveInstitutionOffer,
    deleteInstitutionOffer,
    activarMultiples
  })

  const loadOfertaModalidadServicioByInstitucionId = async (
    institucionId?
  ) => {
    institucionId =
			institucionId == undefined || null
			  ? reduxState.currentInstitution.id
			  : institucionId
    const response = await axios.get<any>(
			`${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad/GetOfertaModalidadServicioNiveles?institucionId=${institucionId}`
    )
    dispatch({
      type: TYPES.SET_OFERTA_MODAL_SERV_BY_INSTITUCION_LIST,
      payload: response.data
    })
  }

  const setFormValues = ({
    ofertaModalServId,
    ofertaId,
    modalidadId,
    servicioId,
    observacion,
    estadoId
  }) => {
    dispatch({
      type: TYPES.SET_FORM_VALUES,
      payload: {
        ofertaModalServId,
        ofertaId,
        modalidadId,
        servicioId,
        observacion,
        estadoId
      }
    })
  }

  const loadOfertaCatalogo = async () => {
    const mapeador = (item) => {
      return {
        id: item.id,
        nombre: item.nombre
      }
    }
    const ofertas: any = await fetchOfertas()
    const payload = ofertas.map(mapeador)
    dispatch({ type: TYPES.SET_OFERTA_CATALOGO, payload })
    return payload
  }

  const loadModalidadCatalogo = async (ofertaId) => {
    // console.log(state)
    // alert("state.ofertaId"+state.ofertaId)
    if (!ofertaId) return
    const mapeador = (item) => {
      return {
        id: item.id,
        nombre: item.nombre
      }
    }
    const modalidades: any = await fetchModalidadByOfertaId(ofertaId)
    const payload = modalidades.map(mapeador)
    dispatch({ type: TYPES.SET_MODALIDAD_CATALOGO, payload })
    return payload
  }

  const loadServiciosCatalogo = async (modalidadId) => {
    // console.log(state)
    // alert("modalidadId"+state.modalidadId)
    if (!modalidadId) return
    const mapeador = (item) => {
      return {
        id: item.id,
        nombre: item.nombre
      }
    }
    const servicios: any = await fetchServiciosByModalidadId(modalidadId)
    const payload = servicios.map(mapeador)
    dispatch({ type: TYPES.SET_SERVICIO_CATALOGO, payload })
    return payload
  }
  const obtenerOfertaModalidadServicioId = (ofertaModalServId) => {
    const { ofertaId, modalidadId, servicioId } =
			state.ofertaModalidadServicioInstitucion.find(
			  (i) => i.ofertaModalServId == ofertaModalServId
			)
    return {
      ofertaId,
      modalidadId,
      servicioId
    }
  }
  const setFormOfertaModalServId = (id) => {
    dispatch({ type: TYPES.SET_FORM_OFERTA_MODAL_SERV_ID, payload: id })
    const { ofertaId, modalidadId, servicioId } =
			obtenerOfertaModalidadServicioId(id)
    Promise.all([
      loadModalidadCatalogo(ofertaId),
      loadServiciosCatalogo(modalidadId),
      loadOfertaCatalogo()
    ])
  }

  const onHtmlTableRowClick = (item) => {
    toggleForm()
    setFormOfertaModalServId(item.ofertaModalServId)
    onChangeAnioEducativoSelect({label: reduxState.anioEducativoSelected.nombre, value:reduxState.anioEducativoSelected.id})
  }

  const toggleForm = (editing?) => {
    dispatch({ type: TYPES.TOGGLE_FORM, payload: !!editing })
  }

  const onChangeOfertaDropdown = (obj) => {
    dispatch({ type: TYPES.SET_OFERTA_ID, payload: obj.value })
    loadModalidadCatalogo(obj.value).then((_) => {
      dispatch({ type: TYPES.SET_MODALIDAD_ID, payload: null })
      dispatch({ type: TYPES.SET_SERVICIO_ID, payload: null })
      dispatch({ type: TYPES.SET_CHECKLIST, payload: [] })
    })
  }
  const onChangeModalidadDropdown = (obj) => {
    dispatch({ type: TYPES.SET_MODALIDAD_ID, payload: obj.value })
    loadServiciosCatalogo(obj.value).then((_) => {
      dispatch({ type: TYPES.SET_SERVICIO_ID, payload: null })
      setCheckList(null, obj.value, null)
    })
  }
  const onChangeServicioDropdown = (obj) => {
    dispatch({ type: TYPES.SET_SERVICIO_ID, payload: obj.value })
    setCheckList(null, null, obj.value)
  }
  const onChangeEstadoDropdown = (obj) => {
    dispatch({ type: TYPES.SET_ESTADO_ID, payload: obj.value })
  }
  const onChangeObservaciones = (e) => {
    const { value } = e.target
    dispatch({ type: TYPES.SET_OBSERVACIONES, payload: value })
  }

  const toggleEditingForm = () => {
    dispatch({ type: TYPES.TOGGLE_EDITING_FORM })
  }

  const onClickCheckNivelEvent = (nivelId) => {
    const algunNivelOfertaTieneMatricula = state.nivelesCheckList
      .find((i) => i.nivelId == nivelId)
      ?.especialidades.some((i) => i.tieneMatricula)
    if (algunNivelOfertaTieneMatricula) {
      handleSnackbar(
        'error',
        'No puede deshabilitar un nivel/especialidad que tiene matriculas asociadas'
      )
      return
    }
    dispatch({ type: TYPES.SET_NIVEL_ESTADO, payload: nivelId })
  }

  const onClickCheckEspecialidadEvent = (nivelId, nivelofertaId) => {
    const especialidad = state.nivelesCheckList
      .find((i) => i.nivelId == nivelId)
      ?.especialidades.find((i) => i.nivelOfertaid == nivelofertaId)
    if (especialidad && especialidad.tieneMatricula == true) {
      handleSnackbar(
        'error',
        'No puede deshabilitar un nivel/especialidad que tiene matriculas asociadas'
      )
      return
    }
    dispatch({
      type: TYPES.SET_ESPECIALIDAD_ESTADO,
      payload: { nivelId, nivelofertaId }
    })
  }
  const verifyRequestBody = (body) => {
    const schema = yup.object().shape({
      sb_institucionalidadesId: yup
        .number()
        .required('Centro educativo es un campo requerido'),
      codigoPresupuestario: yup.string().nullable().optional(),
      // codigoPresupuestarioOferta: yup.number().positive().required('Código Presupuestario Oferta es requerido'),
      // codigoPresupuestarioModalidad: yup.number().positive().required('Código Presupuestario Modalidad es requerido'),
      // codigoPresupuestarioServicio: yup.number().positive().required('Código Presupuestario Servicio es requerido'),
      sb_ofertaModalServId: yup
        .number()
        .required('IdOfertaModalServ requerido'),
      observaciones: yup.string().optional(),
      estado: yup.boolean().required(),
      nivelOferta: yup
        .array()
        .min(1, 'Debe seleccionar al menos un Nivel de la Oferta'),
      detalleOferta: yup.string().optional(),
      detalleModalidad: yup.string().optional(),
      detalleEspecialidad: yup.string().optional(),
      detalleServicio: yup.string().optional(),
      anioEducativoId: yup.number().required('Debe establecer el año educativo'),
    })
    try {
      schema.validateSync(body)
      return body
    } catch (e) {
      return e.errors
    }
  }
  const updateModelosOfertaRequest = async () => {
    const nivelesOferta = state.nivelesCheckList.flatMap((nivel) => {
      if (nivel.especialidades.length == 0) {
        return [
          { nivelOfertaid: nivel.nivelOfertaId, estado: nivel.estado }
        ]
      } else return nivel.especialidades
    })

    const niveles = nivelesOferta
      .filter((i) => i.estado == true)
      .map((i) => i.nivelOfertaid)
    const body = {
      id: state.ofertaInstitucionId,
      sb_institucionalidadesId: reduxState.currentInstitution.id,
      codigoPresupuestario: state.codigoPresupuestario,
      codigoPresupuestarioOferta: state.codigoPresupuestarioOferta,
      codigoPresupuestarioModalidad: state.codigoPresupuestarioModalidad,
      codigoPresupuestarioServicio: state.codigoPresupuestarioServicio,
      sb_ofertaModalServId: state.ofertaModalidadServicioId,
      observaciones: state.observaciones || '',
      estado: state.estadoId > 0,
      nivelOferta: niveles,
      anioEducativoId: state.anioEducativo?.value
    }

    const validatedBody = verifyRequestBody(body)

    if (Array.isArray(validatedBody)) {
      handleSnackbar('error', validatedBody.pop())
      return
    }

    setLoading(true)

    const response = await actions.updateInstitutionOffer(body)
    setLoading(false)

    if (response.error) {
      if (response.error.includes('TYPE')) {
        handleError(response.error)
      } else handleSnackbar('error', response.error)
    } else {
      loadOfertaModalidadServicioByInstitucionId().then((_) => {
        toggleForm()
        handleSnackbar('success', 'Se actualizó correctamente')
      })
    }
  }

  const createOfertaInstitucionalidadRequest = async () => {
    const nivelesOferta = state.nivelesCheckList.flatMap((nivel) => {
      if (nivel.especialidades.length == 0) {
        return [
          { nivelOfertaid: nivel.nivelOfertaId, estado: nivel.estado }
        ]
      } else return nivel.especialidades
    })

    const niveles = nivelesOferta
      .filter((i) => i.estado == true)
      .map((i) => i.nivelOfertaid)

    if (!state.ofertaId || !state.modalidadId || !state.servicioId) {
      handleSnackbar(
        'error',
        'Debe seleccionar la oferta, modalidad y servicio'
      )
      return
    }

    const modelOferta = await fetchNivelesOfertaByOfertaModalidadServicio(
      state.ofertaId,
      state.modalidadId,
      state.servicioId
    )
    const id = modelOferta?.pop().ofertaModalServId

    const body = {
      sb_institucionalidadesId: reduxState.currentInstitution.id,
      codigoPresupuestarioOferta: state.codigoPresupuestarioOferta || '',
      codigoPresupuestarioModalidad:
				state.codigoPresupuestarioModalidad || '',
      codigoPresupuestarioServicio:
				state.codigoPresupuestarioServicio || '',
      sb_ofertaModalServId: id,
      codigoPresupuestario: state.codigoPresupuestario,
      observaciones: state.observaciones || '',
      estado: state.estadoId > 0,
      nivelOferta: niveles,
      detalleOferta: '',
      detalleModalidad: '',
      detalleEspecialidad: '',
      detalleServicio: '',
      anioEducativoId: state.anioEducativo?.value
    }

    const validatedBody = verifyRequestBody(body)

    if (Array.isArray(validatedBody)) {
      handleSnackbar('error', validatedBody.pop())
      return
    }

    const response = await actions.saveInstitutionOffer(body)

    if (response.error) {
      handleSnackbar('error', response.error)
    } else {
      loadOfertaModalidadServicioByInstitucionId().then((_) => {
        toggleForm()
        handleSnackbar('success', 'Se registró correctamente')
      })
    }
  }

  const clearForm = () => {
    dispatch({ type: TYPES.CLEAR_SELECT_VALUES })
  }

  const onAgregarEvent = () => {
    toggleForm(true)
    clearForm()
    onChangeAnioEducativoSelect({label: reduxState.anioEducativoSelected.nombre, value:reduxState.anioEducativoSelected.id})
    if (state.ofertaCatalogo.length === 0) loadOfertaCatalogo()
  }

  const onSaveButtonEvent = () => {
    if (state.ofertaInstitucionId == null) { createOfertaInstitucionalidadRequest() } else updateModelosOfertaRequest()
  }

  const setCheckList = (ofertaId, modalidadId, servicioId) => {
    ofertaId = ofertaId || state.ofertaId
    modalidadId = modalidadId || state.modalidadId
    servicioId = servicioId || state.servicioId
    if (!ofertaId || !modalidadId || !servicioId) return

    fetchNivelesOfertaByOfertaModalidadServicio(
      ofertaId,
      modalidadId,
      servicioId
    ).then((response: any) => {
      if (!response || response.length == 0) {
        dispatch({ type: TYPES.SET_CHECKLIST, payload: [] })
        return
      }

      const { niveles } = buildCheckList(
        response,
        ofertaId,
        modalidadId,
        servicioId
      )
      dispatch({ type: TYPES.SET_CHECKLIST, payload: niveles })
    })
  }

  const handleDelete = async (ids) => {
    console.log('Entro al delete', ids)
    const response = await actions.deleteInstitutionOffer(ids)
    if (response.error) {
      if (response.mensaje.includes('TYPE')) {
        handleError(response.mensaje)
      } else handleSnackbar('error', response.mensaje)
    } else {
      handleSnackbar('success', 'Se desactivo correctamente')
      loadOfertaModalidadServicioByInstitucionId()
    }
  }

  const handleActivate = async (ids) => {
    console.log('Entro al Activar', ids)
    const response = await actions.activarMultiples(ids)
    if (response.error) {
      handleSnackbar('error', 'No puede activar el nivel')
    } else {
      handleSnackbar('success', 'Se activo correctamente')
      loadOfertaModalidadServicioByInstitucionId()
    }
  }

  const buildOfertaModalServAcciones = (fullrow, id, estado) => {
    return (
      <div key={id} style={{ display: 'flex' }}>
        {!estado
          ? (
            <Tooltip title={t('general>activar', 'Activar')}>
              <IconButton onClick={(e) => handleActivate([id])}>
                <BookAvailable color='#145388'/>
              </IconButton>
            </Tooltip>
            )
          : (
            <Tooltip title={t('general>inactivar', 'Deshabilitar')}>
              <IconButton onClick={(e) => handleDelete([id])}>
                <BookDisabled  />
              </IconButton>
            </Tooltip>
            )}
        <Tooltip title={t('general>editar', 'Editar')}>
          <IconButton>
            <BuildIcon
              onClick={() => onHtmlTableRowClick(fullrow)}
            />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
  const onChangeCodigoPresupuestario = (e) => {
    const { value } = e.target
    dispatch({ type: TYPES.SET_CODIGO_PRESUPUESTARIO, payload: value })
  }
  const onChangeAnioEducativoSelect = (obj)=>{
    dispatch({type:TYPES.SET_ANIO_EDUCATIVO_OBJ, payload:obj})
  }
  return {
    loading: state.loading,
    loadOfertaModalidadServicioByInstitucionId,
    ofertaCatalogo: state.ofertaCatalogo,
    modalidadCatalogo: state.modalidadCatalogo,
    servicioCatalogo: state.servicioCatalogo,
    especialidadCatalogo: state.especialidadCatalogo,
    nivelCatalogo: state.nivelCatalogo,
    setFormValues,
    ofertaModalidadServicioList:
			state.ofertaModalidadServicioInstitucion.length > 0
			  ? state.ofertaModalidadServicioInstitucion?.map((i) => {
			    return {
			      id: i.idOfertaInst,
			      ofertaModalServId: i.ofertaModalServId,
			      oferta: i.ofertaNombre,
			      modalidad: i.modalidadNombre,
			      servicio: i.servicioNombre,
			      estado: i.ofertaInstitucionalidadEstado,
			      estadoP: i.ofertaInstitucionalidadEstado
			        ? 'ACTIVO'
			        : 'INACTIVO',
			      observacion: i.observacion,
			      codigoPresu: i.codigoPresupuestario || '0000',
            nombreAnioEducativo: i.nombreAnioEducativo,
			      acciones: buildOfertaModalServAcciones(
			        i,
			        i.idOfertaInst,
			        i.ofertaInstitucionalidadEstado
			      )
			    }
				  })
			  : [],
    toggleForm,
    onHtmlTableRowClick,
    showForm: state.showForm,
    ofertaDropDownCatalog: state.ofertaDropDownCatalog,
    modalidadDropDownCatalog: state.modalidadDropDownCatalog,
    servicioDropDownCatalog: state.servicioDropDownCatalog,
    ofertaId: state.ofertaId,
    modalidadId: state.modalidadId,
    servicioId: state.servicioId,
    editing: state.editing,
    estadoId: state.estadoId,
    estadoOferta: state.estadoOferta,
    estadosCatalogo: estados,
    onChangeOfertaDropdown,
    onChangeModalidadDropdown,
    onChangeServicioDropdown,
    onChangeEstadoDropdown,
    observaciones: state.observaciones,
    toggleEditingForm,
    onChangeObservaciones,
    nivelesCheckList: state.nivelesCheckList,
    especialidadesCheckList: state.nivelesCheckList
      ? state.nivelesCheckList.filter((i) => i.especialidades.length > 0)
      : [],
    onClickCheckNivelEvent,
    onClickCheckEspecialidadEvent,
    updateModelosOfertaRequest,
    onAgregarEvent,
    onSaveButtonEvent,
    onChangeCodigoPresupuestario,
    codigoPresupuestario: state.codigoPresupuestario,
    anioEducativoCatalog: reduxState.anioEducativos.map(i=>({label:i.nombre,value:i.id})),
    anioEducativo: state.anioEducativo,
    onChangeAnioEducativoSelect
  }
}

export default useOferta
