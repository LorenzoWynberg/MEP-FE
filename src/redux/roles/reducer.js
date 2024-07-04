import {
  ROLES_TIPO_LOAD,
  ROLES_LOAD,
  ROLES_CREATE,
  ROLES_ERROR,
  ROLES_LOADING,
  ROLES_PROFILES_LOAD,
  ROLES_SECTIONS_LOAD,
  ROLES_MODULOS_LOAD,
  ROLES_APARTADOS_LOAD,
  ROLES_DELETE,
  ROLES_GET_LOAD,
  ROLES_CLEAR,
  ROLES_UPDATE,
  ROLES_CREATE_PERFIL
} from './rolesTypes'

const INITIAL_STATE = {
  roles: [],
  tipoRoles: [],
  loadingRoles: false,
  rol: {},
  perfil: {},
  perfiles: [],
  modulos: [],
  apartados: [],
  secciones: [],
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ROLES_GET_LOAD:
      return {
        ...state,
        rol: action.payload,
        loadingRoles: false,
        error: ''
      }
    case ROLES_LOAD:
      return {
        ...state,
        roles: action.payload,
        loadingRoles: false,
        error: ''
      }
    case ROLES_TIPO_LOAD:
      return {
        ...state,
        tipoRoles: action.payload,
        loadingRoles: false,
        error: ''
      }

    case ROLES_CREATE:
      return {
        ...state,
        roles: [
          ...state.roles,
          { ...action.payload, id: action.payload.rolId }
        ],
        loadingRoles: false,
        error: ''
      }
    case ROLES_CREATE_PERFIL:
      return {
        ...state,
        perfil: action.payload,
        loadingRoles: false,
        error: ''
      }
    case ROLES_UPDATE:
      const _roles = state.roles.map((rol) => {
        if (rol.id === action.payload.id) {
          return { ...action.payload }
        }
        return { ...rol }
      })

      return {
        ...state,
        roles: _roles,
        loadingRoles: false,
        error: ''
      }
    case ROLES_DELETE:
      return {
        ...state,
        roles: state.roles.filter((role) => role.id !== action.payload),
        loadingRoles: false,
        error: ''
      }

    case ROLES_SECTIONS_LOAD:
      return {
        ...state,
        loadingRoles: false,
        error: '',
        secciones: action.payload
      }
    case ROLES_MODULOS_LOAD:
      return {
        ...state,
        loadingRoles: false,
        error: '',
        modulos: action.payload
      }
    case ROLES_APARTADOS_LOAD:
      return {
        ...state,
        loadingRoles: false,
        error: '',
        apartados: action.payload
      }

    case ROLES_LOADING:
      return { ...state, loadingRoles: true, error: '' }

    case ROLES_PROFILES_LOAD:
      return {
        ...state,
        perfiles: action.payload,
        error: '',
        loadingRoles: false
      }

    case ROLES_ERROR:
      return { ...state, error: action.payload, loadingRoles: false }
    case ROLES_CLEAR:
      return {
        ...state,
        rol: {},
        perfiles: [],
        modulos: [],
        apartados: [],
        secciones: [],
        loadingRoles: false
      }

    default:
      return state
  }
}
