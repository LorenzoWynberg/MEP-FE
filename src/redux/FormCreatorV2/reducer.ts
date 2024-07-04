import {
  FORM_SAVE,
  FORM_LOAD_CATEGORIES,
  FORM_LOAD_FORMS,
  FORM_LOAD,
  FORM_RESPONSE_SAVE,
  FORM_LOAD_DUPLICATED,
  FORM_RESPONSES_PAGINATED,
  FORM_STATISTICS,
  FORM_SAVE_CATEGORIE,
  FORM_DELETE_CATEGORIE,
  FORM_GET_USER_CATEGORIES,
  FORM_EDIT_CATEGORIE,
  FORM_RESPONSES,
  FORM_ADMINS_LOAD,
  FORM_ADMIN_SAVE,
  FORM_ADMIN_SEARCH,
  FORM_GET_EMAIL,
  FORM_GET_URL_BY_FORM,
  FORM_CURRENT_THEME_LOAD,
  FORM_DELETE,
  LOADING_CURRENT_THEME,
  FORM_CREATE_INVITACION,
  FORM_VALIDATE_INVITATION

} from './types'

const INITIAL_STATE = {
  currentForm: {},
  formAdmins: [],
  invitation: [],
  url: [],
  email: [],
  searchUsers: [],
  categorias: [],
  comunicado: [],
  forms: [],
  responses: {},
  onlyResponses: [],
  currentFormTheme: {},
  loadingTheme: false,
  currentResponse: {},
  statistics: {},
  loading: false,
  error: false,
  validateInvitation: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FORM_DELETE:
      return {
        ...state,
        forms: [...state.forms.filter(el => el.id != action.payload)]
      }
    case FORM_ADMINS_LOAD:
      return {
        ...state,
        formAdmins: action.payload
      }
    case LOADING_CURRENT_THEME:
      return {
        ...state,
        loadingTheme: true
      }
    case FORM_CURRENT_THEME_LOAD:
      return {
        ...state,
        currentFormTheme: action.payload,
        loadingTheme: false
      }
    case FORM_ADMIN_SAVE:
      return {
        ...state,
        formAdmins: action.payload
      }
    case FORM_ADMIN_SEARCH:
      return {
        ...state,
        searchUsers: action.payload
      }
    case FORM_LOAD_DUPLICATED:
      return {
        ...state,
        forms: [...state.forms, action.payload]
      }
    case FORM_LOAD:
      return {
        ...state,
        currentForm: action.payload
      }
    case FORM_LOAD_FORMS:
      return {
        ...state,
        forms: action.payload
      }
    case FORM_LOAD_CATEGORIES:
      return {
        ...state,
        categorias: action.payload
      }
    case FORM_SAVE:
      return {
        ...state,
        currentForm: action.payload,
        forms: [...state.forms, action.payload]
      }
    case FORM_RESPONSE_SAVE:
      return {
        ...state,
        currentResponse: action.payload
      }
    case FORM_RESPONSES_PAGINATED:
      return {
        ...state,
        responses: action.payload
      }
    case FORM_STATISTICS:
      return {
        ...state,
        statistics: action.payload
      }
    case FORM_SAVE_CATEGORIE:
      return {
        ...state,
        categorias: [...state.categorias, action.payload]
      }
    case FORM_DELETE_CATEGORIE:
      return {
        ...state,
        categorias: state.categorias.filter(cat => cat.id !== action.payload)
      }
    case FORM_GET_USER_CATEGORIES:
      return {
        ...state,
        categorias: action.payload
      }
    case FORM_EDIT_CATEGORIE:
      return {
        ...state,
        categorias: state.categorias.map(cat => {
          if (cat.id === action.payload.id) {
            return { ...action.payload }
          }
          return cat
        })
      }
    case FORM_RESPONSES:
      return {
        ...state,
        onlyResponses: action.payload
      }
    case FORM_GET_EMAIL:
      return {
        ...state,
        email: action.payload
      }
    case FORM_GET_URL_BY_FORM:
      return {
        ...state,
        url: action.payload
      }
    case FORM_CREATE_INVITACION:
      return {
        ...state,
        invitation: action.payload
      }
    case FORM_VALIDATE_INVITATION:
      return {
        ...state,
        validateInvitation: action.payload
      }
    default:
      return state
  }
}
