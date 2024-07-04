import {
  INVITACIONES_LOAD,
  INVITACIONES_GET_ONE,
  INVITACIONES_CLEAN,
  INVITACIONES_CLEAN_ONE,
  INVITACIONES_LOADING,
  INVITACIONES_ERROR
} from './types.ts'

const INITIAL_STATE = {
  data: {
    totalPaginas: 0,
    tamanoPagina: 10,
    elementos: [],
    totalElementos: 0
  },
  loading: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INVITACIONES_LOAD:
      return {
        data: {
          tamanoPagina: action.payload.pageSize,
          elementos: action.payload.entityList,
          totalElementos: action.payload.totalCount,
          totalPaginas: action.payload.totalPages
        },
        error: false,
        loading: false,
        errors: [],
        fields: []
      }
    case INVITACIONES_GET_ONE:
      break
    case INVITACIONES_CLEAN:
      return INITIAL_STATE
    case INVITACIONES_CLEAN_ONE:
      break
    case INVITACIONES_LOADING:
      return {
        ...state,
        loading: true,
        error: false
      }
    case INVITACIONES_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
        errors: action.payload.errors || [],
        fields: action.payload.fields || []
      }
    default:
      return state
  }
}
