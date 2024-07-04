import {
  MATRICULA_APOYOS_LOADING,
  MATRICULA_APOYOS_LOAD_TIPOS,
  MATRICULA_APOYOS_LOAD_DEPENDENCIAS,
  MATRICULA_APOYOS_LOAD_CATEGORIAS,
  MATRICULA_APOYOS_LOAD_APOYOS,
  MATRICULA_APOYOS_LOADING_ITEMS,
  MATRICULA_APOYOS_LOAD_DISCAPACIDADES,
  MATRICULA_APOYOS_LOAD_RECURSOS,
  MATRICULA_APOYOS_LOAD_CONDICIONES,
  MATRICULA_APOYOS_CLEAR_CURRENT_DISCAPACIDADES,
  MATRICULA_APOYOS_EDIT,
  MATRICULA_APOYOS_DELETE,
  MATRICULA_APOYOS_ADD,
  MATRICULA_APOYOS_DISCAPACIDADES_SAVE,
  MATRICULA_APOYOS_CONDICIONES_SAVE,
  MATRICULA_APOYOS_DISCAPACIDADES_RECURSOS_SAVE,
  MATRICULA_APOYOS_CONDICIONES_RECURSOS_SAVE,
  MATRICULA_APOYOS_DISCAPACIDADES_RECURSOS_DELETE,
  MATRICULA_APOYOS_CONDICIONES_RECURSOS_DELETE,
  MATRICULA_LOAD_APOYOS_RECIBIDOS,
  MATRICULA_CLEAR_CURRENT_APOYOS_RECIBIDOS,
  MATRICULA_APOYOS_RECIBIDOS_SAVE,
  MATRICULA_LOAD_APOYOS_NO_RECIBIDOS,
  MATRICULA_CLEAR_CURRENT_APOYOS_NO_RECIBIDOS,
  MATRICULA_APOYOS_NO_RECIBIDOS_SAVE,
  MATRICULA_APOYOS_RECIBIDOS_ADD,
  
  MATRICULA_APOYOS_RECIBIDOS_EDIT,
  MATRICULA_APOYOS_RECIBIDOS_DELETE,
  MATRICULA_APOYOS_NO_RECIBIDOS_ADD,
 
  MATRICULA_APOYOS_NO_RECIBIDOS_EDIT,
  MATRICULA_APOYOS_NO_RECIBIDOS_DELETE,
  MATRICULA_LOAD_VER_APOYOS_RECIBIDOS,
  MATRICULA_CLEAR_CURRENT_VER_APOYOS_RECIBIDOS,
  MATRICULA_VER_APOYOS_RECIBIDOS_SAVE,
  MATRICULA_LOAD_VER_APOYOS_NO_RECIBIDOS,
  MATRICULA_CLEAR_CURRENT_VER_APOYOS_NO_RECIBIDOS,
  MATRICULA_VER_APOYOS_NO_RECIBIDOS_SAVE,
  MATRICULA_VER_APOYOS_RECIBIDOS_ADD,
  MATRICULA_VER_APOYOS_NO_RECIBIDOS_ADD

  
} from './types'

const INITIAL_STATE = {
  discapacidadesIdentidad: [],
  recursosDiscapacidadesIdentidad: [],
  condicionesIdentidad: [],
  recursosCondicionesIdentidad: [],
  tipos: [],
  dependencias: [],
  categorias: [],
  loading: false,
  errorMessages: [],
  errorFields: [],
  apoyosRecibidosIdentidad: [],
  apoyosNoRecibidosIdentidad: [],
  verApoyosRecibidosIdentidad: [],
  verApoyosNoRecibidosIdentidad: [],
}

export default (state = INITIAL_STATE, action) => {
  let _data
  switch (action.type) {
    case MATRICULA_APOYOS_CONDICIONES_RECURSOS_DELETE:
      _data = state.recursosCondicionesIdentidad
      _data = _data.filter((value, index) => index !== action.payload)
      return {
        ...state,
        recursosCondicionesIdentidad: _data
      }
    case MATRICULA_APOYOS_DISCAPACIDADES_RECURSOS_DELETE:
      _data = state.recursosDiscapacidadesIdentidad
      _data = _data.filter((value, index) => index !== action.payload)
      return {
        ...state,
        recursosDiscapacidadesIdentidad: _data
      }
    case MATRICULA_APOYOS_DISCAPACIDADES_RECURSOS_SAVE:
      return {
        ...state,
        recursosDiscapacidadesIdentidad: [
          ...state.recursosDiscapacidadesIdentidad,
          action.payload
        ]
      }
    case MATRICULA_APOYOS_CONDICIONES_RECURSOS_SAVE:
      return {
        ...state,
        recursosCondicionesIdentidad: [
          ...state.recursosCondicionesIdentidad,
          action.payload
        ]
      }
    case MATRICULA_APOYOS_DISCAPACIDADES_SAVE:
      return {
        ...state,
        discapacidadesIdentidad: action.payload
      }
    case MATRICULA_APOYOS_CONDICIONES_SAVE:
      return {
        ...state,
        condicionesIdentidad: action.payload
      }
    case MATRICULA_APOYOS_LOAD_RECURSOS:
      return {
        ...state,
        [action.payload.name]: action.payload.data
      }
    case MATRICULA_APOYOS_CLEAR_CURRENT_DISCAPACIDADES:
      return {
        ...state,
        discapacidadesIdentidad: []
      }
        case MATRICULA_APOYOS_LOAD_DISCAPACIDADES:
      return {
        ...state,
        discapacidadesIdentidad: action.payload
      }
    case MATRICULA_APOYOS_LOAD_CONDICIONES:
      return {
        ...state,
        condicionesIdentidad: action.payload
      }
    case MATRICULA_APOYOS_LOADING_ITEMS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          loading: true
        }
      }
    case MATRICULA_APOYOS_LOAD_TIPOS:
      return {
        ...state,
        tipos: action.payload
      }
    case MATRICULA_APOYOS_LOAD_CATEGORIAS:
      return {
        ...state,
        categorias: action.payload
      }
    case MATRICULA_APOYOS_LOAD_DEPENDENCIAS:
      return {
        ...state,
        dependencias: action.payload
      }
    case MATRICULA_APOYOS_LOAD_APOYOS:
      return {
        ...state,
        [action.payload.name]: action.payload.data
      }
    case MATRICULA_APOYOS_ADD:
      _data = state[action.name].entityList
      _data.push(action.payload)
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          entityList: _data
        }
      }
    case MATRICULA_APOYOS_EDIT:
      _data = state[action.name].entityList
      _data[action.index] = action.payload
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          entityList: _data
        }
      }
    case MATRICULA_APOYOS_DELETE:
      _data = state[action.name].entityList
      _data = _data.filter((value, index) => index !== action.payload)
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          entityList: _data
        }
      }
    case MATRICULA_APOYOS_LOADING:
      return {
        ...state,
        loading: action.payload
      }
      case MATRICULA_CLEAR_CURRENT_APOYOS_RECIBIDOS:
        return {
          ...state,
          apoyosRecibidosIdentidad: []
        }

      case MATRICULA_LOAD_APOYOS_RECIBIDOS:
          return {
            ...state,
            apoyosRecibidosIdentidad: action.payload
          }
      case MATRICULA_APOYOS_RECIBIDOS_SAVE:
            return {
              ...state,
              apoyosRecibidosIdentidad: action.payload
            }

            case MATRICULA_CLEAR_CURRENT_VER_APOYOS_RECIBIDOS:
              return {
                ...state,
                verApoyosRecibidosIdentidad: []
              }
      
            case MATRICULA_LOAD_VER_APOYOS_RECIBIDOS:
                return {
                  ...state,
                  verApoyosRecibidosIdentidad: action.payload
                }
            case MATRICULA_VER_APOYOS_RECIBIDOS_SAVE:
                  return {
                    ...state,
                    verApoyosRecibidosIdentidad: action.payload
                  }
      case MATRICULA_APOYOS_RECIBIDOS_ADD:
              _data = state[action.name].entityList
              _data.push(action.payload)
              return {
                ...state,
                [action.name]: {
                  ...state[action.name],
                  entityList: _data
                }
              }
              case MATRICULA_VER_APOYOS_RECIBIDOS_ADD:
                _data = state[action.name].entityList
                _data.push(action.payload)
                return {
                  ...state,
                  [action.name]: {
                    ...state[action.name],
                    entityList: _data
                  }
                }
      case MATRICULA_APOYOS_RECIBIDOS_EDIT:
                _data = state[action.name].entityList
                _data[action.index] = action.payload
                return {
                  ...state,
                  [action.name]: {
                    ...state[action.name],
                    entityList: _data
                  }
                }
      case MATRICULA_APOYOS_RECIBIDOS_DELETE:
                _data = state[action.name].entityList
                _data = _data.filter((value, index) => index !== action.payload)
                return {
                  ...state,
                  [action.name]: {
                    ...state[action.name],
                    entityList: _data
                  }
                }     
      case MATRICULA_CLEAR_CURRENT_APOYOS_NO_RECIBIDOS:
              return {
                ...state,
                apoyosNoRecibidosIdentidad: []
              }
      
      case MATRICULA_LOAD_APOYOS_NO_RECIBIDOS:
                return {
                  ...state,
                  apoyosNoRecibidosIdentidad: action.payload
                }
      case MATRICULA_APOYOS_NO_RECIBIDOS_SAVE:
                  return {
                    ...state,
                    apoyosNoRecibidosIdentidad: action.payload
                  }
    
       case MATRICULA_APOYOS_NO_RECIBIDOS_ADD:
                    _data = state[action.name].entityList
                    _data.push(action.payload)
                    return {
                      ...state,
                      [action.name]: {
                        ...state[action.name],
                        entityList: _data
                      }
                    }
                    case MATRICULA_CLEAR_CURRENT_VER_APOYOS_NO_RECIBIDOS:
                      return {
                        ...state,
                        verApoyosNoRecibidosIdentidad: []
                      }
              
              case MATRICULA_LOAD_VER_APOYOS_NO_RECIBIDOS:
                        return {
                          ...state,
                          verApoyosNoRecibidosIdentidad: action.payload
                        }
              case MATRICULA_VER_APOYOS_NO_RECIBIDOS_SAVE:
                          return {
                            ...state,
                            verApoyosNoRecibidosIdentidad: action.payload
                          }
            
               case MATRICULA_VER_APOYOS_NO_RECIBIDOS_ADD:
                            _data = state[action.name].entityList
                            _data.push(action.payload)
                            return {
                              ...state,
                              [action.name]: {
                                ...state[action.name],
                                entityList: _data
                              }
                            }
             
       case MATRICULA_APOYOS_NO_RECIBIDOS_EDIT:
                      _data = state[action.name].entityList
                      _data[action.index] = action.payload
                      return {
                        ...state,
                        [action.name]: {
                          ...state[action.name],
                          entityList: _data
                        }
                      }
       case MATRICULA_APOYOS_NO_RECIBIDOS_DELETE:
                      _data = state[action.name].entityList
                      _data = _data.filter((value, index) => index !== action.payload)
                      return {
                        ...state,
                        [action.name]: {
                          ...state[action.name],
                          entityList: _data
                        }
                      }             
                     
    default:
      return state
  }
}
