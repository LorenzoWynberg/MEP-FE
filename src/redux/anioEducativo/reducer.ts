import {
  LOAD_EDUCATIONAL_YEARS,
  YEAR_ERROR,
  CHANGE_VIEW,
  LOAD_LEVEL_OFFERS_CONFIG,
  LOAD_OFFER_MODAL_SERV,
  SET_SELECTED_ANIO_EDUCATIVO,
  SET_SELECTED_NIVEL_OFERTA,
  DELETE_OFFER_MODAL
} from './types'

const INITIAL_STATE = {
  aniosEducativos: [],
  calendarios: [],
  cursosLectivos: [],
  nivelesOferta: [],
  nivelesOfertaSeleccionado: {},
  offerModalServ: [],
  anioEducativoSeleccionado: null,
  loading: false,
  loaded: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  let _nivelesOferta = state.nivelesOferta
  switch (action.type) {
    case LOAD_OFFER_MODAL_SERV:
      return {
        ...state,
        offerModalServ: action.payload
      }
    case 'YEAR_CLONED':
      return {
        ...state,
        aniosEducativos: [...state.aniosEducativos, action.payload]
      }
    case 'CREATE_NIVEL_OFERTA':
      return {
        ...state,
        nivelesOferta: [...state.nivelesOferta, action.payload]
      }
    case DELETE_OFFER_MODAL:
      _nivelesOferta = state.nivelesOferta.filter(
        (x) =>
          Number(x.sb_gr_ofertaModalServId) !== Number(action.payload)
      )
      return {
        ...state,
        nivelesOferta: _nivelesOferta
      }
    case 'CREATE_MULTIPLE_NIVEL_OFERTA':
      return {
        ...state,
        nivelesOferta: [...state.nivelesOferta, ...action.payload]
      }
    case LOAD_LEVEL_OFFERS_CONFIG:
      return {
        ...state,
        nivelesOferta: action.payload
      }
    case 'CLEAR_NIVELES_OFERTAS':
      return {
        ...state,
        nivelesOferta: []
      }
    case SET_SELECTED_ANIO_EDUCATIVO:
      return {
        ...state,
        loading: false,
        anioEducativoSeleccionado: action.payload
      }
    case SET_SELECTED_NIVEL_OFERTA:
      return {
        ...state,
        loading: false,
        nivelesOfertaSeleccionado: action.payload
      }
    case LOAD_EDUCATIONAL_YEARS:
      return {
        ...state,
        loading: false,
        aniosEducativos: action.payload
      }
    case CHANGE_VIEW:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case YEAR_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errors: action.payload.errors || [],
        fields: action.payload.fields || []
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: [],
        fields: []
      }
    default:
      return state
  }
}
