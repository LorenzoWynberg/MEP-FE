import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
// import { configureStore } from './redux/store'
import Preloader from './helpers/Preloader'
import App from './App'
import axios from 'axios'
import { envVariables } from './constants/enviroment'
import moment from 'moment'
import StoreConfigurator from './redux/StoreConfigurator'
// configureStore()
import { createRoot } from 'react-dom/client'
const store = StoreConfigurator.getStore()

axios.interceptors.request.use((config) => {
  const { authObject, currentInstitution, currentRoleOrganizacion, selectedActiveYear } =
    store.getState().authUser
  const token = authObject.user.token

  const activeYearId = selectedActiveYear?.id  // Anio seleccionado
  const esActivoYear = selectedActiveYear?.esActivo
  const expiration = authObject.user.expiration

  if (expiration && moment().diff(expiration, 'seconds') >= 0) {
    sessionStorage.clear()
    localStorage.clear()
    window.location.reload()
  }

  config.headers.common.Authorization = token ? ` Bearer ${token}` : ''
  config.headers.common['Accept-Language'] = `${
    localStorage.getItem('locale') || envVariables.DEFAULT_LOCALE
  }`

  config.headers.common['organizacion-seleccionada'] =
    currentRoleOrganizacion.accessRole.organizacionId || currentInstitution?.id
  config.headers.common['rol-seleccionado'] =
    currentRoleOrganizacion.accessRole.rolId
  config.headers.common['nivel-acceso'] =
    currentRoleOrganizacion.accessRole.nivelAccesoId
    config.headers.common['anio-seleccionado'] = activeYearId
    config.headers.common['anio-seleccionado-esActivo'] = esActivoYear
  
  return config
})
;(async function () {
  await Preloader(store)
  const container = document.getElementById('root')
  const root = createRoot(container) // createRoot(container!) if you use TypeScript

  root.render(
    <Provider store={store}>
      <Suspense fallback={<div className='loading' />}>
        <App />
      </Suspense>
    </Provider>
  )
})()

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */

serviceWorker.unregister()
