import {
  CURSOS_LECTIVOS_LOAD,
  CURSOS_LECTIVOS_LOAD_CALENDARS,
  CURSOS_LECTIVOS_SET_ACTIVE,
  CURSOS_LECTIVOS_SET_CALENDAR_ACTIVE,
  CURSOS_LECTIVOS_CLEAR_CALENDARS,
  CURSOS_LECTIVOS_CHANGE_STATE,
  CURSOS_LECTIVOS_CALENDARIOS_CHANGE_STATE
} from './types'

const INITIAL_STATE = {
  cursosLectivos: [],
  cursoLectivoActivo: {},
  calendarios: {},
  calendarioActivo: {},
  errorFields: {},
  errorMessages: {},
  loading: false,
  error: false
}

export default (state = INITIAL_STATE, action) => {
  const _newDataCursosElectivos = state.cursosLectivos

  switch (action.type) {
    case CURSOS_LECTIVOS_LOAD:
      return {
        ...state,
        cursosLectivos: action.payload,
        loading: false,
        error: false
      }
    case CURSOS_LECTIVOS_SET_ACTIVE:
      return {
        ...state,
        cursoLectivoActivo: action.payload,
        loading: false,
        error: false
      }
    case CURSOS_LECTIVOS_SET_CALENDAR_ACTIVE:
      return {
        ...state,
        calendarioActivo: action.payload,
        loading: false,
        error: false
      }
    case CURSOS_LECTIVOS_LOAD_CALENDARS:
      return {
        ...state,
        calendarios: {
          ...state.calendarios,
          [action.payload.cL]: action.payload.calendars
        },
        loading: false,
        error: false
      }
    case CURSOS_LECTIVOS_CHANGE_STATE:
      return {
        ...state,
        cursosLectivos: _newDataCursosElectivos.map((item) => {
          const _obj = {
            ...item,
            estado:
              Number(item.id) === Number(action.payload.id)
                ? Boolean(action.payload.state)
                : item.estado
          }

          return {
            ..._obj
          }
        }),
        loading: false,
        error: false
      }
    case CURSOS_LECTIVOS_CALENDARIOS_CHANGE_STATE:
      const _newDataCalendarios = state.calendarios[action.payload.cursoLectivoId]

      return {
        ...state,
        calendarios: {
          ...state.calendarios,
          [action.payload.cursoLectivoId]: _newDataCalendarios.map((item) => {
            const _obj = {
              ...item,
              estado:
                Number(item.id) === Number(action.payload.id)
                  ? Boolean(action.payload.state)
                  : item.estado
            }

            return {
              ..._obj
            }
          })
        },

        loading: false,
        error: false
      }
    case CURSOS_LECTIVOS_CLEAR_CALENDARS:
      return {
        ...state,
        calendarios: {},
        loading: false,
        error: false
      }
    default:
      return state
  }
}
