import {
  LOAD_MODALITIES,
  CREATE_MODALITIES,
  DELETE_MODALITIES,
  EDIT_MODALITY,
  LOAD_MODALITIES_CATEGORIES
} from './types.ts'

const INITIAL_STATE = {
  modalidades: [],
  categorias: [],
  loading: false,
  loaded: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_MODALITIES_CATEGORIES:
      return {
        ...state,
        categorias: action.payload
      }
    case CREATE_MODALITIES:
      return {
        ...state,
        modalidades: [...state.modalidades, action.payload],
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case EDIT_MODALITY:
      return {
        ...state,
        modalidades: state.modalidades.map(mdlt => {
          if (mdlt.id === action.payload.id) {
            return { ...action.payload }
          }
          return mdlt
        }),
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case DELETE_MODALITIES:
      return {
        ...state,
        modalidades: state.modalidades.map(mdlt => {
          if (action.payload.includes(mdlt.id)) {
            return { ...mdlt, estado: false }
          }
          return mdlt
        }),
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case LOAD_MODALITIES:
      return {
        ...state,
        modalidades: action.payload,
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    default: return state
  }
}
