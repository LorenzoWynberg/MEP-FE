import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { getInstitucion } from 'Redux/configuracion/actions'
import axios from 'axios'
import { useReducer, useState } from 'react'
import { envVariables } from 'Constants/enviroment'
import { getCantonesByProvincia } from 'Redux/cantones/actions'
import { getDistritosByCanton } from 'Redux/distritos/actions'
import { getPobladosByDistrito } from 'Redux/poblados/actions'
import { getProvincias } from 'Redux/provincias/actions'
import { getOfferModalServ } from 'Redux/anioEducativo/actions'
import { getSpecialtiesByModel } from 'Redux/modelosOferta/actions'
import { getModelosOfertasAssigned } from 'Redux/ofertasInstitucion/actions'
import { showProgress, hideProgress } from 'Utils/progress'

const TYPES = {
  GET_INSTITUCIONES: 'GET_INSTITUCIONES',
  SET_INITIAL_STATE: 'SET_INITIAL_STATE',
  SET_PROVINCIA: 'SET_PROVINCIA',
  SET_CANTON: 'SET_CANTON',
  SET_DISTRITO: 'SET_DISTRITO',
  SET_POBLADO: 'SET_POBLADO',
  SET_OFERTAEDUCATIVA: 'SET_OFERTAEDUCATIVA',
  SET_ESPECIALIADAD: 'SET_ESPECIALIDAD',
  SET_POBLADO_VALUE: 'SET_POBLADO_VALUE',
  SET_ESPECILIADAD_VALUE: 'SET_ESPECILIADAD_VALUE',
  GET_INFO_INSTITUCION_ID: 'GET_INFO_INSTITUCION_ID',
  GET_OFERTAS_BY_INSTITUCION: 'GET_OFERTAS_BY_INSTITUCION',
  SET_INPUT_VALUE: 'SET_INPUT_VALUE',
  SET_ANIOS: 'SET_ANIOS',
  SET_OFERTAS_EDUCATIVAS_CATALOG: 'SET_OFERTAS_EDUCATIVAS_CATALOG',
  SET_ANIO_VALUE: 'SET_ANIO_VALUE',
  SET_INSTITUCION_ID: 'SET_INSTITUCION_ID',
  CLEAR_OFERTA_EDUCATIVA_DATA: 'CLEAR_OFERTA_EDUCATIVA_DATA',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  CLEAR_INFO_INSTITUCION_ID: 'CLEAR_INFO_INSTITUCION_ID',
  CLEAR_FILTERS_CANTON: 'CLEAR_FILTERS_CANTON',
  CLEAR_FILTERS_DISTRITO: 'CLEAR_FILTERS_DISTRITO',
  CLEAR_FILTERS_POBLADO: 'CLEAR_FILTERS_POBLADO',
  CLEAR_FILTERS_ESPECIALIDAD: 'CLEAR_FILTERS_ESPECIALIDAD',
  CLEAR_FILTERS_OFERTA: 'CLEAR_FILTERS_OFERTA',
  NEW_SEARCH: 'NEW_SEARCH'
}

const initialState = {
  instituciones: null,
  provincias: [],
  canton: [],
  distrito: [],
  poblado: [],
  ofertaEducativa: [],
  especialidad: [],
  provinciaValue: null,
  cantonValue: null,
  distritoValue: null,
  pobladoValue: null,
  especialidadValue: null,
  ofertaEducativaValue: null,
  infoGeneral: [],
  ofertaByInstitucion: [],
  inputValue: '',
  anios: [],
  ofertasEducativasCatalog: [],
  anioValue: null,
  institucionId: null,
  loading: false
}
const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case TYPES.NEW_SEARCH: {
      return {
        ...state,
        inputValue: '',
        provinciaValue: null,
        cantonValue: null,
        distritoValue: null,
        pobladoValue: null,
        especialidadValue: null,
        ofertaEducativaValue: null,
        instituciones: null,
        canton: [],
        distrito: [],
        poblado: [],
        especialidad: []
      }
    }
    case TYPES.GET_INSTITUCIONES: {
      return {
        ...state,
        instituciones: payload
      }
    }
    case TYPES.SET_PROVINCIA: {
      return {
        ...state,
        provincias: payload,
        canton: [],
        distrito: [],
        poblado: [],
        cantonValue: null,
        distritoValue: null,
        pobladoValue: null
      }
    }
    case TYPES.SET_CANTON: {
      return {
        ...state,
        canton: payload.data,
        provinciaValue: payload.provinciaValue,
        distrito: [],
        poblado: [],
        cantonValue: null,
        distritoValue: null
      }
    }
    case TYPES.SET_DISTRITO: {
      return {
        ...state,
        distrito: payload.data,
        cantonValue: payload.cantonValue,
        poblado: [],
        pobladoValue: null
      }
    }
    case TYPES.SET_POBLADO: {
      return {
        ...state,
        poblado: payload.data,
        distritoValue: payload.distritoValue
      }
    }
    case TYPES.SET_OFERTAEDUCATIVA: {
      return {
        ...state,
        ofertaEducativa: payload,
        especialidad: [],
        especialidadValue: null
      }
    }
    case TYPES.SET_ESPECIALIADAD: {
      return {
        ...state,
        especialidad: payload.data,
        ofertaEducativaValue: payload.ofertaEducativaValue
      }
    }
    case TYPES.SET_POBLADO_VALUE: {
      return {
        ...state,
        pobladoValue: payload
      }
    }
    case TYPES.SET_ESPECILIADAD_VALUE: {
      return {
        ...state,
        especialidadValue: payload
      }
    }
    case TYPES.GET_INFO_INSTITUCION_ID: {
      return {
        ...state,
        infoGeneral: payload
      }
    }
    case TYPES.CLEAR_INFO_INSTITUCION_ID: {
      return {
        ...state,
        infoGeneral: []
      }
    }
    case TYPES.GET_OFERTAS_BY_INSTITUCION: {
      return {
        ...state,
        ofertaByInstitucion: payload
      }
    }
    case TYPES.SET_INPUT_VALUE: {
      return {
        ...state,
        inputValue: payload
      }
    }
    case TYPES.SET_ANIOS: {
      return {
        ...state,
        anios: payload
      }
    }
    case TYPES.SET_OFERTAS_EDUCATIVAS_CATALOG: {
      return {
        ...state,
        ofertasEducativasCatalog: payload
      }
    }
    case TYPES.SET_ANIO_VALUE: {
      return {
        ...state,
        anioValue: payload
      }
    }
    case TYPES.SET_INSTITUCION_ID: {
      return {
        ...state,
        institucionId: payload
      }
    }
    case TYPES.CLEAR_OFERTA_EDUCATIVA_DATA: {
      return {
        ...state,
        ofertasEducativasCatalog: [],
        anioValue: null,
        institucionId: null
      }
    }
    case TYPES.TOGGLE_LOADING: {
      return { ...state, loading: !state.loading }
    }
    case TYPES.CLEAR_FILTERS: {
      return {
        ...state,
        provinciaValue: null,
        cantonValue: null,
        distritoValue: null,
        pobladoValue: null,
        especialidadValue: null,
        ofertaEducativaValue: null,
        instituciones: null,
        canton: [],
        distrito: [],
        poblado: [],
        especialidad: []
      }
    }
    case TYPES.CLEAR_FILTERS_CANTON: {
      return {
        ...state,
        cantonValue: null,
        distritoValue: null,
        pobladoValue: null,
        especialidadValue: null,
        ofertaEducativaValue: null,
        instituciones: null,
        distrito: [],
        poblado: [],
        especialidad: []
      }
    }
    case TYPES.CLEAR_FILTERS_DISTRITO: {
      return {
        ...state,
        distritoValue: null,
        pobladoValue: null,
        especialidadValue: null,
        ofertaEducativaValue: null,
        instituciones: null,
        poblado: [],
        especialidad: []
      }
    }
    case TYPES.CLEAR_FILTERS_POBLADO: {
      return {
        ...state,

        pobladoValue: null,
        especialidadValue: null,
        ofertaEducativaValue: null,
        instituciones: null,
        especialidad: []
      }
    }
    case TYPES.CLEAR_FILTERS_ESPECIALIDAD: {
      return {
        ...state,
        especialidadValue: null,
        instituciones: null
      }
    }
    case TYPES.CLEAR_FILTERS_OFERTA: {
      return {
        ...state,
        especialidadValue: null,
        ofertaEducativaValue: null,
        instituciones: null,
        especialidad: []
      }
    }
    default:
      return state
  }
}

const useReducerBuscador = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loader, setLoader] = useState(false)
  const actions = useActions({
    getProvincias,
    getDistritosByCanton,
    getCantonesByProvincia,
    getPobladosByDistrito,
    getOfferModalServ,
    getSpecialtiesByModel
  })
  const toggleLoading = () => {
    dispatch({ type: TYPES.TOGGLE_LOADING })
  }
  const loadProvincias = async () => {
    showProgress()

    const response = await actions
      .getProvincias()
      .then((response) => {
        dispatch({ type: TYPES.SET_PROVINCIA, payload: response.data })
        return response.data
      })
      .catch((e) => console.log(e))
    hideProgress()

    return response
  }

  const onChangeSelectProvincia = async (obj) => {
    showProgress()

    await actions.getCantonesByProvincia(obj.value).then((response) => {
      dispatch({
        type: TYPES.SET_CANTON,
        payload: { data: response.data, provinciaValue: obj.value }
      })
    })
    hideProgress()
  }

  const onChangeSelectCanton = async (obj) => {
    showProgress()

    await actions.getDistritosByCanton(obj.value).then((response) =>
      dispatch({
        type: TYPES.SET_DISTRITO,
        payload: { data: response.data, cantonValue: obj.value }
      })
    )
    hideProgress()
  }

  const onChangeSelectDistrito = async (obj) => {
    showProgress()

    await actions.getPobladosByDistrito(obj.value).then((response) =>
      dispatch({
        type: TYPES.SET_POBLADO,
        payload: { data: response.data, distritoValue: obj.value }
      })
    )
    hideProgress()
  }

  const onChangeSelectPoblado = (obj) => {
    dispatch({
      type: TYPES.SET_POBLADO_VALUE,
      payload: obj.value
    })
  }

  const loadOfertaEducativa = () => {
    showProgress()

    getAllOfertas().then((response) => {
      dispatch({
        type: TYPES.SET_OFERTAEDUCATIVA,
        payload: response
      })
    })
    hideProgress()
  }

  const onChangeSelectOfertaEducativa = (obj) => {
    getEspecialidadByOferta(obj.value)
  }

  const onChangeSelectEspecialidad = (obj) => {
    dispatch({
      type: TYPES.SET_ESPECILIADAD_VALUE,
      payload: obj.value
    })
  }

  const onChangeInput = (e) => {
    dispatch({ type: TYPES.SET_INPUT_VALUE, payload: e.target.value })
  }

  const newSearch = () => {
    dispatch({ type: TYPES.NEW_SEARCH })
  }
  const clearFilters = () => {
    dispatch({ type: TYPES.CLEAR_FILTERS })
  }
  const clearFiltersCanton = () => {
    dispatch({ type: TYPES.CLEAR_FILTERS_CANTON })
  }
  const clearFilterDistrito = () => {
    dispatch({ type: TYPES.CLEAR_FILTERS_DISTRITO })
  }
  const clearFilterPoblado = () => {
    dispatch({ type: TYPES.CLEAR_FILTERS_POBLADO })
  }
  const clearFilterEspecialidad = () => {
    dispatch({ type: TYPES.CLEAR_FILTERS_ESPECIALIDAD })
  }
  const clearFilterOferta = () => {
    dispatch({ type: TYPES.CLEAR_FILTERS_OFERTA })
  }

  const clearInfoGeneral = () => {
    dispatch({ type: TYPES.CLEAR_INFO_INSTITUCION_ID })
  }

  const { institucionId } = useSelector((store: any) => {
    const currentInstitution = store.authUser.currentInstitution
    return {
      institucionId: currentInstitution?.id
    }
  })

  const fetch = async (endpoint) => {
    setLoader(true)
    showProgress()
    return await axios
      .get<any>(endpoint)
      .then((response) => {
        hideProgress()

        setLoader(false)
        return response.data
      })
      .catch((e) => {
        hideProgress()

        setLoader(false)
      })
  }

  const getAllOfertas = () => {
    return fetch(
			`${envVariables.BACKEND_URL}/api/Areas/Externos/Institucionalidad/GetAllOfertas`
    )
      .then((data) =>
        dispatch({ type: TYPES.SET_OFERTAEDUCATIVA, payload: data })
      )
      .catch((e) => console.log(e))
  }

  const getEspecialidadByOferta = (ofertaId) => {
    return fetch(
			`${envVariables.BACKEND_URL}/api/Especialidad/GetEspecialidadesByOfertaId/${ofertaId}`
    )
      .then((data) =>
        dispatch({
          type: TYPES.SET_ESPECIALIADAD,
          payload: { data, ofertaEducativaValue: ofertaId }
        })
      )
      .catch((e) => console.log(e))
  }

  const getInstituciones = () => {
    return fetch(
			`${envVariables.BACKEND_URL}/api/Areas/Externos/Institucionalidad/GetAllByFilters?PageNum=1&PageSize=100`
    ).then((data) => {
      dispatch({ type: TYPES.GET_INSTITUCIONES, payload: data })
    })
  }

  const getInstitucionesById = (institucionId) => {
    dispatch({ type: TYPES.SET_INSTITUCION_ID, payload: institucionId })
    toggleLoading()
    return fetch(
			`${envVariables.BACKEND_URL}/api/Areas/Externos/Institucionalidad/GetInstitucionesbyId/${institucionId}`
    )
      .then((data) =>
        dispatch({ type: TYPES.GET_INFO_INSTITUCION_ID, payload: data })
      )
      .finally(() => {
        toggleLoading()
      })
  }

  const getOfertasByInstituciones = (institucionId, anio) => {
    return fetch(
			`${envVariables.BACKEND_URL}/api/Areas/Externos/Institucionalidad/GetOfertasbyInstitucionesIdandAnio/${institucionId}/${anio}`
    ).then((data) =>
      dispatch({ type: TYPES.GET_OFERTAS_BY_INSTITUCION, payload: data })
    )
  }

  const getFiltersInst = () => {
    const isNull = (nombre, valor) => {
      if (valor) {
        return `${nombre}=${valor}&`
      }
      return ''
    }
    dispatch({ type: TYPES.GET_INSTITUCIONES, payload: [] })

    const urlBase = `${envVariables.BACKEND_URL}/api/Areas/Externos/Institucionalidad/GetAllByFilters?`
    let url = urlBase + isNull('Filtro', state.inputValue)
    url += isNull('ProvinciaId', state.provinciaValue)
    url += isNull('CantonId', state.cantonValue)
    url += isNull('DistritoId', state.distritoValue)
    url += isNull('PobalodId', state.pobladoValue)
    url += isNull('OfertaId', state.ofertaEducativaValue)
    url += isNull('EspecialidadId', state.especialidadValue)
    url += 'PageNum=1&PageSize=100'
    toggleLoading()
    return fetch(url)
      .then((data) => {
        dispatch({ type: TYPES.GET_INSTITUCIONES, payload: data || [] })
      })
      .catch((e) => console.log(e))
      .finally(() => {
        toggleLoading()
      })
  }
  const fetchOfertas = (institucionId, anio) => {
    if (!institucionId && !anio) return null

    const url = `${envVariables.BACKEND_URL}/api/Areas/Externos/Institucionalidad/GetOfertasbyInstitucionesIdandAnio/${institucionId}/${anio}`
    fetch(url)
      .then((data) => {
        dispatch({
          type: TYPES.SET_OFERTAS_EDUCATIVAS_CATALOG,
          payload: data
        })
      })
      .catch((e) => console.log(e))
  }
  const fetchAnios = () => {
    const url = `${envVariables.BACKEND_URL}/api/Areas/Externos/Institucionalidad/GetAnios`
    fetch(url)
      .then((data) => {
        dispatch({ type: TYPES.SET_ANIOS, payload: data })
      })
      .catch((e) => console.log(e))
  }
  const onChangeAnioSelect = (obj) => {
    fetchOfertas(state.institucionId, obj.target.value)
    dispatch({ type: TYPES.SET_ANIO_VALUE, payload: obj.value })
  }

  const clearOfertaEducativaData = () => {
    dispatch({ type: TYPES.CLEAR_OFERTA_EDUCATIVA_DATA })
  }

  return {
    getInstituciones,
    institucionId,
    state,
    onChangeSelectProvincia,
    loadProvincias,
    onChangeSelectCanton,
    onChangeSelectDistrito,
    loadOfertaEducativa,
    onChangeSelectOfertaEducativa,
    onChangeSelectPoblado,
    onChangeSelectEspecialidad,
    getInstitucionesById,
    getFiltersInst,
    getOfertasByInstituciones,
    onChangeInput,
    fetchOfertas,
    fetchAnios,
    onChangeAnioSelect,
    getAllOfertas,
    clearOfertaEducativaData,
    clearFilters,
    clearFiltersCanton,
    clearFilterDistrito,
    clearFilterPoblado,
    clearFilterEspecialidad,
    clearFilterOferta,
    clearInfoGeneral,
    newSearch
  }
}

export default useReducerBuscador
