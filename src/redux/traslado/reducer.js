// import moment from 'moment'

import {
  TRASLADOS_DATA,
  TRASLADO_CENTROS,
  TRASLADO_CENTRO_DATA,
  TRASLADO_LOADING,
  TRASLADO_CLEAR_CENTRO,
  TRASLADO_CLEAR_CENTROS,
  TRASLADO_CLEAR_STUDENT,
  TRASLADO_CLEAR_STUDENTS,
  TRASLADO_ERROR,
  TRASLADO_REVISION_UPDATE,
  TRASLADO_SAVE,
  TRASLADO_CLEAR,
  TRASLADOS_CLEAR,
  TRASLADO_SET_TRASLADO,
  TRASLADO_SET_WIZARD_STEPS,
  TRASLADO_STUDENTS,
  TRASLADO_STUDENT_DATA,
  TRASLADO_NIVELES,
  TRASLADO_NIVEL_DATA,
  TRASLADO_CLEAR_NIVEL,
  TRASLADO_ADD_MOTIVO,
  TRASLADO_ADD_MOTIVO_RECHAZO,
  TRASLADO_REVISION_RESULT,
  TRASLADO_DIRECTOR_TIENE_PERMISO,
  TRASLADO_SET_VALIDADOR,
  TRASLADO_CLEAR_VALIDADOR
} from './types'

const INITIAL_STATE = {
  trasladoData: {
    // general data of translate/move
    infoTraslado: {},
    centroPropuesto: {},
    condicionActual: {},
    condicionPropuesta: {}
  },
  validadorTraslado: {},
  infoDirectorRevisor: {},
  estudianteData: {},
  centroData: {},
  entidadMatriculaId: 0,
  nivelData: {},
  studentsToTranslate: [],
  centros: [],
  niveles: [],
  motivoSolicitud: '',
  motivoRechazo: '',
  directorEsRevisor: false,
  revisionResult: 0,
  centrosEducativos: [],
  traslados: [],
  errorFields: [],
  errorMessages: [],
  loading: false
}

export default (
  state = INITIAL_STATE,
  { type, payload, tipoTraslado, step }
) => {
  switch (type) {
    case 'TRASLADOS_LOAD_INSTITUTIONS':
      return {
        ...state,
        centrosEducativos: payload,
        loading: false
      }
    case 'TRASLADOS_CLEAN_INSTITUTIONS':
      return {
        ...state,
        centrosEducativos: [],
        loading: false
      }
    case TRASLADO_SAVE:
      return {
        ...state,
        infoDirectorRevisor: payload,
        loading: false
      }

    case TRASLADO_DIRECTOR_TIENE_PERMISO:
      return {
        ...state,
        directorEsRevisor: payload,
        loading: false
      }
    case TRASLADO_REVISION_UPDATE:
      const trasladosUpdated = state.traslados.entityList.map((item) =>
        item.id === payload.infoTraslado.id
          ? mapDdataToListItem(payload)
          : item
      )
      return {
        ...state,
        trasladoData: payload,
        traslados: { ...state.traslados, entityList: trasladosUpdated },
        loading: false
      }
    case TRASLADOS_CLEAR:
      return {
        ...state,
        traslados: [],
        loading: false
      }
    case TRASLADO_CLEAR:
      return {
        ...state,
        trasladoData: {
          infoTraslado: {},
          centroPropuesto: {},
          condicionActual: {},
          condicionPropuesta: {}
        },
        entidadMatriculaId: 0,
        loading: false
      }

    case TRASLADO_ADD_MOTIVO:
      return {
        ...state,
        motivoSolicitud: payload
      }

    case TRASLADO_ADD_MOTIVO_RECHAZO:
      return {
        ...state,
        motivoRechazo: payload
      }
    case TRASLADO_REVISION_RESULT:
      return {
        ...state,
        revisionResult: payload
      }
    case TRASLADOS_DATA:
      return {
        ...state,
        traslados: payload,
        loading: false
      }

    case TRASLADO_SET_TRASLADO:
      return {
        ...state,
        trasladoData: payload,
        loading: false,
        errorFields: [],
        errorMessages: []
      }

    case TRASLADO_CLEAR_STUDENT:
      return {
        ...state,
        estudianteData: {},
        loading: false
      }
    case TRASLADO_SET_VALIDADOR:
      return {
        ...state,
        validadorTraslado: payload,
        loading: false,
        errorFields: [],
        errorMessages: []
      }

    case TRASLADO_CLEAR_VALIDADOR:
      return {
        ...state,
        validadorTraslado: {},
        loading: false
      }
    case TRASLADO_CLEAR_STUDENTS:
      return {
        ...state,
        studentsToTranslate: [],
        loading: false
      }
    case TRASLADO_STUDENTS:
      return {
        ...state,
        studentsToTranslate: payload,
        loading: false
      }

    case TRASLADO_STUDENT_DATA:
      return {
        ...state,
        estudianteData: payload,
        entidadMatriculaId: 0,
        loading: false,
        errorFields: [],
        errorMessages: []
      }
    case TRASLADO_CLEAR_CENTROS:
      return {
        ...state,
        centros: [],
        loading: false
      }

    case TRASLADO_CLEAR_CENTRO:
      return {
        ...state,
        centroData: {},
        loading: false
      }

    case TRASLADO_CENTROS:
      return {
        ...state,
        centros: payload,
        loading: false
      }

    case TRASLADO_CENTRO_DATA:
      return {
        ...state,
        centroData: payload,
        loading: false,
        errorFields: [],
        errorMessages: []
      }
    case TRASLADO_CLEAR_NIVEL:
      return {
        ...state,
        entidadMatriculaId: 0,
        nivelData: {
          ofertaNombre: '',
          modalidadNombre: '',
          especialidadNombre: '',
          servicioNombre: '',
          nivelNombre: ''
        },
        loading: false
      }

    case TRASLADO_NIVELES:
      return {
        ...state,
        niveles: payload,
        loading: false
      }
    case 'TRASLADOS_CLEAR_NIVELES':
      return {
        ...state,
        niveles: [],
        loading: false
      }

    case TRASLADO_NIVEL_DATA:
      return {
        ...state,
        entidadMatriculaId: payload.entidadMatriculaId,
        nivelData: payload,
        loading: false,
        errorFields: [],
        errorMessages: []
      }

    case TRASLADO_SET_WIZARD_STEPS:
      // infoTraslado: {},
      // centroPropuesto: {},
      // condicionActual: {},
      // condicionPropuesta: {},
      switch (step) {
        case 1: // tipoTraslado 0>Interno, 1> Desde mi centro. 2>Hacia mi centro
          return {
            ...state,
            trasladoData: {
              ...state.trasladoData,
              condicionActual: payload
            }
          }
        case 2:
          return {
            ...state,
            trasladoData: {
              ...state.trasladoData,
              condicionPropuesta: [0, 2].includes(tipoTraslado)
                ? payload
                : state.trasladoData.condicionPropuesta,
              centroPropuesto:
								tipoTraslado === 1
								  ? payload
								  : state.trasladoData.centroPropuesta
            }
          }
        case 3:
          return {
            ...state,
            trasladoData: {
              ...state.trasladoData,
              infoTraslado: {
                ...state.trasladoData.infoTraslado,
                motivo: payload
              }
            }
          }

        default:
          return {
            ...state,
            trasladoData: {
              infoTraslado: {},
              centroPropuesto: {},
              condicionActual: {},
              condicionPropuesta: {}
            },
            loading: false
          }
      }
    case TRASLADO_LOADING:
      return {
        ...state,
        loading: true
      }
    case TRASLADO_ERROR:
      return {
        ...state,
        loading: false,
        errorFields: payload.fields || [],
        errorMessages: payload.errors || []
      }

    default:
      return state
  }
}

const getEstadoText = (estado) => {
  switch (estado) {
    case -1:
      return 'Cancelado'
    case 0:
      return 'En espera'
    case 1:
      return 'Aceptado'
    case 2:
      return 'Rechazado'
    default:
      return 'No definido'
  }
}

const mapDdataToListItem = (data) => {
  const { id, numeroSolicitud, estado, fechaHoraSolicitud, tipoTraslado } =
		data.infoTraslado
  const { identificacion, nombre } = data.condicionActual

  return {
    id,
    numeroSolicitud,
    identificacion,
    nombreEstudiante: nombre,
    estado: getEstadoText(estado),
    ceResuelve: data.condicionPropuesta.centro,
    fechaHoraSolicitud,
    tipoTraslado
  }
}
