import types from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loading = () => ({
  type: types.LOADING_PROFESSORS
})

const getPaginate = (payload) => ({
  type: types.GET_PAGINATE_PROFESSORS,
  payload
})

const getByInstitution = (payload) => ({
  payload,
  type: types.GET_PROFESSORS_BY_INSTITUTION_ID
})

export const getPaginateProfessors = ({ page = 1, quantity = 10, filter = '' }) => async (dispatch) => {
  dispatch(loading())
  try {
    const query = `?${page ? `&Pagina=${page}` : ''}${filter ? `&Filtro=${filter}` : ''}${quantity ? `&Cantidad=${quantity}` : ''}`
    const response: any = await axios.get(`${envVariables.BACKEND_URL}/api/ProfesoresInstitucion/${query}`)
    dispatch(getPaginate(response.data?.entityList))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getProfessorsByInstitution = (
  institutionId: number,
  page: number = 0,
  size: number = 10
) => async (dispatch, getState) => {
  dispatch(loading())
  try {
    const professors = getState().profesoresInstitucion.professorsInstitution
    const response: any = await axios.get(`${envVariables.BACKEND_URL}/api/ProfesoresInstitucion/GetAllProferoserbyInstitucionId/${institutionId}/${page}/${size}`)

    dispatch(getByInstitution(page > 1 ? [...professors, ...response.data] : response.data))
    return { error: false, options: response.data }
  } catch (e) {
    return { error: e.message }
  }
}
