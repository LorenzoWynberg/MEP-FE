import {
  ADD_INDICADOR_DATA_COLUMN,
  ADD_INDICADOR_DATA_ROW,
  LOAD_INDICADOR_APRENDIZAJE,
  LOAD_INDICADOR_APRENDIZAJE_PAGINATED,
  REMOVE_INDICADOR_DATA_COLUMN,
  REMOVE_INDICADOR_DATA_ROW,
  SET_COLUMN_COLOR,
  SET_CELL_TEXT,
  SET_COLUMN_TEXT,
  SET_ROW_NAME_TEXT,
  ADD_CONTENIDO,
  REMOVE_CONTENIDO,
  TOGGLE_HABILITAR_PUNTOS,
  SET_CONTENIDO_NAME,
  SET_INDICADOR_DATA,
  SET_COLUMN_PUNTOS
} from './types'
import { cloneDeep } from 'lodash'
import { guidGenerator } from 'utils/GUIDGenerator'
const DEFAULT_CONTENIDO_OBJ = {
  id: 1,
  nombre: '',
  descripcion: '',
  puntos: false,
  columnas: [
    {
      id: 1,
      nombre: '',
      color: '#09243b',
      puntos: ''
    },
    {
      id: 2,
      nombre: '',
      color: '#0c3354',
      puntos: ''
    },
    {
      id: 3,
      nombre: '',
      color: '#10436e',
      puntos: ''
    }
  ],
  filas: [
    {
      id: 1,
      nombre: '',
      celdas: [
        {
          id: 1,
          nombre: '',
          detalle: '',
          guid: guidGenerator()
        },
        {
          id: 2,
          nombre: '',
          detalle: '',
          guid: guidGenerator()
        },
        {
          id: 3,
          nombre: '',
          detalle: '',
          guid: guidGenerator()
        }
      ]
    }
  ]
}

const INITIAL_GRID_STATE = {
  Contenidos: [cloneDeep(DEFAULT_CONTENIDO_OBJ)]
}

const INITIAL_STATE = {
  indicadoresAprendizaje: [],
  indicadorAprendizaje: {},
  dataIndicadores: cloneDeep(INITIAL_GRID_STATE)
}

const siguienteId = (arr) => {
  if (!Array.isArray(arr)) return

  arr.sort((a, b) => a.id - b.id)

  const indice = arr.length - 1
  return arr[indice].id + 1
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (action.type) {
    case LOAD_INDICADOR_APRENDIZAJE: {
      return {
        ...state,
        indicadoresAprendizaje: action.payload
      }
    }
    case LOAD_INDICADOR_APRENDIZAJE_PAGINATED: {
      return {
        ...state,
        indicadorAprendizaje: action.payload
      }
    }
    case ADD_INDICADOR_DATA_COLUMN: {
      const conts = { ...state.dataIndicadores }

      const defCelda = {
        nombre: '',
        detalle: '',
        guid: guidGenerator()
      }

      payload.columnData.id = guidGenerator()
      conts.Contenidos[payload.contenidoIndex].columnas.push(payload.columnData)

      conts.Contenidos[payload.contenidoIndex].filas = conts.Contenidos[
        payload.contenidoIndex
      ].filas.map((fila) => {
        fila.celdas.push({
          id: guidGenerator(),
          nombre: '',
          detalle: '',
          guid: guidGenerator()
        })
        return fila
      })
      debugger
      return {
        ...state,
        dataIndicadores: conts
      }
    }
    case ADD_INDICADOR_DATA_ROW: {
      const conts = { ...state.dataIndicadores }
      payload.rowData.id = guidGenerator()
      conts.Contenidos[payload.contenidoIndex].filas.push(payload.rowData)
      return {
        ...state,
        dataIndicadores: conts
      }
    }
    case REMOVE_INDICADOR_DATA_COLUMN: {
      const conts = { ...state.dataIndicadores }
      conts.Contenidos[payload.contenidoIndex].columnas.splice(
        payload.columnIndex,
        1
      )
      conts.Contenidos[payload.contenidoIndex].filas = conts.Contenidos[
        payload.contenidoIndex
      ].filas.map((fila) => {
        fila.celdas = fila.celdas.filter(
          (_, index) => index != payload.columnIndex
        )
        return fila
      })
      return {
        ...state,
        dataIndicadores: conts
      }
    }
    case REMOVE_INDICADOR_DATA_ROW: {
      const conts = { ...state.dataIndicadores }
      conts.Contenidos[payload.contenidoIndex].filas.splice(payload.rowIndex, 1)
      return {
        ...state,
        dataIndicadores: conts
      }
    }
    case SET_COLUMN_COLOR: {
      const di = { ...state.dataIndicadores }
      di.Contenidos[payload.contenidoIndex].columnas[
        payload.columnIndex
      ].color = payload.colorHex
      return {
        ...state,
        dataIndicadores: di
      }
    }
    case SET_CELL_TEXT: {
      const di = { ...state.dataIndicadores }
      di.Contenidos[payload.contenidoIndex].filas[payload.rowIndex].celdas[
        payload.cellIndex
      ].nombre = payload.text
      return {
        ...state,
        dataIndicadores: di
      }
    }
    case SET_ROW_NAME_TEXT: {
      const di = { ...state.dataIndicadores }
      di.Contenidos[payload.contenidoIndex].filas[payload.rowIndex].nombre =
        payload.text
      return {
        ...state,
        dataIndicadores: di
      }
    }
    case SET_COLUMN_TEXT: {
      const di = { ...state.dataIndicadores }
      di.Contenidos[payload.contenidoIndex].columnas[
        payload.columnIndex
      ].nombre = payload.text
      return {
        ...state,
        dataIndicadores: di
      }
    }
    case ADD_CONTENIDO: {
      const di = { ...state.dataIndicadores }
      const newContenido = cloneDeep(DEFAULT_CONTENIDO_OBJ)
      const filas = newContenido.filas.map((f) => {
        return {
          ...f,
          celdas: f.celdas.map((c) => {
            return {
              ...c,
              guid: guidGenerator()
            }
          })
        }
      })
      newContenido.filas = filas
      newContenido.id = guidGenerator()
      di.Contenidos.push(newContenido)

      return {
        ...state,
        dataIndicadores: di
      }
    }
    case REMOVE_CONTENIDO: {
      const di = { ...state.dataIndicadores }
      di.Contenidos.splice(payload.contenidoIndex, 1)
      return {
        ...state,
        dataIndicadores: di
      }
    }
    case TOGGLE_HABILITAR_PUNTOS: {
      const di = cloneDeep(state.dataIndicadores)
      di.Contenidos[payload.contenidoIndex].puntos =
        !di.Contenidos[payload.contenidoIndex].puntos
      return {
        ...state,
        dataIndicadores: di
      }
    }
    case SET_CONTENIDO_NAME: {
      const di = cloneDeep(state.dataIndicadores)
      di.Contenidos[payload.contenidoIndex].nombre = payload.contenidoName
      return {
        ...state,
        dataIndicadores: di
      }
    }
    case SET_INDICADOR_DATA: {
      return {
        ...state,
        dataIndicadores: payload.dataIndicadores
          ? payload.dataIndicadores
          : cloneDeep(INITIAL_GRID_STATE)
      }
    }
    case SET_COLUMN_PUNTOS: {
      const di = cloneDeep(state.dataIndicadores)
      di.Contenidos[payload.contenidoIndex].columnas[
        payload.columnIndex
      ].puntos = payload.puntos
      return {
        ...state,
        dataIndicadores: di
      }
    }
    default:
      return state
  }
}
