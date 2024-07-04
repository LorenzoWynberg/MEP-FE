import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types'
import { Dispatch } from 'redux'

const reportsLoading = () => ({
  type: types.ALERTS_REPORTS_LOADING
})

const reportsLoad = (payload) => ({
  type: types.ALERTS_REPORTS_LOAD,
  payload
})

const reportsFail = (payload) => ({
  type: types.ALERTS_REPORTS_FAIL,
  payload
})

export const getReports = (pagina: number, cantidad: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(reportsLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/AlertaReportes/${pagina}/${cantidad}`)
    dispatch(reportsLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(reportsFail(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}
