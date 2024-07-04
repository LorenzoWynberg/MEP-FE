import {
  LOAD_STUDENTS_NIVEL,
  LOAD_STUDENTS_DISABILITIES,
  LOAD_STUDENTS_NATIONALITIES,
  LOAD_STUDENTS_GENDERS,
  LOAD_STUDENTS_INSTITUTIONS,
  LOAD_REGIONALES_FILTROS,
  LOAD_SELECTS_FILTERS
} from './types'

const INITIAL_STATE = {
  loading: false,
  error: false,
  personasEstudiantesNivel: [],
  personasEstudiantesDiscapacidad: [],
  personasEstudiantesNacionalidad: [],
  personasEstudiantesGenero: [],
  personasEstudiantesInstitucion: [],
  regionales: [],
  regionalData: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_STUDENTS_NIVEL:
      return {
        ...state,
        loading: false,
        error: false,
        personasEstudiantesNivel: action.payload
      }
    case LOAD_STUDENTS_DISABILITIES:
      return {
        ...state,
        loading: false,
        error: false,
        personasEstudiantesDiscapacidad: action.payload
      }
    case LOAD_STUDENTS_NATIONALITIES:
      return {
        ...state,
        loading: false,
        error: false,
        personasEstudiantesNacionalidad: action.payload
      }
    case LOAD_STUDENTS_GENDERS:
      return {
        ...state,
        loading: false,
        error: false,
        personasEstudiantesGenero: action.payload
      }
    case LOAD_STUDENTS_INSTITUTIONS :
      return {
        ...state,
        loading: false,
        error: false,
        personasEstudiantesInstitucion: action.payload
      }
    case LOAD_REGIONALES_FILTROS:
      return {
        ...state,
        error: false,
        regionales: action.payload
      }
    case LOAD_SELECTS_FILTERS:
      return {
        ...state,
        regionalData: action.payload
      }
    default: return state
  }
}
