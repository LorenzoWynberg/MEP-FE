import * as types from './types'

const INITIAL_STATE = {
  periodosCalendar: [],
  periodoActivo: null,
  periodosAll: [],
  bloquesPeriodoSelected: [],
  errorFields: {},
  errorMessages: {},
  loading: false,
  error: false
}

export default (state = INITIAL_STATE, action) => {
  const _newDataPeriodosCalendario = state.periodosCalendar
  switch (action.type) {
    case types.PERIODO_GET_ALL:
      return {
        ...state,
        periodosAll: action.payload,
        loading: false,
        error: false
      }
    case 'PERIODO_GET_BLOQUES_SELECTED':
      return {
        ...state,
        bloquesPeriodoSelected: action.payload,
        loading: false,
        error: false
      }
    case 'PERIODO_CLEAR_BLOQUES_SELECTED':
      return {
        ...state,
        bloquesPeriodoSelected: [],
        loading: false,
        error: false
      }
    case types.PERIODO_LOAD_BY_CALENDAR:
      return {
        ...state,
        periodosCalendar: action.payload,
        loading: false,
        error: false
      }
    case types.PERIODO_GET:
      return {
        ...state,
        periodoActivo: action.payload,
        loading: false,
        error: false
      }
    case types.PERIODO_SAVE:
      return {
        ...state,
        periodosCalendar: [...state.periodosCalendar, action.payload],
        loading: false,
        error: false
      }
    case types.PERIODO_CLEAR:
      return {
        ...state,
        periodosCalendar: [],
        periodoActivo: null,
        loading: false,
        error: false
      }
    case types.PERIODO_EDIT:
      return {
        ...state,
        periodosCalendar: _newDataPeriodosCalendario.map((item) => {
          let _obj = {}
          if (Number(item.id) === Number(action.payload.id)) {
            _obj = {
              ...action.payload
            }
          } else {
            _obj = {
              ...item
            }
          }
          return {
            ..._obj
          }
        }),
        loading: false,
        error: false
      }
    case types.PERIODO_DISABLED:
      return {
        ...state,
        periodosCalendar: action.payload,
        loading: false,
        error: false
      }
    case types.PERIODO_CHANGE_STATE:
      return {
        ...state,
        periodosCalendar: _newDataPeriodosCalendario.map((item) => {
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
    case types.PERIODO_LOADING:
      return {
        ...state,
        loading: true,
        error: false
      }
    case types.PERIODO_ERROR:
      return {
        ...state,
        loading: false,
        error: false,
        errorFields: action.payload.fields,
        errorMessages: action.payload.errors
      }
    case types.PERIODO_CALENDARIO_DELETE:
      return {
        ...state,
        loading: false,
        // periodoActivo:
        error: false,
        errorFields: action.payload.fields,
        errorMessages: action.payload.errors
      }
    case types.PERIODO_CLEAR_ACTIVE:
      return {
        ...state,
        periodoActivo: null,
        loading: false,
        error: false
      }
    default:
      return state
  }
}
