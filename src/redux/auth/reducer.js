import {
  AUTH_LOADING,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  REGISTER_USER_LOADING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  AUTH_LOGOUT,
  FORGOT_PASSWORD,
  CONFIRM_FORGOT_PASSWORD,
  GET_ROLE,
  ROLE_ERROR,
  CREATE_PASSWORD_ERROR,
  CREATE_PASSWORD,
  SERVER_ERROR,
  LOAD_CURRENTDIRECTOR,
  SEREVER_UNAUTHORIZED,
  AUTH_TOKEN_STORAGE,
  AUTH_LOAD_INSTITUTIONS,
  SET_USER_INSTITUTION,
  SET_PERIODO_LECTIVO_BY_INSTITUTION,
  API_VERSION,
  LOAD_ACCESS_ROLES,
  LOAD_CURRENT_ACCESS_ROLE,
  LOAD_ACTIVE_YEAR,
  LOAD_ACTIVE_YEARS,
  LOAD_ROLES_PERMISOS,
  LOAD_USER_DATA,
  AUTH_CLEAR_FAILURE,
  CLEAR_CURRENT_INSTITUTION
} from '../actions'

const INIT_STATE = {
  authObject: {
    userData: {},
    user: {
      username: '',
      token: '',
      rolId: '',
      rolesOrganizaciones: [],
      instituciones: []
    }
  },
  currentInstitution: {},
  periodosLectivos: [],
  currentRoleOrganizacion: { accessRole: {}, perfiles: [] },
  loading: false,
  loaded: false,
  error: false,
  newPassword: {
    isFirstLogin: false,
    username: '',
    error: '',
    headers: ''
  },
  role: null,
  serverError: false,
  showCensoModal: false,
  serverUnauthorized: false,
  activeYears: [],
  selectedActiveYear: {},
  toFirstLoginProfile: false,
  currentDirector: null,
  apiVersion: '0.0.0',
  rolPermisos: []
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOAD_USER_DATA:
      return {
        ...state,
        authObject: {
          ...state.authObject,
          userData: action.payload
        }
      }
    case 'SHOW_CENSO_MODAL':
      return {
        ...state,
        showCensoModal: action.payload
      }
    case LOAD_ROLES_PERMISOS:
      return {
        ...state,
        rolPermisos: action.payload,
        loaded: true,
        loading: false
      }
    case CLEAR_CURRENT_INSTITUTION:
      return {
        ...state,
        currentInstitution: {}
      }
    case LOAD_CURRENT_ACCESS_ROLE:
      return { ...state, currentRoleOrganizacion: action.payload }
    case LOAD_ACCESS_ROLES:
      return {
        ...state,
        authObject: {
          ...state.authObject,
          user: {
            ...state.authObject.user,
            rolesOrganizaciones: action.payload
          }
        }
      }
    case LOAD_ACTIVE_YEARS:
      return { ...state, activeYears: action.payload }
    case LOAD_ACTIVE_YEAR:
      return { ...state, selectedActiveYear: action.payload }
    case FORGOT_PASSWORD:
      return { ...state, loading: false, ...action.payload }
    case CONFIRM_FORGOT_PASSWORD:
      return { ...state, loading: false, ...action.payload }
    case AUTH_LOADING:
      return {
        ...state,
        loading: action.payload,
        loaded: !action.payload
      }
    case AUTH_SUCCESS:
      return {
        ...state,
        authObject: { ...state.authObject, ...action.payload },
        newPassword: false
      }
    case AUTH_CLEAR_FAILURE:
      return {
        ...state,
        loading: false,
        error: false,
        serverError: false
      }
    case AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case REGISTER_USER_LOADING:
      return { ...state, loading: true }
    case REGISTER_USER_SUCCESS:
      return { ...state, loading: false, authObject: action.payload.uid }
    case AUTH_TOKEN_STORAGE:
      let token = action.payload.token
      const rolId = action.payload.rolId
      const expiration = action.payload.expiration
      if (action.payload.token === '') {
        token = state.authObject.user && state.authObject.user.token
      } else {
        token = action.payload.token
      }
      return {
        ...state,
        loading: false,
        authObject: {
          ...state.authObject,
          user: {
            ...state.authObject.user,
            token,
            rolId,
            expiration,
            userName: action.payload.userName,
            nombre: action.payload.nombre,
            primerApellido: action.payload.primerApellido,
            segundoApellido: action.payload.segundoApellido
          }
        }
      }
    case REGISTER_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case CREATE_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        newPassword: {
          isFirstLogin: true,
          username: state.newPassword.username,
          error: action.payload,
          headers: state.newPassword.headers
        },
        error: false,
        toFirstLoginProfile: true
      }

    case CREATE_PASSWORD:
      return {
        ...state,
        loading: false,
        newPassword: {
          isFirstLogin: true,
          username: action.payload.username,
          error: '',
          headers: action.payload.headers
        },
        error: false,
        toFirstLoginProfile: true
      }
    case GET_ROLE:
      return {
        ...state,
        role: action.payload,
        loading: false
      }
    case ROLE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        loaded: true
      }
    case AUTH_LOGOUT:
      return INIT_STATE
    case AUTH_LOAD_INSTITUTIONS:
      return {
        ...state,
        authObject: {
          ...state.authObject,
          user: {
            ...state.authObject.user,
            instituciones: action.payload
          }
        }
      }
    case SERVER_ERROR:
      return { ...state, serverError: true }
    case SEREVER_UNAUTHORIZED:
      return { ...state, serverUnauthorized: true }
    case SET_USER_INSTITUTION:
      return { ...state, currentInstitution: action.payload }
    case SET_PERIODO_LECTIVO_BY_INSTITUTION:
      return { ...state, periodosLectivos: action.payload || [] }
    case LOAD_CURRENTDIRECTOR:
      return {
        ...state,
        currentDirector: {
          ...action.payload
        },
        loading: false
      }
    case API_VERSION:
      return {
        ...state,
        apiVersion: action.payload
      }
    default:
      return { ...state }
  }
}
