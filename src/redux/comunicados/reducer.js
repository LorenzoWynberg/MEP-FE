import {
  COMUNICADOS_LOAD,
  COMUNICADOS_ERROR,
  COMUNICADOS_PLANTILLAS_lOAD,
  COMUNICADOS_BANDEJACORREO_LOAD,
  COMUNICADOS_ESTADOS_LOAD,
  COMUNICADOS_ETIQUETAS_LOAD,
  COMUNICADOS_LOADING,
  FORM_CREATE_COMUNICADO,
  COMUNICADOS_LOAD_SENT,
  DISFUNSION_COMUNICADOS_CREATE,
  GET_DISFUNSION_COMUNICADOS,
  COMUNICADOS_LOAD_ENTITY_LIST,
  COMUNICADOS_REMOVE_ENTITY_LIST,
  COMUNICADOS_LOAD_DIFFUSSION_ROLES,
  COMUNICADOS_LOAD_RECEIVERS,
  COMUNICADOS_FAVORITOS,
  COMUNICADOS_ETIQUETASPERSONALIZADAS_LOAD,
  COMUNICADOS_DATAETIQUETASPERSONALIZADAS_LOAD,
  COMUNICADOS_NUEVOS_TOTAL,
  COMUNICADOS_BANDEJACORREO_REALTIME_LOAD
} from './types'

const INITIAL_STATE = {
  recibidos: { entityList: [] },
  borradores: { entityList: [] },
  papelera: { entityList: [] },
  favoritos: { entityList: [] },
  programados: { entityList: [] },
  dataEtiquetasPersonalizadas: { entityList: [] },
  enviados: { entityList: [] },
  etiquetasPersonalizadas: [],
  difusion: [],
  comunicados: [],
  templates: [],
  etiquetas: [], // Circular, Oficios, Resoluciones...
  estados: [], // Borrador, Programados, Enviados, Papelera...
  loading: false,
  error: '',
  userRoleTypes: [],
  searchUsers: [],
  comunicado: [],
  totalRecibidos: 0
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COMUNICADOS_NUEVOS_TOTAL: { // Nuevos no leidos estado codigo 1
      return {
        ...state,
        totalRecibidos: action.payload
      }
    }
    case COMUNICADOS_LOAD_RECEIVERS:
      return {
        ...state,
        searchUsers: action.payload
      }
    case COMUNICADOS_ETIQUETASPERSONALIZADAS_LOAD:
      return {
        ...state,
        etiquetasPersonalizadas: action.payload,
        loading: false,
        error: ''
      }
    case COMUNICADOS_DATAETIQUETASPERSONALIZADAS_LOAD:
      return {
        ...state,
        dataEtiquetasPersonalizadas: action.payload.isCero
          ? action.payload.data
          : {
              ...action.payload.data,
              entityList: [
                ...state.dataEtiquetasPersonalizadas.entityList,
                ...action.payload.data.entityList
              ]
            },
        loading: false,
        error: ''
      }
    case COMUNICADOS_LOAD_DIFFUSSION_ROLES:
      return {
        ...state,
        userRoleTypes: action.payload
      }
    case COMUNICADOS_LOAD_SENT:

      return {
        ...state,
        enviados: action.payload.isCero
          ? action.payload.data
          : [...state.enviados, ...action.payload.data],
        loading: false,
        error: ''
      }
    case COMUNICADOS_LOAD_ENTITY_LIST:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          entityList: action.payload.data
        }
      }
    case COMUNICADOS_ERROR:
      return {
        ...state,
        bandeCorreo: action.payload,
        loading: false,
        error: ''
      }
    case COMUNICADOS_REMOVE_ENTITY_LIST:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          entityList: state[action.payload.type].entityList.filter(
            (el) => el.bandejacorreoId !== action.payload.id
          )
        },
        loading: false,
        error: ''
      }
    case COMUNICADOS_LOAD_SENT:
      return {
        ...state,
        enviados: action.payload.isCero
          ? action.payload.data
          : [...state.enviados, ...action.payload.data],
        loading: false,
        error: ''
      }
    case COMUNICADOS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case COMUNICADOS_ESTADOS_LOAD:
      return {
        ...state,
        estados: action.payload,
        loading: false,
        error: ''
      }
    case COMUNICADOS_ETIQUETAS_LOAD:
      return {
        ...state,
        etiquetas: action.payload,
        loading: false,
        error: ''
      }
    case COMUNICADOS_LOAD:
      return {
        ...state,
        comunicados: action.payload,
        loading: false,
        error: ''
      }
    case COMUNICADOS_FAVORITOS:
      var newList = [...state.recibidos.entityList].map((item) => {
        if (item.bandejaCorreoId == action.payload.id) {
          item.esFavorito = action.payload.state
        }
        return item
      })
      state.recibidos.entityList = newList
      return {
        ...state,
        loading: false,
        error: ''
      }

    case COMUNICADOS_BANDEJACORREO_LOAD:
      const _data = action.payload.isCero
        ? action.payload.data
        : {
            ...action.payload.data,
            entityList: [
              ...state[action.payload.tipo].entityList,
              ...action.payload.data.entityList
            ]
          }
      if (action.payload.data.entityList.lenght < 10) {
      }
      return {
        ...state,
        [action.payload.tipo]: action.payload.isCero
          ? action.payload.data
          : {
              ...action.payload.data,
              entityList: [
                ...state[action.payload.tipo].entityList,
                ...action.payload.data.entityList
              ]
            },

        loading: false,
        error: ''
      }
    case COMUNICADOS_PLANTILLAS_lOAD:
      return {
        ...state,
        templates: action.payload,
        loading: false,
        error: ''
      }
    case COMUNICADOS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case COMUNICADOS_LOADING:
      return {
        ...state,
        loading: true
      }
    case FORM_CREATE_COMUNICADO:
      return {
        ...state,
        comunicado: [...state.comunicado, action.payload],
        loading: false
      }
    case DISFUNSION_COMUNICADOS_CREATE:
      return {
        ...state,
        difusion: [...state.difusion, action.payload],
        loading: false
      }
    case GET_DISFUNSION_COMUNICADOS:
      return {
        ...state,
        difusion: action.payload
      }
    case COMUNICADOS_BANDEJACORREO_REALTIME_LOAD: {
      return {
        ...state,
        recibidos: {
          ...state.recibidos,
          entityList: [action.payload, ...state.recibidos.entityList]
        }
      }
    }
    default:
      return state
  }
}
