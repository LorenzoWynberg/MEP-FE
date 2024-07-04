import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import AppLocale from './lang'
import ColorSwitcher from './components/common/ColorSwitcher'
import NotificationContainer from './components/common/react-notifications/NotificationContainer'
import { envVariables } from './constants/enviroment'
import { getDirection } from './helpers/Utils'
import { routes } from './utils/router.ts'
import AuthRoute from './views/AuthRoute'
import 'react-datetime/css/react-datetime.css'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { verificarAcceso } from './Hoc/verificarAcceso'
import SimpleModal from 'Components/Modal/simple'
import colors from 'Assets/js/colors'
const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views')
)
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
)
const ViewErrorSaber = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/ErrorSaber')
)
const Counter = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/app/Countdown')
)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openCensoModal: false
    }
  }

  componentDidMount() {
    const direction = getDirection()
    if (direction.isRtl) {
      document.body.classList.add('rtl')
      document.body.classList.remove('ltr')
    } else {
      document.body.classList.add('ltr')
      document.body.classList.remove('rtl')
    }
    this.addBeforeUnloadListener()
    const censoModalWasShown = localStorage.getItem('censoModalWasShown')
    this.setState({
      openCensoModal: !censoModalWasShown
    })
  }

  componentDidUpdate(prevProps, prevState) {
    this.addBeforeUnloadListener()
    if (prevProps?.showCensoModal !== this.props.showCensoModal) {
      const censoModalWasShown =
        localStorage.getItem('censoModalWasShown')
      this.setState({
        openCensoModal: !censoModalWasShown
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', function () {
      window.removeEventListener('beforeunload', function () {
        localStorage.removeItem('persist:auth-accessToken')
        localStorage.removeItem('persist:expiration')
      })
    })
  }

  addBeforeUnloadListener() {
    const $this = this
    const user = $this.props.loginUser.user.id
    if (user) {
      $this.props.getRole(localStorage.getItem('persist:auth-id'))
    }
    window.addEventListener('beforeunload', function () {
      const token = $this.props.loginUser.user.token
      const rol = parseInt($this.props.loginUser.user.rolId)
      localStorage.setItem('persist:auth-accessToken', token)
      localStorage.setItem('persist:auth-rolId', rol)
      localStorage.setItem(
        'persist:expiration',
        $this.props.loginUser.user.expiration
      )
    })
  }

  
  render() {
    const { locale, loginUser } = this.props
    const currentAppLocale = AppLocale[locale]

    const materialUITheme = createTheme({
      palette: {
        primary: {
          main: this.props.tema.primary
        }
      }
    })

    return (
      <ThemeProvider theme={materialUITheme}>
        <StyledComponentThemeProvider theme={{ ...this.props.tema, primary: colors.getColor() }}>
          {/* <LayoutCSS> */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <IntlProvider
              locale={currentAppLocale.locale}
              messages={currentAppLocale.messages}
            >
              <>
                <NotificationContainer />
                {envVariables.IS_MULTICOLOR_ACTIVE && <ColorSwitcher />}
                <SimpleModal
                  openDialog={this.state.openCensoModal && this.props.showCensoModal}
                  msg='El censo inicial 2022 ha concluido, todos los datos que se registren a partir del 1 de abril de 2022, ya no contabilizan para la información del censo, la plataforma seguirá abierta para realizas sus gestiones, pero no afectará los datos que ya se encuentran siendo procesados por el Departamento de análisis estadístico. Le recordamos que ya está abierta la funcionalidad de gestión de cuentas de correo de los estudiantes, desde la ficha informativa'
                  actions={false}
                  onClose={() => {
                    localStorage.setItem('censoModalWasShown', true)
                    this.setState({
                      openCensoModal: false
                    })
                  }}
                />
                <Suspense fallback={<div className='loading' />}>
                  <Router>
                    <Switch>
                      {routes.map((route, i) => {
                        const componentProps = route.routeProps
                          ? route.routeProps
                          : {}
                        let returnRoute = null
                        const hasAccess = this.props.verificarAcceso(route.section, 'leer')
                        if (this.props.permisos.length > 0) {
                          if (route.section && !hasAccess) {
                            return (
                              <Route
                                path={route.route}
                                render={(props) => <ViewErrorSaber {...props} title='MODULO NO AUTORIZADO' message='Lo sentimos, el módulo al que acaba de ingresar no se encuentra autorizado para su perfil. Si cree que esto es un error por favor contacte a la mesa de soporte.' />}
                              />
                            )
                          }
                        }
                        //   if (route.section?.includes('direcciones')) {
                        // 	debugger
                        //   }
                        if (route.isAuthenticated) {
                          returnRoute = (
                            <AuthRoute
                              key={i}
                              path={route.route}
                              exact={route.exact}
                              authUser={loginUser}
                              component={route.component}
                              componentProps={{
                                ...componentProps,
                                hasEditAccess: this.props.verificarAcceso(route.section, 'modificar'),
                                hasAddAccess: this.props.verificarAcceso(route.section, 'agregar'),
                                hasDeleteAccess: this.props.verificarAcceso(route.section, 'eliminar')
                              }}
                            />
                          )
                        } else {
                          returnRoute = (
                            <Route
                              key={i}
                              path={route.route}
                              exact={route.exact}
                              render={(props) => (
                                <route.component
                                  {...props}
                                  {...componentProps}
                                />
                              )}
                            />
                          )
                        }
                        return returnRoute
                      })}
                      <Route
                        path='/user'
                        render={(props) => <ViewUser {...props} />}
                      />
                      <Route
                        path='/error'
                        exact
                        render={(props) => <ViewErrorSaber {...props} />}
                      />
                      <Route
                        path='/director/error'
                        exact
                        render={(props) => <ViewErrorSaber {...props} />}
                      />
                      <Route
                        path='/counter'
                        render={(props) => <Counter {...props} />}
                      />
                      <Route
                        path='/'
                        exact
                        render={(props) => <ViewMain {...props} />}
                      />
                      {/* <Redirect to="error" /> */}
                      <Route render={(props) => <ViewErrorSaber {...props} />} />
                    </Switch>
                  </Router>
                </Suspense>
              </>
            </IntlProvider>
          </MuiPickersUtilsProvider>
          
        </StyledComponentThemeProvider>
      </ThemeProvider>
    )
  }
}

const mapStateToProps = ({ authUser, settings, roles, tema }) => {
  const { authObject: loginUser, currentRoleOrganizacion } = authUser
  const { locale } = settings
  return {
    tema,
    loginUser,
    locale,
    ...roles,
    permisos: authUser.rolPermisos,
    accessRole: authUser?.currentRoleOrganizacion?.accessRole,
    showCensoModal: authUser?.showCensoModal
  }
}

const mapActionsToProps = {}

export default connect(mapStateToProps, mapActionsToProps)(verificarAcceso(App))
