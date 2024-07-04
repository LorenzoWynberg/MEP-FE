
interface IState {
  scores: Array<any>
  loading: boolean
  bitacoraAyudaSelected: any
  bitacoraAyudaPaginated: any
  bitacoraAyuda: any[]
  error: ''
  bitacoraResidencia: []
}

const INITIAL_STATE: IState = {
  scores: [],
  loading: false,
  bitacoraAyuda: [],
  bitacoraAyudaPaginated: {},
  bitacoraAyudaSelected: {},
  bitacoraResidencia: [],
  error: ''
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case 'LOADING_BITACORA':
      return {
        ...state,
        loading: true
      }
    case 'GET_PAGINATED_BITACORA_AYUDA':
      return {
        ...state,
        loading: false,
        bitacoraAyudaPaginated: payload,
        error: ''
      }
    case 'GET_All_BITACORA_AYUDA':
      return {
        ...state,
        loading: false,
        bitacoraAyuda: payload,
        error: ''
      }
    case 'SAVE_BITACORA_AYUDA':
      return {
        ...state,
        loading: false,
        bitacoraAyudaSelected: payload,
        error: ''
      }
    case 'CLEAR_BITACORA_AYUDA':
      return {
        ...state,
        loading: false,
        bitacoraAyudaSelected: [],
        bitacoraAyuda: [],
        bitacoraAyudaPaginated: {},
        error: ''
      }
    case 'GET_BITACORA_RESIDENCIA_ESTUDIANTIL_BY_IDENTIDAD_ID':
      return {
        ...state,
        bitacoraResidencia: payload
      }
    default:
      return state
  }
}
