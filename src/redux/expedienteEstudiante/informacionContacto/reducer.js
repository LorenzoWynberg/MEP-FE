import {
  LOAD_STUDENT_INFORMATION_CONTACT_BY_USER,
  LOAD_STUDENT_INFORMATION_CONTACT_BY_USER_LOADING,
  LOAD_STUDENT_INFORMATION_CONTACT_BY_USER_ERROR,
  STUDENT_INFORMATION_CONTACT_BY_USER_CLEAN,
  UPDATE_STUDENT_INFORMATION_CONTACT_BY_USER,
  CLEAN_STUDENT_INFORMATION_CONTACT_BY_USER,
  EXPEDIENTE_CONTACTO_ERROR
} from './types'

const INITIAL_STATE = {
  contactInformation: {},
  loading: false,
  redirect: false,
  errorMessages: {},
  errorFields: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_STUDENT_INFORMATION_CONTACT_BY_USER:
      return {
        ...state,
        contactInformation: action.payload,
        errorFields: {},
        errorMessages: {},
        loading: false
      }
    case LOAD_STUDENT_INFORMATION_CONTACT_BY_USER_LOADING:
      return {
        ...state,
        loading: true,
        errorFields: {},
        errorMessages: {}
      }
    case LOAD_STUDENT_INFORMATION_CONTACT_BY_USER_ERROR:
      return {
        ...state,
        errorFields: action.payload.fields,
        errorMessages: action.payload.errors,
        loading: false
      }
    case STUDENT_INFORMATION_CONTACT_BY_USER_CLEAN:
      return INITIAL_STATE
    case UPDATE_STUDENT_INFORMATION_CONTACT_BY_USER:
      return {
        ...state,
        contactInformation: action.payload,
        loading: false,
        errorFields: {},
        errorMessages: {}
      }
    case CLEAN_STUDENT_INFORMATION_CONTACT_BY_USER:
      return {
        ...state,
        errorFields: {},
        errorMessages: {}
      }
    case EXPEDIENTE_CONTACTO_ERROR:
      return {
        ...state,
        loading: false,
        errorFields: action.payload.fields,
        errorMessages: action.payload.errors
      }
    default:
      return state
  }
}
