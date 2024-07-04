import { CATALOGOS_LOAD, CATALOGOS_CREATE, CATALOGOS_ERROR, CATALOGOS_LOADING, CATALOGOS_PROFILES_LOAD, CATALOGOS_SECTIONS_LOAD, CATALOGOS_SET_ACTIVE, CATALOGOS_CHANGE_STATE } from './catalogosTypes'

const INITIAL_STATE = {
  catalogos: [],
  loadingCatalogos: false,
  catalogoActivo: {},
  perfiles: [],
  secciones: [],
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  const _newDataCatalogos = state.catalogos

  switch (action.type) {
    case CATALOGOS_LOAD:
      return {
        ...state,
        catalogos: action.payload,
        loadingCatalogos: false,
        error: ''
      }

    case CATALOGOS_CREATE:
      return {
        ...state,
        catalogos: [...state.catalogos, { ...action.payload, id: action.payload.catalogoId }],
        loadingCatalogos: false,
        error: ''
      }

    case CATALOGOS_SECTIONS_LOAD:
      return { ...state, loadingCatalogos: false, error: '', secciones: action.payload }

    case CATALOGOS_LOADING:
      return { ...state, loadingCatalogos: true, error: '' }

    case CATALOGOS_PROFILES_LOAD:
      return { ...state, perfiles: action.payload, error: '', loadingCatalogos: false }

    case CATALOGOS_ERROR:
      return { ...state, error: action.payload, loadingCatalogos: false }

    case CATALOGOS_SET_ACTIVE:
      return {
        ...state,
        catalogoActivo: action.payload,
        loading: false,
        error: false
      }
    case CATALOGOS_CHANGE_STATE:
      return {
        ...state,
        catalogos: _newDataCatalogos.map((item) => {
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
