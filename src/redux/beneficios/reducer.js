import {
  BENEFICIOS_MEP_LOAD,
  BENEFICIOS_CLEAN,
  BENEFICIOS_LOADING,
  BENEFICIOS_ERROR,
  BENEFICIOS_TIPOS_SUBSIDIOS,
  BENEFICIOS_DEPENDECIAS_SUBSIDIO
} from './types'

const INITIAL_STATE = {
  dataMEP: {},
  dataSINIRUBE: {},
  typesSubsidios: [],
  dependencias: [],
  loading: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BENEFICIOS_TIPOS_SUBSIDIOS:
      return {
        ...state,
        typesSubsidios: action.payload,
        loading: false,
        errors: [],
        fields: [],
        error: false
      }
    case BENEFICIOS_DEPENDECIAS_SUBSIDIO:
      return {
        ...state,
        dependencias: action.payload,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case BENEFICIOS_MEP_LOAD:

      const _data = action.payload.entityList.map((item, i) => {
        const TipoSubsidio = state.typesSubsidios.find(t => t.id === item.tipoSubsidioId)
        const Dependecia = state.dependencias.find(d => d.id === TipoSubsidio.dependeciasSubsidioId)
        const recepcionVerificada = item.recepcionVerificada ? 'Si' : 'No'
        const _statusColor = item.recepcionVerificada ? 'primary' : 'danger'

        const icon = 'simple-icon-star'
        const obj = {
          ...item,
          icon,
          recepcionVerificada,
          nombreDependecia: Dependecia.nombre,
          nombreTipoSubsidio: TipoSubsidio.nombre,
          detalleTipoSubsidio: TipoSubsidio.detalle,
          statusColor: _statusColor
        }
        return obj
      })
      return {
        ...state,
        dataMEP: {
          ...action.payload,
          entityList: _data
        },
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case BENEFICIOS_LOADING:
      return {
        ...state,
        loading: true,
        error: false
      }

    case BENEFICIOS_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
        errors: action.payload.errors || [],
        fields: action.payload.fields || []
      }
    case BENEFICIOS_CLEAN:
      return INITIAL_STATE
    default: return state
  }
}
