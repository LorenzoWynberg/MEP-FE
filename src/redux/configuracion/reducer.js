import {
  CONFIGURATION_LOAD_INSTITUTIONS,
  CONFIGURATION_ERROR,
  CONFIGURATION_LOAD_REGIONALES,
  CONFIGURATION_LOAD_ALL_REGIONALES,
  CONFIGURATION_LOAD_REGIONAL,
  CONFIGURATION_LOAD_CIRCUITOS,
  CONFIGURATION_LOAD_CIRCUITO,
  CONFIGURATION_LOAD_DIRECTORES,
  CONFIGURATION_LOAD_USERS,
  CONFIGURATION_LOAD_SEDES,
  CONFIGURATION_LOAD_PARENT_INTSTITUTIONS,
  CONFIGURATION_LOAD_CURRENT_CENTER,
  CONfIGURATION_ERROR_DATA,
  CONFIGURATION_LOAD_DIRECTOR,
  CONFIGURATION_CLEAN_INSTITUTIONS,
  LOAD_CURRENT_INSTITUTION_DIRECTOR,
  LOAD_LOCATION,
  CONFIGURATION_LOAD_ALL_CIRCUITOS,
  SET_EXPEDIENTE_REGIONAL,
  SET_EXPEDIENTE_SUPERVISION
} from './types'

const INITIAL_STATE = {
  instituciones: {
    entityList: []
  },
  currentInstitution: {},
  centrosPadre: [],
  allRegionales: [],
  allCircuitos: [],
  regionales: {
    entityList: []
  },
  currentRegional: {},
  currentCircuito: {},
  expedienteRegional: null,
  expedienteSupervision: null,
  circuitos: {
    entityList: []
  },
  directores: {
    entityList: []
  },
  usuarios: {
    entityList: []
  },
  location: {},
  currentDirector: {},
  sedes: [],
  loading: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_LOCATION:
      if (action.payload.solucion) {
        return {
          ...state,
          location: {
            ...JSON.parse(action.payload.solucion),
            id: action.payload.id
          }
        }
      }
      return {
        ...state,
        location: action.payload
      }
    case SET_EXPEDIENTE_REGIONAL:
      return {
        ...state,
        expedienteRegional: action.payload
      }
    case SET_EXPEDIENTE_SUPERVISION:
      return {
        ...state,
        expedienteSupervision: action.payload
      }
    case LOAD_CURRENT_INSTITUTION_DIRECTOR:
      return {
        ...state,
        currentDirector: action.payload
      }
    case CONFIGURATION_CLEAN_INSTITUTIONS:
      return {
        ...state,
        instituciones: {
          entityList: []
        }
      }
    case CONFIGURATION_LOAD_CURRENT_CENTER:
      return {
        ...state,
        currentInstitution: action.payload
      }
    case CONFIGURATION_LOAD_PARENT_INTSTITUTIONS:
      return {
        ...state,
        centrosPadre: action.payload
      }
    case CONFIGURATION_LOAD_INSTITUTIONS:
      return {
        ...state,
        instituciones: action.payload,
        loading: false
      }
    case CONFIGURATION_LOAD_REGIONALES:
      return {
        ...state,
        regionales: action.payload
      }
    case CONFIGURATION_LOAD_ALL_REGIONALES:
      return {
        ...state,
        allRegionales: action.payload
      }
    case CONFIGURATION_LOAD_ALL_CIRCUITOS:
      return {
        ...state,
        allCircuitos: action.payload
      }
    case CONFIGURATION_LOAD_REGIONAL:
      return {
        ...state,
        currentRegional: action.payload
      }
    case CONFIGURATION_LOAD_CIRCUITOS:
      return {
        ...state,
        circuitos: action.payload
      }
    case CONFIGURATION_LOAD_CIRCUITO:
      return {
        ...state,
        currentCircuito: action.payload
      }
    case CONFIGURATION_LOAD_DIRECTORES:
      return {
        ...state,
        directores: action.payload
      }
    case CONFIGURATION_LOAD_DIRECTOR:
      return {
        ...state,
        currentDirector: action.payload
      }
    case CONFIGURATION_LOAD_SEDES:
      return {
        ...state,
        sedes: action.payload
      }
    case CONFIGURATION_LOAD_USERS:
      return {
        ...state,
        usuarios: action.payload
      }
    case CONFIGURATION_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case CONfIGURATION_ERROR_DATA:
      return {
        ...state,
        loading: false,
        error: action.payload.error || '',
        errors: action.payload.errors || [],
        fields: action.payload.fields || []
      }
    default:
      return state
  }
}
