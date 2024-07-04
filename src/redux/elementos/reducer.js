import { ELEMENTOS_LOAD, ELEMENTOS_CREATE, ELEMENTOS_ERROR, ELEMENTOS_LOADING, ELEMENTOS_PROFILES_LOAD, ELEMENTOS_SECTIONS_LOAD, ELEMENTOS_SET_ACTIVE, ELEMENTOS_CHANGE_STATE } from './elementosTypes'

const INITIAL_STATE = {
  elementos: [],
  loadingElementos: false,
  perfiles: [],
  secciones: [],
  error: '',
  elementoActivo: {}
}

export default (state = INITIAL_STATE, action) => {
  const _newDataElementos = state.elementos

  switch (action.type) {
    case ELEMENTOS_LOAD:
      return {
        ...state,
        elementos: action.payload,
        loadingElementos: false,
        error: ''
      }

    case ELEMENTOS_CREATE:
      return {
        ...state,
        elementos: [...state.elementos, { ...action.payload, id: action.payload.elementoId }],
        loadingElementos: false,
        error: ''
      }

    case ELEMENTOS_SECTIONS_LOAD:
      return { ...state, loadingElementos: false, error: '', secciones: action.payload }

    case ELEMENTOS_LOADING:
      return { ...state, loadingElementos: true, error: '' }

    case ELEMENTOS_PROFILES_LOAD:
      return { ...state, perfiles: action.payload, error: '', loadingElementos: false }

    case ELEMENTOS_ERROR:
      return { ...state, error: action.payload, loadingElementos: false }
    case ELEMENTOS_SET_ACTIVE:
      return {
        ...state,
        elementoActivo: action.payload,
        loading: false,
        error: false
      }
    case ELEMENTOS_CHANGE_STATE:
      return {
        ...state,
        elementos: _newDataElementos.map((item) => {
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
    default: return state
  }
}
