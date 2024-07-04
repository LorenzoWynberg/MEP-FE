import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import {
  THEMES_LOAD,
  THEMES_SAVE,
  THEMES_LOAD_CURRENT_THEME,
  THEMES_LOAD_UPDATED,
  THEMES_LOAD_DELETED
} from './types'

const loadThemes = (payload) => ({
  type: THEMES_LOAD,
  payload
})

const loadNewTheme = (payload) => ({
  type: THEMES_SAVE,
  payload
})

const loadTheme = (payload) => ({
  type: THEMES_LOAD_CURRENT_THEME,
  payload
})

const loadUpdatedTheme = (payload) => ({
  type: THEMES_LOAD_UPDATED,
  payload
})

const loadDeleteTheme = (payload) => ({
  type: THEMES_LOAD_DELETED,
  payload
})

export const getThemes = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Temas`)
    dispatch(loadThemes(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const getOneTheme = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Temas/${id}`)
    dispatch(loadTheme(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const saveTheme = (data, withFile = false) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Temas${withFile ? '/withFile' : ''}`, data)
    dispatch(loadNewTheme(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const updateTheme = (data, themeId, withFile = false) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Temas/${themeId}${withFile ? '/withFile' : ''}`, data)
    dispatch(loadUpdatedTheme({ data: response.data, themeId }))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const deleteTheme = (themeId) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Temas/${themeId}`)
    dispatch(loadDeleteTheme({ data: response.data, themeId }))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const cleanCurrentForm = () => (dispatch) => {
  dispatch(loadTheme({}))
}
