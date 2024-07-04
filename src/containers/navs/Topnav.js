import '../../assets/css/sass/containerStyles/Comunicado.scss'

import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from '@microsoft/signalr'
import colors from 'Assets/js/colors'
import SimpleModal from 'Components/Modal/simple'
import SessionExpired from 'Components/SessionExpired'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  UncontrolledDropdown
} from 'reactstrap'

import ChangePasswordForm from '../../components/ChangePasswordForm'
import { Separator } from '../../components/common/CustomBootstrap'
import { MenuIcon, MobileMenuIcon } from '../../components/svg'
import { envVariables } from '../../constants/enviroment'
import IntlMessages from '../../helpers/IntlMessages'
import Notification from '../../notifications'
import {
  changeLocale,
  clickOnMobileMenu,
  getActiveYears,
  logoutCurrentUser,
  setContainerClassnames,
  setSelectedActiveYear
} from '../../redux/actions'
import {
  changePasswordbyCurrentUser,
  handleChangeRole,
  setUserInstitution
} from '../../redux/auth/actions.ts'
import { getRealtimeComunicados } from '../../redux/comunicados/actions'
import {
  GetComunicadosPaginados,
  MarcarComoLeidos
} from '../../redux/notificaciones/actions'
import InstitutionSwitch from './InstitutionSwitch'
import { OutlinedSelect, OutlinedReactSelect } from '../../components/CommonComponents'
import styled from 'styled-components'
import StoreConfigurator from '../../redux/StoreConfigurator'
import { toggleMenuState } from '../../redux/menu/actions'

import { withTranslation } from 'react-i18next'
import { LanguageSelector, AnioEducativoSelect } from 'Components/CommonComponents'

import FormulariosIcon from '../../components/svg/Formularios'
import ComunicadosIcon from '../../components/svg/Comunicados'
import { Popover, withStyles } from '@material-ui/core'

const StyledPopover = withStyles({
  paper: {
    borderRadius: '15px',
    border: '1px solid grey',

  },

})(Popover)

class TopNav extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchKeyword: '',
      modalOpen: false,
      open: false,
      variant: 'info',
      anchorEl: null,
      data: [],
      connection: HubConnection
    }
  }

  componentDidMount = async () => {
    this.cargarNotificaciones()
    this.props.getActiveYears()
    this.loadNotification()
  }

  handleClickMessageParent(item) {
    this.marcarComoLeido(item)
  }

  hanbleClickReadAll(data) {
    this.marcarTodoLeido(data)
  }

  loadNotification() {
    const connect = new HubConnectionBuilder()
      .withUrl(envVariables.BACKEND_URL + '/hubs/notificaciones', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Debug)
      .withAutomaticReconnect()
      .build()
    this.setState({ connection: connect })
    const self = this
    if (connect) {
      const connetionNotificationOn =
        'RecibirNotificacion-' + localStorage.getItem('persist:uid')
      connect.on(connetionNotificationOn, (data) => {
        self.setState({
          data: [
            ...self.state.data,
            {
              update: data.titulo,
              timestamp: data.fechaHora,
              id: data.id
            }
          ]
        })
      })

      const connetionOn =
        'RecibirComunicado-' + localStorage.getItem('persist:uid')
      connect.on(connetionOn, (message) => {
        this.props.getRealtimeComunicados(message)
      })

      connect
        .start()
        .catch((err) =>
          console.log('Error while starting connection: ' + err)
        )
    }
  }

  cargarNotificaciones = async () => {
    const noti = await this.props.GetComunicadosPaginados()
    const data = Array.isArray(noti.data)
      ? noti.data.map((item) => {
        const fecha = item.fechaHora
        const newF = new Date(fecha).valueOf()
        const mensaje = {
          update: item.titulo,
          timestamp: item.fechaHora,
          id: item.id
        }
        return mensaje
      })
      : []
    this.setState({ data })
  }

  marcarComoLeido = async (item) => {
    const _leido = await this.props.MarcarComoLeidos({ id: item.id })
    if (!_leido.error) {
      await this.cargarNotificaciones()
    }
  }

  marcarTodoLeido = async (data) => {
    data.forEach(async (element) => {
      const _leido = await this.props.MarcarComoLeidos({ id: element.id })
      if (!_leido.error) {
        await this.cargarNotificaciones()
      }
    })
  }

  handleSearchIconClick = (e) => {
    if (window.innerWidth < envVariables.MENU_HIDDEN_BREAKPOINT) {
      let elem = e.target
      if (!e.target.classList.contains('search')) {
        if (e.target.parentElement.classList.contains('search')) {
          elem = e.target.parentElement
        } else if (
          e.target.parentElement.parentElement.classList.contains(
            'search'
          )
        ) {
          elem = e.target.parentElement.parentElement
        }
      }

      if (elem.classList.contains('mobile-view')) {
        this.search()
        elem.classList.remove('mobile-view')
        this.removeEventsSearch()
      } else {
        elem.classList.add('mobile-view')
        this.addEventsSearch()
      }
    } else {
      this.search()
    }
  }

  addEventsSearch = () => {
    document.addEventListener('click', this.handleDocumentClickSearch, true)
  }

  removeEventsSearch = () => {
    document.removeEventListener(
      'click',
      this.handleDocumentClickSearch,
      true
    )
  }

  handleDocumentClickSearch = (e) => {
    let isSearchClick = false
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('navbar') ||
        e.target.classList.contains('simple-icon-magnifier'))
    ) {
      isSearchClick = true
      if (e.target.classList.contains('simple-icon-magnifier')) {
        this.search()
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains('search')
    ) {
      isSearchClick = true
    }

    if (!isSearchClick) {
      const input = document.querySelector('.mobile-view')
      if (input && input.classList) input.classList.remove('mobile-view')
      this.removeEventsSearch()
      this.setState({
        searchKeyword: ''
      })
    }
  }

  handleSearchInputChange = (e) => {
    this.setState({
      searchKeyword: e.target.value
    })
  }

  handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.search()
    }
  }

  search = () => {
    this.props.history.push(
      envVariables.SEARCH_PATH + '/' + this.state.searchKeyword
    )
    this.setState({
      searchKeyword: ''
    })
  }

  toEditUser = (id) => {
    this.props.history.push(`/user/edit/${id}`)
  }

  handleLogout = () => {
    this.props.logoutCurrentUser(this.props.history)
  }

  menuButtonClick = (
    e,
    menuClickCount,
    containerClassnames,
    isComunicado
  ) => {
    /* e.preventDefault()
    const store = StoreConfigurator.getStore()
    store.dispatch(toggleMenuState()) */
    e.preventDefault()
    setTimeout(() => {
      const event = document.createEvent('HTMLEvents')
      event.initEvent('resize', false, false)
      window.dispatchEvent(event)
    }, 350)

    this.props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.props.selectedMenuHasSubItems
    )

    if (isComunicado !== undefined) {
      if (containerClassnames === 'menu-sub-hidden') {
        document.getElementsByClassName('main-menu')[0].style.transform =
          'translateX(-250px)'
      } else {
        document.getElementsByClassName('main-menu')[0].style.transform =
          'translateX(0px)'
      }
    }
  }

  mobileMenuButtonClick = (e, containerClassnames, isComunicado) => {
    this.props.clickOnMobileMenu(containerClassnames)
    if (isComunicado !== undefined) {
      if (containerClassnames === 'menu-sub-hidden menu-mobile') {
        document.getElementsByClassName(
          'main-menu'
        )[0].style.transform = 'translateX(-250px)'
      } else {
        document.getElementsByClassName(
          'main-menu'
        )[0].style.transform = 'translateX(0px)'
      }
    }
  }

  snackBarController(variant, msg, change = false) {
    this.setState({
      open: !this.state.open,
      variant,
      msg
    })
  }

  setModalOpen(value) {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  snackBarController = this.snackBarController.bind(this)
  setModalOpen = this.setModalOpen.bind(this)

  openApplications(e) {
    this.setState({ anchorEl: e.currentTarget })
  }

  closeApplications() {
    this.setState({ anchorEl: null })
  }

  openApplications = this.openApplications.bind(this)
  closeApplications = this.closeApplications.bind(this)

  render() {
    const {
      containerClassnames,
      menuClickCount,
      locale,
      iconMenu,
      authObject,
      isComunicado,
      activeYears,
      selectedActiveYear
    } = this.props
    const token = authObject.user.token
    const { data } = this.state
    const isEncargadoOrEstudiante =
      authObject.user.rolesOrganizaciones.find(
        (rol) =>
          rol.rolNombre.toLowerCase() === 'estudiante' ||
          rol.rolNombre.toLowerCase() === 'encargado'
      )

    const institutionsArray = isEncargadoOrEstudiante
      ? ''
      : authObject.user.rolesOrganizaciones.map((el) => {
        const institution = authObject.user.instituciones.find(
          (item) => item.id === parseInt(el.organizacionId)
        )
        return { ...el, institutionObject: institution }
      })

    return (
      <div>
        <Helmet htmlAttributes={{ lang: locale }} />
        {this.props.serverUnauthorized && (
          <SessionExpired onConfirm={this.handleLogout.bind(this)} />
        )}
        <nav
          className='navbar fixed-top'
          style={{
            minHeight: this.props.isComunicado ? '150px' : '',
            height: this.props.isComunicado ? 'auto' : '',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: this.props.currentInstitution?.id > 0 ? 'flex-start' : '',
            padding: '1.2rem 2rem',
          }}
        >
          <div className={`d-flex align-items-center ${this.props.isComunicado ? '' : 'navbar-left'}`}>
            {iconMenu && (
              <NavLink
                to='#'
                className='menu-button d-none d-md-block'
                style={{
                  width: 'auto',
                  margin: '0 2rem 0 0'
                }}
                onClick={(e) =>
                  this.menuButtonClick(
                    e,
                    menuClickCount,
                    containerClassnames,
                    isComunicado
                  )}
              >
                <MenuIcon />
              </NavLink>
            )}
            {iconMenu && (
              <NavLink
                to='#'
                className='menu-button-mobile d-xs-block d-sm-block d-md-none'
                onClick={(e) =>
                  this.mobileMenuButtonClick(
                    e,
                    containerClassnames,
                    isComunicado
                  )}
              >
                <MobileMenuIcon />
              </NavLink>
            )}

            <div className='d-inline-block'>
              {/* SE ESTA COMENTANDO ESTE CODIGO PARA LA FASE DE REGISTRO,
              CUANDO SALGAMOS DE ELLA, VA A SER RELEVANTE DE NUEVO. */}
              {/* ========================= */}
              {!true && (
                <UncontrolledDropdown className='ml-2'>
                  <DropdownToggle
                    caret
                    color='light'
                    size='sm'
                    className='language-button'
                  >
                    <span className='name'>
                      {locale.toUpperCase()}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu className='mt-3' right>
                    {envVariables.LOCALE_OPTIONS.map(
                      (l) => {
                        return (
                          <DropdownItem
                            onClick={() =>
                              this.handleChangeLocale(
                                l.id,
                                l.direction
                              )}
                            key={l.id}
                          >
                            {l.name}
                          </DropdownItem>
                        )
                      }
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
              {/* ========================= */}
            </div>
            <div className='d-inline-block'>
              <div style={{ display: 'flex' }}>
                <AnioEducativoSelect />
                <LanguageSelector />
              </div>
              {/* {!this.props.isComunicado && activeYears.length > 0 && (
                <UncontrolledDropdown className="ml-2">
                  {activeYears.length < 1 ? (
                    <div
                      className="institutions-button"
                      style={{
                        minWidth: '170px',
                        whiteSpace: 'unset',
                        borderRadius: '35px',
                        textAlign: 'center',
                      }}
                    >
                      <span className="name">
                        Año educativo {selectedActiveYear.nombre}
                      </span>
                    </div>
                  ) : (
                    <DropdownToggle
                      caret
                      color="primary"
                      size="sm"
                      style={{
                        minWidth: '170px',
                        whiteSpace: 'unset',
                      }}
                    >
                      <span className="name">
                        Año educativo {selectedActiveYear.nombre}
                      </span>
                    </DropdownToggle>
                  )}
                  <DropdownMenu className="mt-3" right>
                    {activeYears.map((year) => {
                      return (
                        <DropdownItem
                          onClick={() => {
                            this.props.setSelectedActiveYear(year)
                          }}
                          key={year.id}
                        >
                          {`Año educativo ${year.nombre}`}
                        </DropdownItem>
                      )
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
              )} */}
              {JSON.parse(
                sessionStorage.getItem('adminHasAcces')
              ) && (
                  <Button
                    color='primary'
                    onClick={async () => {
                      await this.props.impersonarInstitución()
                      this.props.history.push('/app/admin')
                    }}
                  >
                    Dejar de ver institución
                  </Button>
                )}
            </div>

            {/* {this.props.isComunicado && (
              <div
                className='d-inline-block'
                id='container-search'
              >
                <i
                  className='fas fa-search'
                  style={{
									  position: 'relative',
									  fontSize: 16,
									  top: 13,
									  left: 25,
									  color: '#7f878e'
                  }}
                />
                <Input
                  id='txtSearch'
                  type='text'
                  name='txtSearch'
                  onKeyPress={this.props.onKeyPress}
                  onChange={this.props.onChangeInput}
                  placeholder='Buscar correo'
                  style={{
									  paddingLeft: 35,
									  background: '#f3f3f3',
									  border: 'none'
                  }}
                  value={this.props.textoFiltro}
                />
              </div>
            )} */}
          </div>
          {/* {this.props.isComunicado && (
              <a
                className='navbar-logo l-Logo'
                style={{
                  width: '150px',
                  position: 'relative',
                  margin: 0,
                  float: 'left'
                }}
                href='/'
              >
                <span className='logo d-none d-xs-block' />
                <span className='logo-mobile d-block d-xs-none' />
              </a>
            )} */}
          {this.props.isComunicado && (
            <a
              className='navbar-logo l-Logo'
              style={{
                width: '150px',
                position: 'relative',
                margin: 0,
                float: 'left'
              }}
              href='/'
            >
              <>
                <span className='logo-saber d-none d-xs-block' />
                <span className='logo-mobile-saber d-block d-xs-none' />
              </>
            </a>
          )}
          {!this.props.isComunicado && (
            <a
              className='navbar-logo l-Logo'
              href='/'
              style={{
                width: '150px',
                position: 'relative',
                margin: 0,
                float: 'left'
              }}
            >
              <>
                <span className='logo-saber d-none d-xs-block' />
                <span className='logo-mobile-saber d-block d-xs-none' />
              </>
            </a>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                alignContent: 'center'
              }}
            >
              {/* <NotifyMe
                  data={data}
                  storageKey="notific_key"
                  notific_key="timestamp"
                  notific_value="update"
                  heading="Notificaciones"
                  sortedByKey={false}
                  showDate={false}
                  size={20}
                  color="#145388"
                  handleClickMessage={(item) =>
                    this.handleClickMessageParent(item)
                  }
                  markAsReadFn={(data) => this.hanbleClickReadAll(data)}
                /> */}

              {/* Boton de comunicados */}
              {/* <i
                className="simple-icon-grid cursor-pointer"
                style={{
                  fontSize: '20px',
                  color: colors.primary,
                  marginRight: "15px"
                }}
                
                  onClick={this.openApplications}
              /> */}
              <StyledPopover
                id="mouse-over-popover"
                open={Boolean(this.state.anchorEl)}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                
                onClose={this.closeApplications}
                disableRestoreFocus
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <div class="addTop" align="center">
                  <div
                    style={{
                      display: 'flex',
                      padding: '0.5rem',
                      fontSize: '12px',
                    }}
                  >
                    {
                      <ModuleIconContainer
                      
                        onClick={() => {
                          if (
                            window.location.href
                              .toString()
                              .indexOf('#/comunicados') == -1
                          ) {
                            const url = `#/comunicados/recibidos`
                            window.open(url)
                          } else {
                            window.location.reload()
                          }
                        }}
                      >
                        <ComunicadosIcon />
                        <span>Comunicados</span>
                        
                      </ModuleIconContainer>
                    }
                    <ModuleIconContainer
                      onClick={() => {
                        if (
                          window.location.href.toString().indexOf('#/forms') == -1
                        ) {
                          const url = `#/forms`
                          window.open(url)
                        } else {
                          window.location.reload()
                        }
                      }}
                    >
                      <FormulariosIcon />
                      <span>Formularios</span>
                    </ModuleIconContainer>
                  </div>
                </div>
              </StyledPopover>
              {authObject.user.rolesOrganizaciones.length > 0 &&
                this.props.currentInstitution && (
                  <UncontrolledDropdown className='ml-2'>
                    {authObject.user.rolesOrganizaciones
                      .length < 2
                      ? (
                        <UserDiv>
                          <span className='name'>
                            {isEncargadoOrEstudiante
                              ? isEncargadoOrEstudiante.rolNombre
                              : this.props
                                .currentRoleOrganizacion
                                .accessRole
                                .rolNombre &&
                              `${this.props
                                .currentRoleOrganizacion
                                .accessRole
                                .rolNombre
                              } ${this.props
                                .currentRoleOrganizacion
                                .accessRole
                                .nivelAccesoId >
                                1
                                ? this.props
                                  .currentRoleOrganizacion
                                  .accessRole
                                  .organizacionNombre ===
                                  null
                                  ? ''
                                  : ' - ' +
                                  this
                                    .props
                                    .currentRoleOrganizacion
                                    .accessRole
                                    .organizacionNombre
                                : this.props
                                  .currentInstitution
                                  ?.codigo +
                                ' - ' +
                                this.props.currentInstitution?.nombre?.toUpperCase()
                              }`}
                          </span>
                        </UserDiv>
                      )
                      : (
                        <DropdownToggle
                          caret
                          color='light'
                          size='sm'
                          className='language-button'
                          style={{
                            minWidth: '170px',
                            whiteSpace: 'unset'
                          }}
                          disabled={
                            authObject.user
                              .rolesOrganizaciones
                              .length < 2
                          }
                        >
                          <span className='name'>
                            {isEncargadoOrEstudiante
                              ? isEncargadoOrEstudiante.rolNombre
                              : this.props
                                .currentRoleOrganizacion
                                .accessRole
                                .rolNombre &&
                              `${this.props
                                .currentRoleOrganizacion
                                .accessRole
                                .rolNombre
                              } ${this.props
                                .currentRoleOrganizacion
                                .accessRole
                                .nivelAccesoId >
                                1
                                ? this.props
                                  .currentRoleOrganizacion
                                  .accessRole
                                  .organizacionNombre ===
                                  null
                                  ? ''
                                  : ' - ' +
                                  this
                                    .props
                                    .currentRoleOrganizacion
                                    .accessRole
                                    .organizacionNombre
                                : this.props
                                  .currentInstitution
                                  ?.codigo +
                                ' - ' +
                                this.props.currentInstitution.nombre?.toUpperCase()
                              } 
                              `}
                          </span>
                        </DropdownToggle>
                      )}

                    <DropdownMenu className='mt-3' right>
                      {institutionsArray &&
                        institutionsArray.map(
                          (role) => {
                            return (
                              <DropdownItem
                                onClick={() => {
                                  localStorage.setItem(
                                    'selectedRolInstitution',
                                    JSON.stringify(
                                      role
                                    )
                                  )
                                  this.props.handleChangeRole(
                                    role
                                  )
                                  this.props.setUserInstitution(
                                    role.institutionObject,
                                    true
                                  )
                                }}
                                key={role.rolId}
                              >
                                {!isEncargadoOrEstudiante
                                  ? `${role.rolNombre
                                  } ${role.organizacionNombre?.toUpperCase() ===
                                    undefined
                                    ? ''
                                    : ' - ' +
                                    role.organizacionNombre?.toUpperCase()
                                  }`
                                  : `${role.rolNombre
                                  } - ${role
                                    .institutionObject
                                    ?.codigo
                                  } - ${role.institutionObject?.nombre.toUpperCase()}`}
                              </DropdownItem>
                            )
                          }
                        )}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}
              <div className='user'>
                <UncontrolledDropdown className='dropdown-menu-right'>
                  <DropdownToggle
                    className='p-0'
                    color='empty'
                  >
                    <span className='name mr-1'>
                      {this.props.userEmail}
                    </span>
                    <span>
                      <img
                        alt='Profile'
                        src='/assets/img/profile-pic-generic.png'
                      />
                    </span>
                  </DropdownToggle>
                  <DropdownMenu className='mt-3' right>
                    {authObject.userData.identidad
                      ?.identificacion && (
                        <>
                          <DropdownItem
                            className='cursor-pointer'
                            onClick={() =>
                              this.toEditUser(
                                authObject.userData
                                  .identidad
                                  ?.identificacion
                              )}
                          >
                            Perfil
                          </DropdownItem>
                          <Separator />
                        </>
                      )}
                    <DropdownItem
                      className='cursor-pointer'
                      onClick={() => this.setModalOpen()}
                    >
                      <IntlMessages id='user.changePassword' />
                    </DropdownItem>
                    <DropdownItem
                      className='cursor-pointer'
                      onClick={() => {

                        this.handleLogout()
                      }}
                    >
                      <IntlMessages id='user.logout' />
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: !this.props.isComunicado ? '5px' : '',
                margin: this.props.isComunicado ? '.5rem' : '',
              }}
            >
              <InstitutionSwitch />
            </div>
          </div>
          {this.props.isComunicado && (
            <div
              className='d-inline-block'
              id='container-search'
              style={{
                margin: '0',
                width: '100%',
                display: 'block',
                position: 'relative'
              }}
            >
              <i
                className='fas fa-search'
                style={{
                  position: 'absolute',
                  fontSize: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: '0.5rem',
                  color: '#7f878e'
                }}
              />
              <Input
                id='txtSearch'
                type='text'
                name='txtSearch'
                onKeyPress={this.props.onKeyPress}
                onChange={this.props.onChangeInput}
                placeholder='Buscar correo'
                style={{
                  paddingLeft: 35,
                  background: '#f3f3f3',
                  border: 'none'
                }}
                value={this.props.textoFiltro}
              />
            </div>
          )}
        </nav>
        <SimpleModal
          openDialog={this.state.modalOpen}
          onClose={() => this.setModalOpen()}
          title='Cambiar contraseña'
          actions={false}
        >
          <ChangePasswordForm
            token={token}
            onSubmit={async (value) => {
              const res =
                await this.props.changePasswordbyCurrentUser({
                  username: '',
                  currentPassword: value.previousPassword,
                  newPassword: value.proposedPassword
                })
              if (!res.error) {
                this.props.logoutCurrentUser(this.props.history)
              }
              return res
            }}
            loading={this.props.loading}
            snackBarController={this.snackBarController}
            setModalOpen={this.setModalOpen}
          />
        </SimpleModal>
        {this.state.open && (
          <Notification
            duration={null}
            open={this.state.open}
            handleClose={() => {
              this.setState({ ...this.state, open: false })
            }}
            msg={this.state.msg}
            variant={this.state.variant}
          />
        )}
      </div>
    )
  }
}

TopNav.defaultProps = {
  iconMenu: true,
  classNameLogo: ''
}
const mapStateToProps = ({ menu, settings, authUser, roles }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu
  const { locale } = settings
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    ...authUser,
    ...roles
  }
}

const ModuleIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  cursor: pointer;
  padding: 5px;

  &:hover {
    border-radius: 3px;
    background-color: #badbf5;
  }
`

const UserDiv = styled.div`
	background: ${(props) => props.theme.primary};
	border: initial;
	font-size: 0.8rem;
	color: #fff;
	padding: 0.6rem 1rem;

	min-width: 170px;
	white-space: unset;
	border-radius: 35px;
	text-align: center;
`

export default withRouter(
  injectIntl(
    connect(mapStateToProps, {
      setContainerClassnames,
      clickOnMobileMenu,
      logoutCurrentUser,
      changeLocale,
      changePasswordbyCurrentUser,
      setUserInstitution,
      handleChangeRole,
      GetComunicadosPaginados,
      getActiveYears,
      MarcarComoLeidos,
      getRealtimeComunicados,
      setSelectedActiveYear
    })(withTranslation()(TopNav))
  )
)
