import { SELECTS_LOAD_CATALOGS, SELECTS_LOAD_MULTICATALOGS } from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { catalogsEnum } from '../../utils/catalogsEnum'

const loadCatalog = (data, name) => ({
  type: SELECTS_LOAD_CATALOGS,
  payload: {
    data,
    name
  }
})

const loadMultiCatalog = (data, types) => ({
  type: SELECTS_LOAD_MULTICATALOGS,
  payload: {
    data,
    types
  }
})

export const getCatalogs = (type, page = -1, size = -1) => async (dispatch, getState) => {
  try {
    const _type = catalogsEnum.find((item) => item.id === type)
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Catalogo/GetAllByType/${type}/${page}/${size}`
    )
    if (response.data.error) {
      return response
    } else {
      dispatch(loadCatalog(response.data, _type.name))
      return response
    }
  } catch (error) {
    return { data: { message: error.message, error: true } }
  }
}

export const getCatalogsByCode = (type) => async (dispatch, getState) => {
  try {
    const _type = catalogsEnum.find((item) => item.id === type)

    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Catalogo/GetAllbyCodeType/${type}`
    )
    if (response.data.error) {
      return response
    } else {
      dispatch(loadCatalog(response.data, _type.name))
      return response
    }
  } catch (error) {
    return { data: { message: error.message, error: true } }
  }
}

export const getAllCatalogs = () => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Catalogo`)
    if (response.data.error) {
      return response
    } else {
      dispatch(loadMultiCatalog(response.data, catalogsEnum))
      return response
    }
  } catch (error) {
    return { data: { message: error.message, error: true } }
  }
}

export const getMultiCatalogs = (ids) => async (dispatch, getState) => {
  try {
    const _types = catalogsEnum.filter((item) => ids.includes(item.id))

    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/Catalogo/List`,
      ids
    )
    if (response.data.error) {
      return response
    } else {
      dispatch(loadMultiCatalog(response.data, _types))
      return response
    }
  } catch (error) {
    return { data: { message: error.message, error: true } }
  }
}

// fetch catalogs data from backend
// each type on types MUST be an item from catalogsEnumObj example catalogsEnumObj.ESTATUSMIGRATORIO
export const getCatalogsSet = (types = []) => async (dispatch, getState) => {
  const { selects } = getState()
  let successCount = 0
  for (const item of types) {
    if (!selects[item.name][0]) {
      const response = await dispatch(getCatalogs(item.id))
      if (!response.error) {
        successCount += 1
      }
    } else {
      successCount += 1
    }
  }

  return { error: successCount !== types.length }
}
