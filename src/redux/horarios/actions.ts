import types from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loading = () => ({
  type: types.LOADING_SCHEDULES
})

const add = (payload) => ({
  type: types.ADD_SCHEDULE,
  payload
})

const update = (payload) => ({
  type: types.UPDATE_SCHEDULE,
  payload
})

const remove = (payload) => ({
  type: types.DELETE_SCHEDULE,
  payload
})

const getSchedule = (payload) => ({
  type: types.GET_SINGLE_SCHEDULE,
  payload
})

const getAll = (payload) => ({
  type: types.GET_ALL_SCHEDULES,
  payload
})

const setCurrent = (payload) => ({
  type: types.SET_CURRENT_SCHEDULE,
  payload
})

interface Schedule {
  id?: number;
  finDeSemana: boolean;
  ofertasPorInstitucionalidadId: number;
}

export const getSingleSchedule = (id: string) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Horario/${id}`)
    dispatch(getSchedule(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const addSchedule = (schedule: Schedule) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Horario/`, schedule)
    dispatch(add(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateSchedule = (schedule: Schedule) => async (dispatch, getState) => {
  dispatch(loading())
  try {
    if (schedule?.id) {
      delete schedule?.id
    }
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Horario/${getState()?.horarios?.currentSchedule?.id}`, schedule)
    dispatch(update(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteSchedule = (id: string) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Horario/${id}`)
    dispatch(remove(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllSchedules = () => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Horario/getAll`)
    dispatch(getAll(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const setCurrentSchedule = (schedule) => async (dispatch) => {
  dispatch(setCurrent(schedule))
}
