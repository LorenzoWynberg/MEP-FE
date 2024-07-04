import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

import {
  CURSOS_LECTIVOS_LOAD,
  CURSOS_LECTIVOS_LOAD_CALENDARS,
  CURSOS_LECTIVOS_SET_ACTIVE,
  CURSOS_LECTIVOS_SET_CALENDAR_ACTIVE,
  CURSOS_LECTIVOS_CLEAR_CALENDARS,
  CURSOS_LECTIVOS_CHANGE_STATE,
  CURSOS_LECTIVOS_CALENDARIOS_CHANGE_STATE
} from './types'

const loadCursosLectivos = (payload) => ({
  type: CURSOS_LECTIVOS_LOAD,
  payload
})

const loadCalendarios = (payload) => ({
  type: CURSOS_LECTIVOS_LOAD_CALENDARS,
  payload
})
const clearCalendarios = () => ({
  type: CURSOS_LECTIVOS_CLEAR_CALENDARS
})

const setActive = (payload) => ({
  type: CURSOS_LECTIVOS_SET_ACTIVE,
  payload
})
const setCalendarActive = (payload) => ({
  type: CURSOS_LECTIVOS_SET_CALENDAR_ACTIVE,
  payload
})
const changeStateCursosElectivos = (payload) => ({
  type: CURSOS_LECTIVOS_CHANGE_STATE,
  payload
})
const changeStateCursosElectivosCalendarios = (payload) => ({
  type: CURSOS_LECTIVOS_CALENDARIOS_CHANGE_STATE,

  payload
})

export const getCursosLectivos = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/CursosLectivos`
    )
    dispatch(loadCursosLectivos(response.data))
  } catch (e) {}
}

export const getCursosLectivosByYear =
  (edYearId: number) => async (dispatch) => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/CursosLectivos/GetByEdYearId/${edYearId}`
      )
      dispatch(loadCursosLectivos(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const createCursoLectivo = (data) => async (dispatch, getState) => {
  const { cursosLectivos } = getState().cursoLectivo
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/CursosLectivos`,
      data
    )
    dispatch(loadCursosLectivos([...cursosLectivos, response.data]))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getCalendarsByCursoLectivo = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Calendario/GetByCursoLectivo/${id}`
    )
    dispatch(loadCalendarios({ cL: id, calendars: response.data }))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createCalendar =
  (data: object, cursoLectivoId) => async (dispatch, getState) => {
    const { calendarios, cursoLectivoActivo } = getState().cursoLectivo

    try {
      const response = await axios.post(
        `${envVariables.BACKEND_URL}/api/Calendario`,
        data
      )
      dispatch(
        loadCalendarios({
          cL: cursoLectivoId,
          calendars: calendarios[cursoLectivoId]
            ? [...calendarios[cursoLectivoId], response.data]
            : [response.data]
        })
      )
      dispatch(setCalendarActive({
        ...response.data,
        startDateYear: cursoLectivoActivo?.fechaInicio,
        endDateYear: cursoLectivoActivo?.fechaFinal
      }))

      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const editCalendar =
  (data: object, cursoLectivoId) => async (dispatch, getState) => {
    const { calendarios } = getState().cursoLectivo

    try {
      const response = await axios.put(
        `${envVariables.BACKEND_URL}/api/Calendario`,
        data
      )
      dispatch(
        loadCalendarios({
          cL: cursoLectivoId,
          calendars: calendarios[cursoLectivoId]
            ? calendarios[cursoLectivoId].map((item) => {
              if (item.id === response.data.id) {
                return response.data
              }
              return item
            })
            : [response.data]
        })
      )
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const editCursoLectivo = (data) => async (dispatch, getState) => {
  const { cursosLectivos } = getState().cursoLectivo
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/CursosLectivos`,
      data
    )
    dispatch(
      loadCursosLectivos(
        cursosLectivos.map((item) => {
          if (item.id === response.data.id) {
            return response.data
          }
          return item
        })
      )
    )
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const changeStateCursoLectivo =
  (id, state) => async (dispatch, getState) => {
    try {
      await axios.put(
        `${envVariables.BACKEND_URL}/api/CursosLectivos/UpdateEstadoCursoLectivo/${id}/${state}`
      )
      dispatch(changeStateCursosElectivos({ id, state }))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const changeStateCursoLectivoCalendario =
  (id, state, cursoLectivoId) => async (dispatch, getState) => {
    try {
      await axios.put(
        `${envVariables.BACKEND_URL}/api/Calendario/UpdateEstadoCalendario/${id}/${state}`
      )
      dispatch(
        changeStateCursosElectivosCalendarios({ id, state, cursoLectivoId })
      )
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const deleteCursoLectivo =
  (id: number) => async (dispatch, getState) => {
    const { cursosLectivos } = getState().cursoLectivo
    try {
      const response = await axios.delete(
        `${envVariables.BACKEND_URL}/api/CursosLectivos/${id}`
      )
      dispatch(
        loadCursosLectivos(
          cursosLectivos.map((el) => {
            const _estado = el.id == id ? false : el.estado
            return { ...el, estado: _estado }
          })
        )
      )
      return { error: false }
    } catch (e) {
      return { error: e.response.data.error }
    }
  }

export const deleteCalendar =
  (id: number, cursoLectivoId) => async (dispatch, getState) => {
    const { calendarios } = getState().cursoLectivo
    try {
      const response = await axios.delete(
        `${envVariables.BACKEND_URL}/api/Calendario/${id}`
      )
      dispatch(
        loadCalendarios({
          cL: cursoLectivoId,
          calendars: calendarios[cursoLectivoId].map((el) => {
            const _estado = el.id == id ? false : el.estado
            return { ...el, estado: _estado }
          })
        })
      )
      return { error: false }
    } catch (e) {
      return { error: e.response.data.error }
    }
  }

export const setCursoLectivoActive = (item) => async (dispatch, getState) => {
  try {
    dispatch(setActive(item))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}
export const setCursoLectivoCalendarActive = (item) => async (dispatch) => {
  try {
    dispatch(setCalendarActive(item))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}
export const clearCalendarsActive = () => async (dispatch) => {
  try {
    dispatch(clearCalendarios())
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
