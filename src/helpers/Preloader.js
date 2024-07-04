import axios from 'axios'
import { envVariables } from '../constants/enviroment'
import { ROLES_LOAD } from '../redux/roles/rolesTypes'
import {
  logoutCurrentUser,
  getUserInstitutions,
  handleChangeRole,
  setUserInstitution
  ,
  getRoles,
  getUserData,
  handleChangeInstitution,
  updatePeriodosLectivos
} from '../redux/auth/actions.ts'
import {
  SERVER_ERROR,
  AUTH_TOKEN_STORAGE,
  GET_ROLE,
  LOAD_ACCESS_ROLES
} from '../redux/actions'

import { ID_TYPES_LOAD } from '../redux/idTypes/types'
import { PROVINCIAS_LOAD } from '../redux/provincias/types'
import { getCatalogs } from '../redux/selects/actions'

import { catalogsEnumObj } from '../utils/catalogsEnum'

export default async (store) => {
  try {
    const selectedInstitution = localStorage.getItem(
      'selectedRolInstitution'
    )

    const { authObject } = store.getState().authUser
    const token = authObject.user && authObject.user.token
    const tokenStorage = localStorage.getItem('persist:auth-accessToken')
    const expirationStorage = localStorage.getItem('persist:expiration')
    const rol = parseInt(localStorage.getItem('persist:auth-rolId'))
    const user = tokenStorage || token
    const userId = localStorage.getItem('persist:uid')

    const userName = localStorage.getItem('persist:u')
    const nombre = localStorage.getItem('persist:uNombre')
    const primerApellido = localStorage.getItem('persist:uPrimerApellido')
    const segundoApellido = localStorage.getItem('persist:uSegundoApellido')

    if (userId) {
      store.dispatch(getRoles(userId))
      store.dispatch(getUserData(userId))
    }

    if (tokenStorage) {
      store.dispatch({
        type: AUTH_TOKEN_STORAGE,
        payload: {
          token: tokenStorage,
          rolId: rol,
          expiration: expirationStorage,
          userName,
          nombre,
          primerApellido,
          segundoApellido
        }
      })
    }

    if (user) {
      getUserRole(store)
    }

    getNationalities(store)
    getIdentificationes(store)
    getSexo(store)
    getGenero(store)

    await getProvinces(store)
    const accessRole = await axios.get(
      `${envVariables.BACKEND_URL}/api/Authentication/Usuario/RolesOrganizacion`
    )
    store.dispatch(getUserInstitutions())
    store.dispatch({
      type: LOAD_ACCESS_ROLES,
      payload: accessRole.data
    })
    store.dispatch(handleChangeRole(accessRole.data[0]))
    const tiposID = await axios.get(
      `${envVariables.BACKEND_URL}/api/Catalogo/GetAllbyType/1/-1/-1`
    )
    const roles = await axios.get(
      `${envVariables.BACKEND_URL}/api/Admin/Roles`
    )

    store.dispatch({
      type: ID_TYPES_LOAD,
      payload: tiposID
    })

    store.dispatch({
      type: ROLES_LOAD,
      payload: roles.data
    })

    if (selectedInstitution) {

      const _parsedInstitution = JSON.parse(selectedInstitution)
      await store.dispatch(
        handleChangeInstitution(_parsedInstitution.institucionId)
      )
      await store.dispatch(
        setUserInstitution(_parsedInstitution.institutionObject)
      )
      await store.dispatch(
        updatePeriodosLectivos(_parsedInstitution.institucionId)
      )
    }
  } catch (e) {
    const selectedInstitution = localStorage.getItem('selectedInstitution')

    if (selectedInstitution) {
      const _parsedInstitution = JSON.parse(selectedInstitution)
      await store.dispatch(
        handleChangeInstitution(_parsedInstitution.institucionId)
      )
      await store.dispatch(
        updatePeriodosLectivos(_parsedInstitution.institucionId)
      )
    }
    store.dispatch({
      type: SERVER_ERROR,
      payload: e
    })
  }
}

const getProvinces = async (store) => {
  const response = await axios.get(
    `${envVariables.BACKEND_URL}/api/Provincia`
  )
  store.dispatch({
    type: PROVINCIAS_LOAD,
    payload: response.data
  })
}

const getNationalities = async (store) => {
  await store.dispatch(getCatalogs(catalogsEnumObj.NATIONALITIES.id))
}

const getIdentificationes = async (store) => {
  await store.dispatch(getCatalogs(catalogsEnumObj.IDENTIFICATION.id))
}

const getSexo = async (store) => {
  await store.dispatch(getCatalogs(catalogsEnumObj.SEXO.id))
}

const getGenero = async (store) => {
  await store.dispatch(getCatalogs(catalogsEnumObj.GENERO.id))
}

const getUserRole = async (store) => {
  try {
    const id = localStorage.getItem('persist:auth-id')
    // const role = await axios.get(`${envVariables.BACKEND_URL}/api/users/${id}/roles/`)
    store.dispatch({
      type: GET_ROLE,
      payload: [{ id: 1, nombre: 'ADMIN' }]
    })
  } catch (error) {
    logoutCurrentUser()
  }
}
