import { LOAD_FUNCIONARIO, LOAD_ASIGNATURAS_BY_PROFESORINSTITUCION, FUNCIONARIO_DETAIL, LOAD_FUNCIONARIOS_BY_ID, LOAD_CATALOGOS, LOAD_ROL_INFO, LOAD_ROLES_SECCIONES_DATA } from './types'

const INITIAL_STATE = {
  funcionarios: [],
  lecciones: [],
  funcionariosIdentificacion: {},
  rolesSecciones: [],
  funcionariosById: [],
  catalogos: [],
  rolInfo: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_FUNCIONARIO: {
      return {
        ...state,
        funcionarios: action.payload
      }
    }
    case LOAD_ASIGNATURAS_BY_PROFESORINSTITUCION:
      return {
        ...state,
        lecciones: action.payload
      }
    case FUNCIONARIO_DETAIL: {
      return {
        ...state,
        funcionariosIdentificacion: action.payload
      }
    }
    case LOAD_FUNCIONARIOS_BY_ID: {
      return {
        ...state,
        funcionariosById: action.payload
      }
    }
    case LOAD_CATALOGOS: {
      return {
        ...state,
        catalogos: action.payload
      }
    }
    case LOAD_ROL_INFO:{
      return { ...state, rolInfo: action.payload }
    }
    case LOAD_ROLES_SECCIONES_DATA:{
      return { ...state, rolesSecciones: action.payload }
    }
    default:
      return state
  }
}
