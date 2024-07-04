import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types.ts'

const baseRoute = `${envVariables.BACKEND_URL}/api/Admin/Users`

const loading = () => ({
  type: types.USERS_LOADING
})

const loadUsers = (payload: any) => ({
  type: types.USERS_LOAD,
  payload
})

const UsersFailed = (payload: any) => ({
  type: types.USERS_FAILED,
  payload
})

const getDataFilter = (response) => ({
  type: types.USERS_FILTER,
  payload: response
})

const clearUsers = () => ({
  type: types.USERS_CLEAR
})

const changeColumnSearch = (response) => ({
  type: types.CHANGE_COLUMN,
  payload: response
})

const changeFilterOptionSearch = (response) => ({
  type: types.CHANGE_FILTER_OPTION,
  payload: response
})

export const getUsersByFilter = (pagina: number, cantidad: number, filterText: string) => async (dispatch) => {
  try {
    dispatch(loading())
    const response = await axios.get(`${baseRoute}/paginated/${pagina}/${cantidad}/${filterText}`)
    dispatch(loadUsers(response.data))
    return { error: false }
  } catch (error) {
    dispatch(UsersFailed(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const updateUser = (data: any) => async (dispatch) => {
  try {
    dispatch(loading())
    const response = await axios.put(`${baseRoute}`, data)
    await dispatch(getUsersByFilter(1, 10, data.nombre))
    return { error: false }
  } catch (error) {
    dispatch(UsersFailed(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const clearUsersFilter = () => (dispatch) => {
  dispatch(clearUsers())
}

export const changeColumn = (data) => (dispatch) => {
  dispatch(changeColumnSearch(data))
}

export const changeFilterOption = (data) => (dispatch) => {
  dispatch(changeFilterOptionSearch(data))
}
