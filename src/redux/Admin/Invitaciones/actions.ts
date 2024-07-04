import {
  INVITACIONES_LOAD,
  INVITACIONES_GET_ONE,
  INVITACIONES_CLEAN,
  INVITACIONES_CLEAN_ONE,
  INVITACIONES_LOADING,
  INVITACIONES_ERROR
} from './types.ts'

import axios from 'axios'
import { envVariables } from '../../../constants/enviroment'
import { handleErrors } from '../../../utils/handleErrors'

const baseRoute = `${envVariables.BACKEND_URL}/api/Admin/Invitation`

const loadInvitaciones = (payload) => ({
  type: INVITACIONES_LOAD,
  payload
})

const getOneInvitaciones = (payload) => ({
  type: INVITACIONES_GET_ONE,
  payload
})

const cleanOneInvitaciones = (payload) => ({
  type: INVITACIONES_CLEAN_ONE,
  payload
})

const cleanInvitaciones = () => ({
  type: INVITACIONES_CLEAN
})

const loadingInvitaciones = () => ({
  type: INVITACIONES_LOADING
})

const errorInvitaciones = (payload) => ({
  type: INVITACIONES_ERROR,
  payload
})

interface PaginadoModel {
    pagina: number,
    cantidad: number,
    filterType?: string,
    searchTerm?: string
}

export const GetInvitaciones = (data: PaginadoModel) => async (dispatch) => {
  try {
    dispatch(loadingInvitaciones())
    const { pagina, cantidad } = data
    const response = await axios.get(`${baseRoute}/paginated/${pagina}/${cantidad}`)
    dispatch(loadInvitaciones(response.data))
    return { error: false }
  } catch (error) {
    dispatch(errorInvitaciones(error.message))
    return { error: true, mensaje: error.message }
  }
}

export const GetInvitacionesFiltro = (data: PaginadoModel) => async (dispatch) => {
  try {
    dispatch(loadingInvitaciones())
    const { pagina, cantidad, searchTerm } = data
    const response = await axios.get(`${baseRoute}/paginated/${pagina}/${cantidad}/${searchTerm}`)
    dispatch(loadInvitaciones(response.data))
    return { error: false }
  } catch (error) {
    dispatch(errorInvitaciones(error.message))
    return { error: true }
  }
}

export const CreateInvitation = (invitation: any) => async (dispatch) => {
  try {
    dispatch(loadingInvitaciones())
    await axios.post(`${baseRoute}`, invitation)
    dispatch(GetInvitaciones({ pagina: 1, cantidad: 10 }))
    return { error: false }
  } catch (error) {
    dispatch(errorInvitaciones(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const DeleteInvitation = (invitacionId: number) => async (dispatch) => {
  try {
    dispatch(loadingInvitaciones())
    await axios.delete(`${baseRoute}/${invitacionId}`)
    dispatch(GetInvitaciones({ pagina: 1, cantidad: 10 }))
    return { error: false }
  } catch (error) {
    dispatch(errorInvitaciones(error.message))
    return { error: true }
  }
}

export const UpdateInvitacion = (data) => async (dispatch) => {
  try {
    dispatch(loadingInvitaciones())
    await axios.put(`${baseRoute}`, data)
    return { error: false }
  } catch (error) {
    dispatch(errorInvitaciones(handleErrors(error)))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const ResendInvitation = (email: string) => async (dispatch) => {
  try {
    dispatch(loadingInvitaciones())
    await axios.post(`${baseRoute}/Resend/${email}`)
    return { error: false }
  } catch (error) {
    dispatch(errorInvitaciones(error.message))
    return { error: true }
  }
}
