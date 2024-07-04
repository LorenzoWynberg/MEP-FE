import moment from 'moment'

import {
  MATRICULA_LOAD_STUDENT,
  MATRICULA_UPDATE_INFORMACION_REGISTRAL,
  MATRICULA_STUDENT_ERROR,
  MATRICULA_STUDENT_LOADING,
  MATRICULA_CLEAR_STUDENT,
  MATRICULA_LOAD_MEMBERS,
  MATRICULA_LOAD_MEMBER,
  MATRICULA_ADD_MEMBER,
  MATRICULA_CLEAR_MEMBER,
  MATRICULA_REMOVE_MEMBER,
  MATRICULA_UPDATE_MEMBER,
  MATRICULA_UPDATE_IDENTIDAD,
  MATRICULA_FILTER,
  MATRICULA_CLEAN_FILTER,
  MATRICULA_SET_WIZARD_STEPS,
  MATRICULA_SET_WIZARD_ID,
  MATRICULA_SET_WIZARD_ID_DATOS,
  MATRICULA_LOAD_NIVELES,
  MATRICULA_SET_ENTIDADMATRICULAID,
  MATRICULA_SAVE,
  MATRICULA_LOAD_DATOS_EDUCATIVOS,
  MATRICULA_ERROR,
  MATRICULA_UPDATE_DIRECCION,
  MATRICULA_GET_INFOANIOCURSOFECHAS,
  MATRICULA_LOAD_INFORMACIONREGISTRAL,
  MATRICULA_LOAD_ANIOSEDUCATIVOS,
  MATRICULA_LOAD_CURSOSLECTIVOS,
  MATRICULA_SELECT_ANIOEDUCATIVO,
  MATRICULA_SELECT_CURSOLECTIVO,
  MATRICULA_INFO,
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
} from './types'

const INITIAL_STATE = {
  data: {
    // Identidad, Datos (Catalogos), Direcciones
  },
  informacionRegistral: {
    identificadorRegistral1: '',
    nombreRegistral1: '',
    identificadorRegistral2: '',
    nombreRegistral2: ''
  },
  miembros: {
    data: [],
    miembro: {}
  },
  matriculaInfo: [],
  studentMatricula: {},
  datosEducativos: [],
  entidadMatriculaId: 0,
  niveles: [],
  errorFields: [],
  dataFilter: [],
  errorMessages: [],
  loading: false,
  error: false,
  errors: [],
  fields: [],
  informacionMatricula: {},
  aniosEducativosActivos: [],
  cursosLectivos: [],
  cursoLectivo: { label: '', value: null },
  anioEducativo: { label: '', value: null },
  estudiantesGrupoCertificaciones: [],
  estudiantesCenso: [],
  estudiantesCensoFinal: [],
  CondicionEstudianteCurso: [],
  tiposCenso:[],
  apoyosRecibidosIdentidad: [],
  apoyosNoRecibidosIdentidad: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_TIPOS_CENSO_FINAL':
      return {
        ...state,
        CondicionEstudianteCurso: action.payload
      }
      case 'GET_TIPOS_CENSO':
        return {
          ...state,
          tiposCenso: action.payload
        }
    case 'GET_STUDENTS_CENSO':
      return {
        ...state,
        estudiantesCenso: action.payload
      }
    case 'CLEAR_STUDENTS_CENSO':
      return {
        ...state,
        estudiantesCenso: []
      }
    case 'CLEAR_STUDENTS_CENSO_FINAL':
      return {
        ...state,
        estudiantesCensoFinal: []
      }
    case 'GET_STUDENTS_CENSO_FINAL':
      return {
        ...state,
        estudiantesCensoFinal: action.payload
      }
    case 'GET_STUDENT_MATRICULA':
      return {
        ...state,
        studentMatricula: action.payload
      }
    case MATRICULA_INFO:
      return {
        ...state,
        matriculaInfo: action.payload
      }
    case 'MATRICULA_UPDATE_NEW':
      return {
        ...state,
        studentMatricula: action.payload
      }
    case 'CLEAR_STUDENT_MATRICULA':
      return {
        ...state,
        studentMatricula: {}
      }
    case 'StudentsByGroupId':
      return {
        ...state,
        estudiantesGrupoCertificaciones: action.payload.map((e) => {
          return {
            ...e,
            nombre:
							e.nombre +
							' ' +
							e.primerApellido +
							'' +
							e.segundoApellido
          }
        })
      }
    case MATRICULA_SELECT_CURSOLECTIVO:
      return {
        ...state,
        cursoLectivo: action.payload
      }

    case MATRICULA_SELECT_ANIOEDUCATIVO:
      return {
        ...state,
        anioEducativo: action.payload
      }

    case MATRICULA_LOAD_ANIOSEDUCATIVOS:
      const mappedAnios = action.payload.map((item) => {
        return {
          label: item.nombre,
          value: item.id
        }
      })

      return {
        ...state,
        aniosEducativosActivos: mappedAnios
      }

    case MATRICULA_LOAD_CURSOSLECTIVOS:
      const mappedCursos = action.payload.map((item) => {
        return {
          label: item.nombre,
          value: item.id
        }
      })

      return {
        ...state,
        cursosLectivos: mappedCursos
      }

    case MATRICULA_LOAD_INFORMACIONREGISTRAL:
      const _informacionRegistral = {
        identificadorRegistral1: action.payload.idMadrePadreRegistral1,
        nombreRegistral1: action.payload.nombreMadrePadreRegistral1,
        identificadorRegistral2: action.payload.idMadrePadreRegistral2,
        nombreRegistral2: action.payload.nombreMadrePadreRegistral2
      }

      return {
        ...state,
        informacionRegistral: _informacionRegistral
      }
    case MATRICULA_GET_INFOANIOCURSOFECHAS:
      return {
        ...state,
        informacionMatricula: action.payload
      }

    case MATRICULA_UPDATE_DIRECCION:
      let direcciones = [...state.data.direcciones]
      const temporal = action.payload.temporal
      if (temporal) {
        direcciones = direcciones.map((item) => {
          if (item.temporal) {
            return {
              ...item,
              id: action.payload.id
            }
          } else {
            return item
          }
        })
      } else {
        direcciones = direcciones.map((item) => {
          if (!item.temporal) {
            return {
              ...item,
              id: action.payload.id
            }
          } else {
            return item
          }
        })
      }

      return {
        ...state,
        data: { ...state.data, direcciones }
      }
    case MATRICULA_ERROR:
      return {
        ...state,
        loading: false,
        errors: action.payload.errors || [],
        fields: action.payload.fields || []
      }
      // Datos educativos
    case MATRICULA_LOAD_DATOS_EDUCATIVOS:
      return {
        ...state,
        datosEducativos: action.payload
      }

    case MATRICULA_SAVE:
      return {
        ...state
        // TODO: Que hacer al guardar
      }

    case MATRICULA_SET_ENTIDADMATRICULAID:
      return {
        ...state,
        entidadMatriculaId: action.payload
      }

    case MATRICULA_LOAD_NIVELES:
      return {
        ...state,
        niveles: action.payload
      }
    case MATRICULA_ADD_MEMBER:
      const dataEncargado = action.payload
      return {
        ...state,
        miembros: {
          ...state.miembros,
          data: [...state.miembros.data, dataEncargado],
          miembro: {}
        }
      }

    case MATRICULA_CLEAR_MEMBER:
      return {
        ...state,
        miembros: { ...state.miembros, miembro: {} }
      }

    case MATRICULA_UPDATE_MEMBER:
      const _miembros = state.miembros.data.filter(
        (x) => x.id !== action.payload.id
      )
      const _newData = [..._miembros, action.payload]
      return {
        ...state,
        miembros: { ...state.miembros, data: _newData, miembro: {} }
      }
    case MATRICULA_REMOVE_MEMBER:
      return {
        ...state,
        miembros: {
          ...state.miembros,
          data: [
            ...state.miembros.data.filter(
              (x) => x.id !== action.payload
            )
          ]
        }
      }

    case MATRICULA_UPDATE_IDENTIDAD:
      const data = {}

      return {
        ...state,
        data: data
      }

    case MATRICULA_LOAD_MEMBER:
      const _miembro = state.miembros.data.find(
        (x) => x.id === action.payload
      )
      return {
        ...state,
        miembros: {
          ...state.miembros,
          miembro: _miembro
        },
        loading: false,
        error: false
      }
    case MATRICULA_LOAD_MEMBERS:
      return {
        ...state,
        miembros: {
          ...state.miembros,
          data: action.payload
        },
        loading: false,
        error: false
      }
    case MATRICULA_LOAD_STUDENT:
      const informacionRegistral = {
        identificadorRegistral1:
					action.payload.identificacionInfoRegistral1,
        nombreRegistral1: action.payload.nombreCompletoInfoRegistral1,
        identificadorRegistral2:
					action.payload.identificacionInfoRegistral2,
        nombreRegistral2: action.payload.nombreCompletoInfoRegistral2
      }
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        informacionRegistral,
        loading: false,
        error: false
      }
    case MATRICULA_UPDATE_INFORMACION_REGISTRAL:
      return {
        ...state,
        informacionRegistral: action.payload,
        loading: false,
        error: false
      }
    case MATRICULA_FILTER:
      return {
        ...state,
        dataFilter: mapDataFilter(action.payload),
        loading: false,
        error: false
      }
    case MATRICULA_CLEAN_FILTER:
      return {
        ...state,
        dataFilter: [],
        loading: false,
        error: false
      }
    case MATRICULA_SET_WIZARD_ID:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      }
    case MATRICULA_SET_WIZARD_ID_DATOS:
      var datos = state.data.datos
      if (datos) {
        action.payload.map((item) => {
          const _index = datos.findIndex(
            (x) => x.codigoCatalogo === item.codigoCatalogo
          )

          if (_index !== -1) {
            datos[_index] = {
              ...datos[_index],
              elementoId: item.elementoId
            }
          } else {
            datos.push(item)
          }
        })
      } else {
        datos = action.payload
      }
      return {
        ...state,
        data: {
          ...state.data,
          datos
        }
      }
    case MATRICULA_SET_WIZARD_STEPS:
      switch (action.step) {
        case 1:
          return {
            ...state,
            data: {
              ...state.data,
              ...action.payload
            }
          }
        case 2:
          let datosDirecciones = state.data.direcciones
          if (datosDirecciones) {
            action.payload.map((item) => {
              const _index = datosDirecciones.findIndex(
                (x) => x.temporal === item.temporal
              )
              if (_index !== -1) {
                const obj = {
                  ...datosDirecciones[_index],
                  ...item
                }
                datosDirecciones[_index] = obj
              } else {
                datosDirecciones.push(item)
              }
            })
          } else {
            datosDirecciones = action.payload
          }
          return {
            ...state,
            data: {
              ...state.data,
              direcciones: datosDirecciones
            }
          }
        case 3:
          return {
            ...state,
            informacionRegistral: action.payload
          }
        case 5:
          return {
            ...state,
            data: {
              matricula: action.payload
            }
          }
        default:
          return {
            ...state,
            data: {}
          }
      }
    case MATRICULA_CLEAR_STUDENT:
      return {
        ...state,
        data: {}
      }
    case MATRICULA_STUDENT_LOADING:
      return {
        ...state,
        loading: true,
        error: false
      }
    case MATRICULA_STUDENT_ERROR:
      return {
        ...state,
        loading: false,
        error: true
      }
    default:
      return state
      //nuevo
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
                    data = state[action.name].entityList
                    data.push(action.payload)
                    return {
                      ...state,
                      [action.name]: {
                        ...state[action.name],
                        entityList: data
                      }
                    }
       case MATRICULA_APOYOS_NO_RECIBIDOS_EDIT:
                      data = state[action.name].entityList
                      data[action.index] = action.payload
                      return {
                        ...state,
                        [action.name]: {
                          ...state[action.name],
                          entityList: data
                        }
                      }
       case MATRICULA_APOYOS_NO_RECIBIDOS_DELETE:
                      data = state[action.name].entityList
                      data = data.filter((value, index) => index !== action.payload)
                      return {
                        ...state,
                        [action.name]: {
                          ...state[action.name],
                          entityList: data
                        }
                      } 
                      
      case MATRICULA_APOYOS_RECIBIDOS_ADD:
        data = state[action.name].entityList
        data.push(action.payload)
        return {
          ...state,
          [action.name]: {
            ...state[action.name],
            entityList: data
          }
        }            

  }
  
}

const mapDataFilter = (data) => {
  return data.map((item) => {
    return {
      ...item,
      identificacion: item.identificacion,
      nombreEstudiante: item.nombreEstudiante,
      fechaNacimiento: item.fechaNacimiento
        ? moment(item.fechaNacimiento).format('DD/MM/YYYY') +
				  '(' +
				  moment().diff(item.fechaNacimiento, 'years', false) +
				  ' años)'
        : '',
      edad: item.fechaNacimiento
        ? moment().diff(item.fechaNacimiento, 'years', false)
        : 0,
      fallecido: item.fallecido ? 'Sí' : 'No',
      esFallecido: item.fallecido,
      institucion:
				item.institucion === '-' ? 'Sin Asignar' : item.institucion
    }
  })
}
