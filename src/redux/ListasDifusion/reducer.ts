import {
  LISTAS_LOAD,
  LISTAS_LOADING,
  LISTAS_LOAD_NEW,
  LISTAS_REMOVE,
  LISTAS_LOAD_UPDATED,
  LISTAS_LOAD_ONE,
  LISTAS_LOAD_ENVIO
} from './types'

const INITIAL_STATE = {
  listasDifusion: [],
  currentList: {},
  listasEnvio: [],
  loading: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LISTAS_LOAD_ENVIO:
      return {
        ...state,
        listasEnvio: [...state.listasEnvio, action.payload],
        loading: false
      }
    case LISTAS_LOAD_ONE:
      return {
        ...state,
        currentList: action.payload,
        loading: false
      }
    case LISTAS_LOAD_UPDATED:
      const _listas = []
      state.listasDifusion.forEach(el => {
        if (el.id === action.payload.id) {
          _listas.push(action.payload)
        } else {
          _listas.push(el)
        }
      })
      return {
        ...state,
        listasDifusion: _listas,
        loading: false
      }
    case LISTAS_LOAD_NEW:
      return {
        ...state,
        listasDifusion: [...state.listasDifusion, action.payload],
        loading: false
      }
    case LISTAS_LOAD:
      return {
        ...state,
        listasDifusion: action.payload,
        loading: false
      }
    case LISTAS_REMOVE:
      const _data = state.listasDifusion.filter(el => {
        return el.id !== action.payload
      })

      return {
        ...state,
        listasDifusion: _data,
        loading: false
      }
    case LISTAS_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}
