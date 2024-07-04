import {
  LOAD_STUDENT_INFORMATION_CONTACT_BY_USER,
  STUDENT_INFORMATION_CONTACT_BY_USER_CLEAN,
  UPDATE_STUDENT_INFORMATION_CONTACT_BY_USER,
  CLEAN_STUDENT_INFORMATION_CONTACT_BY_USER,
  EXPEDIENTE_CONTACTO_ERROR
} from './types'

import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

import { handleErrors } from '../../../utils/handleErrors'

const loadInformationContact = (response) => ({
  type: LOAD_STUDENT_INFORMATION_CONTACT_BY_USER,
  payload: response
})

const updateInformationContact = (response) => ({
  type: UPDATE_STUDENT_INFORMATION_CONTACT_BY_USER,
  payload: response
})

const cleanInformationContactDispatch = (response) => ({
  type: CLEAN_STUDENT_INFORMATION_CONTACT_BY_USER,
  payload: response
})

const cleanInformationContact = () => ({
  type: STUDENT_INFORMATION_CONTACT_BY_USER_CLEAN
})

const contactInformationError = (response) => ({
  type: EXPEDIENTE_CONTACTO_ERROR,
  payload: response
})

export const cleanInformationContactFromUser = () => (dispatch) => {
  dispatch(cleanInformationContact())
}

export const getInformationContactFromUser = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Contacto/${id}`
    )
    if (response.data.error) {
      return { data: { message: response.data.error.message, error: true } }
    } else {
      dispatch(loadInformationContact(response.data))
    }
  } catch (error) {
    return { data: { message: error.message, error: true } }
  }
}

export const updateInformationContactFromUser = (id, information) => async (
  dispatch
) => {
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Contacto/${id}`,
      information
    )
    if (response.data.error) {
      dispatch(contactInformationError(handleErrors(response.data.error)))
      return {
        data: {
          message: response?.data?.errors
            ? 'Faltan rellenar campos obligatorios'
            : response?.data?.error?.message,
          error: true
        }
      }
    } else {
      return dispatch(updateInformationContact(response.data))
    }
  } catch (error) {
    dispatch(contactInformationError(handleErrors(error)))
    return {
      data: {
        message: error?.response?.data?.errors
          ? 'Faltan rellenar campos obligatorios'
          : error.message,
        error: true,
        errors: error?.response?.data?.errors
      }
    }
  }
}

export const cleanFormErrors = () => async (dispatch) => {
  dispatch(cleanInformationContactDispatch())
}
