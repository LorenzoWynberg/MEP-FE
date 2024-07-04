import {
  LOAD_INDICADOR_APRENDIZAJE,
  SET_INDICADOR_DATA,
  ADD_INDICADOR_DATA_COLUMN,
  ADD_INDICADOR_DATA_ROW,
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
  SET_COLUMN_PUNTOS
} from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const loadIndicador = (payload) => ({
  type: LOAD_INDICADOR_APRENDIZAJE,
  payload
})

export const deleteRubriCalif = (data) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/RubricaAprendizaje/${data.id}`)

    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateRubriCalif = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
            `${envVariables.BACKEND_URL}/api/RubricaAprendizaje/${data.id}`, data
    )

    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message, data: null }
  }
}

export const createCompRubriCalif = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/RubricaAprendizaje`, data
    )

    return {
      error: false,
      data: response.data
    }
  } catch (e) {
    return {
      error: e.message,
      data: null
    }
  }
}

export const getIndicadorAprendizaje = () => async (dispatch) => {
  try {
    const response = await axios.get(
            `${envVariables.BACKEND_URL}/api/RubricaAprendizaje/getAll`
    )
    dispatch(loadIndicador(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const addIndicadorColumn = (columnData, contenidoIndex) => {
  return { type: ADD_INDICADOR_DATA_COLUMN, payload: { columnData, contenidoIndex } }
}

export const addIndicadorRow = (rowData, contenidoIndex) => {
  return { type: ADD_INDICADOR_DATA_ROW, payload: { rowData, contenidoIndex } }
}

export const removeIndicadorColumn = (columnIndex, contenidoIndex) => {
  return {
    type: REMOVE_INDICADOR_DATA_COLUMN, payload: { columnIndex, contenidoIndex }
  }
}

export const removeIndicadorRow = (rowIndex, contenidoIndex) => {
  return {
    type: REMOVE_INDICADOR_DATA_ROW, payload: { rowIndex, contenidoIndex }
  }
}

export const setColumnColor = (contenidoIndex, columnIndex, colorHex) => {
  return {
    type: SET_COLUMN_COLOR, payload: { colorHex, columnIndex, contenidoIndex }
  }
}

export const setCellText = (contenidoIndex, rowIndex, cellIndex, text) => {
  return {
    type: SET_CELL_TEXT, payload: { contenidoIndex, rowIndex, cellIndex, text }
  }
}

export const setRowNameText = (contenidoIndex, rowIndex, text) => {
  return {
    type: SET_ROW_NAME_TEXT, payload: { contenidoIndex, rowIndex, text }
  }
}

export const setColumnText = (contenidoIndex, columnIndex, text) => {
  return {
    type: SET_COLUMN_TEXT, payload: { contenidoIndex, columnIndex, text }
  }
}

export const addContenido = () => {
  return {
    type: ADD_CONTENIDO
  }
}

export const removeContenido = (contenidoIndex) => {
  return {
    type: REMOVE_CONTENIDO, payload: { contenidoIndex }
  }
}

export const toggleHabilitarPuntos = (contenidoIndex) => {
  return {
    type: TOGGLE_HABILITAR_PUNTOS, payload: { contenidoIndex }
  }
}

export const setContenidoName = (contenidoIndex, contenidoName) => {
  return {
    type: SET_CONTENIDO_NAME, payload: { contenidoIndex, contenidoName }
  }
}

export const setDataIndicador = (dataIndicadores) => {
  return {
    type: SET_INDICADOR_DATA, payload: { dataIndicadores }
  }
}

export const saveJsonData = (rubricaId, jsonData) => async (dispatch) => {
  try {
    await axios.post(`${envVariables.BACKEND_URL}/api/RubricaAprendizaje/updateJson`, {
      id: rubricaId,
      nombre: 'dummy',
      descripcion: 'dummy',
      json: JSON.stringify({ Contenidos: jsonData })
    })
    dispatch(getIndicadorAprendizaje())

    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const setPuntosColumnas = (contenidoIndex, columnIndex, puntos) => {
  return {
    type: SET_COLUMN_PUNTOS, payload: { contenidoIndex, columnIndex, puntos }
  }
}
