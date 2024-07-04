import {
  IDENTIDAD_LOAD_STUDENT,
  IDENTIDAD_STUDENT_ERROR,
  IDENTIDAD_STUDENT_LOADING,
  IDENTIDAD_CLEAR_STUDENT,
  IDENTIDAD_UPDATE_IDENTIDAD,
  IDENTIDAD_SET_WIZARD_STEPS,
  IDENTIDAD_SET_WIZARD_ID,
  IDENTIDAD_SET_WIZARD_ID_DATOS,
  IDENTIDAD_BITACORAS_LOAD,
  IDENTIDAD_BITACORAS_ERROR,
  IDENTIDAD_WIZARD_SET_DATA,
  IDENTIDAD_WIZARD_SET_NAV,
  IDENTIDAD_WIZARD_CLEAR_DATA,
  IDENTIDAD_WIZARD_CLEAR_NAV
} from './types'

const INITIAL_STATE = {
  data: {
    // Identidad, Datos, Direcciones
  },
  bitacoras: {
    entityList: []
  },
  dataWizard: {
    data: null,
    form: null,
    photo: null,
    dataCompare: null,
    files: []
  },
  dataNavWizard: {
    selectedType: null,
    selectedComponent: null
  },
  steps: {
    cedula: [
      {
        key: 1,
        id: 'cedulaStep1',
        title: 'Paso 1',
        titleKey: 'estudiantes>indentidad_per>aplicar_camb>paso1',
        description: 'Ingresar la información',
        descKey: 'estudiantes>indentidad_per>aplicar_camb>ingre_info'
      },
      {
        key: 2,
        id: 'cedulaStep2',
        title: 'Paso 2',
        titleKey: 'estudiantes>indentidad_per>aplicar_camb>paso2',
        description: 'Subir o tomar foto',
        descKey: 'estudiantes>indentidad_per>aplicar_camb>subir_foto'
      }
    ],
    dimex: [
      {
        key: 1,
        id: 'dimexStep1',
        title: 'Paso 1',
        titleKey: 'estudiantes>indentidad_per>aplicar_camb>paso1',
        description: 'Ingresar la información',
        descKey: 'estudiantes>indentidad_per>aplicar_camb>ingre_info'
      },
      {
        key: 2,
        id: 'dimexStep2',
        title: 'Paso 2',
        titleKey: 'estudiantes>indentidad_per>aplicar_camb>paso2',
        description: 'Subir o tomar foto',
        descKey: 'estudiantes>indentidad_per>aplicar_camb>subir_foto'
      }
    ],
    yisro: [
      {
        key: 0,
        id: 'yisroStep1',
        title: 'Paso 1',
        titleKey: 'estudiantes>indentidad_per>aplicar_camb>paso1',
        description: 'Subir o tomar foto',
        descKey: 'estudiantes>indentidad_per>aplicar_camb>subir_foto'
      },
      {
        key: 1,
        id: 'yisroStep2',
        title: 'Paso 2',
        titleKey: 'estudiantes>indentidad_per>aplicar_camb>paso2',
        description: 'Ingresar la información',
        descKey: 'estudiantes>indentidad_per>aplicar_camb>ingre_info'
      },
      {
        key: 2,
        id: 'yisroStep3',
        title: 'Paso 3',
        titleKey: 'estudiantes>indentidad_per>aplicar_camb>paso3',
        description: 'Indicar documentos probatorios',
        descKey: 'estudiantes>indentidad_per>aplicar_camb>indicar_doc'
      }
    ]
  },
  errorFields: {},
  errorMessages: {},
  loading: false,
  error: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case IDENTIDAD_WIZARD_SET_DATA:
      return {
        ...state,
        dataWizard: { ...state.dataWizard, ...action.payload },
        loading: false,
        error: false
      }
    case IDENTIDAD_WIZARD_CLEAR_DATA:
      return {
        ...state,
        dataWizard: INITIAL_STATE.dataWizard,
        loading: false,
        error: false
      }
    case IDENTIDAD_WIZARD_SET_NAV:
      return {
        ...state,
        dataNavWizard: { ...state.dataNavWizard, ...action.payload },
        loading: false,
        error: false
      }
    case IDENTIDAD_WIZARD_CLEAR_NAV:
      return {
        ...state,
        dataNavWizard: INITIAL_STATE.dataNavWizard,
        loading: false,
        error: false
      }
    case IDENTIDAD_UPDATE_IDENTIDAD:
      const _data = {}

      return {
        ...state,
        data: _data
      }
    case IDENTIDAD_LOAD_STUDENT:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        loading: false,
        error: false
      }
    case IDENTIDAD_BITACORAS_LOAD:
      return {
        ...state,
        bitacoras: action.payload
      }
    case IDENTIDAD_BITACORAS_ERROR:
      return {
        ...state,
        loading: false,
        errorFields: action.payload.fields,
        errorMessages: action.payload.errors
      }
    case IDENTIDAD_SET_WIZARD_ID:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      }
    case IDENTIDAD_SET_WIZARD_ID_DATOS:
      var datos = state.data.datos
      if (datos) {
        action.payload.map((item) => {
          if (!isNaN(item.elementoId)) {
            const _index = datos.findIndex(
              (x) => x.codigoCatalogo === item.codigoCatalogo
            )

            if (_index !== -1) {
              datos[_index] = { ...datos[_index], elementoId: item.elementoId }
            } else {
              datos.push(item)
            }
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
    case IDENTIDAD_SET_WIZARD_STEPS:
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

        default:
          return {
            ...state,
            data: {}
          }
      }
    case IDENTIDAD_CLEAR_STUDENT:
      return {
        ...state,
        data: {}
      }
    case IDENTIDAD_STUDENT_LOADING:
      return {
        ...state,
        loading: true,
        error: false
      }
    case IDENTIDAD_STUDENT_ERROR:
      return {
        ...state,
        loading: false,
        errorFields: action.payload.fields,
        errorMessages: action.payload.errors
      }
    default:
      return state
  }
}
