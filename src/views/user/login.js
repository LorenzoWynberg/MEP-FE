import React, { Component } from 'react'
import {
  Row,
  Card,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  Alert,
} from 'reactstrap'
import { NavLink, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { loginUser, createPassword, getApiVersion } from '../../redux/actions'
import { Colxx } from '../../components/common/CustomBootstrap'
import IntlMessages from '../../helpers/IntlMessages'
import Notification from '../../notifications'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import packageJson from '../../../package.json'

const theme = createTheme({
  typography: {
    caption: {
      fontSize: 10
    }
  }
})
class Login extends Component {
  state = {
    password: '',
    username: '',
    variant: 'info',
    msg: '',
    open: false,
    notification: {
      open: false,
      variant: 'error',
      message: ''
    }
  }

  async onUserLogin(event) {
    const { password, username } = this.state
    if (password && username) {
      const _data = {
        password: password.trim(),
        username
      }
      const res = await this.props.loginUser(_data, this.props.history)

      if (res?.error) {
        this.setState({
          ...this.state,
          notification: {
            open: true,
            message: res?.message
          }
        })
      }
    }
    event.preventDefault()
  }

  componentDidMount() {
    this.props.timeoutSession &&
      this.setState({
        ...this.state,
        open: true,
        variant: 'warning'
      })
    window.addEventListener('beforeunload', function () {
      sessionStorage.removeItem('persist:auth-accessToken')
      sessionStorage.removeItem('persist:expiration')
    })

    this.props.getApiVersion()
  }

  onInputChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value.trim() })
  }

  render() {
    const { error, timeoutSession, authObject } = this.props
    const { variant, open } = this.state
    const user = authObject.user.token

    if (user) {
      return <Redirect to='app/' />
    }
    if (this.props.loading) {
      return (
        <Row className='h-100'>

          <div className='loading' />

        </Row>
      )
    }
    if (this.props.serverError) {
      const error = {
        code: 500,
        message: 'Server Error'
      }
      return (
        <Redirect
          to={{
            pathname: 'error',
            state: { error }
          }}
        />
      )
    }

    if (sessionStorage.getItem('changePassword')) { return <Redirect to='isFirstLogin' /> }

    return (
      <Row style={{ marginRight: 0, marginLeft: 0, height: '100vh' }}>
        <div className='fixed-background-saber' />
        {timeoutSession && (
          <Notification
            duration={null}
            open={open}
            handleClose={() => {
              this.setState({ ...this.state, open: false })
            }}
            msg={<IntlMessages id='session.expired' />}
            variant={variant}
          />
        )}
        {/* {
          this.state?.notification?.open && (
            <>
              <Notification
                open={this.state.notification.open}
                handleClose={() => {
                  this.setState({ ...this.state, open: false })
                }}
                msg={this.state.notification.message}
                variant="error"
                timeToHide={3000}
              />
            </>
          )
        } */}

        <Colxx xxs='12' md='10' className='mx-auto my-auto' >
          <Card className='auth-card'>
            <div className='position-relative image-side ' />
            <div className='form-side'>
            <div className='d-flex justify-content-between align-items-center'>
             
              <Grid item xs={14} className='d-flex'>
                  <img
                    alt='Profile'
                    src='/assets/img/LogoMep.jpg'
                    className='logos'
                    style={{ marginLeft: 0 }}
                  />
                </Grid>
                <Grid item xs={6} className='d-flex'>
                  <img
                    alt='Profile'
                    src='/assets/img/saber.jpg'
                    className='logos'
                    style={{ marginLeft: 0 }}
                  />
                </Grid>
                {/* <NavLink to='/' className='white'>
                <span className='logo-single-saber' />
                <Typography
                  variant='subtitle2'
                  className='descripcion-logo'
                  style={{ fontSize: '12px' }}
                >
                 
                </Typography>
              </NavLink> */}
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
                </div>
                
              <>
                <CardTitle className='mb-4'>
                  <IntlMessages id='user.login-title' />
                </CardTitle>
                <Form onSubmit={this.onUserLogin.bind(this)}>
                  <Label className='form-group has-top-label'>
                    <Input
                      type='username'
                      name='username'
                      defaultValue={this.state.username}
                      onChange={this.onInputChange.bind(
                        this
                      )}
                      value={this.state.username}
                    />
                    <IntlMessages id='user.username' />
                  </Label>
                  <Label className='form-group has-top-label'>
                    <Input
                      type='password'
                      name='password'
                      onChange={this.onInputChange.bind(
                        this
                      )}
                      value={this.state.password}
                    />
                    <IntlMessages
                      id='user.password'
                      defaultValue={this.state.password}
                    />
                  </Label>
                  {error
                    ? (
                      <Alert color='danger'>{error}</Alert>
                    )
                    : null}

                  <div className='d-flex justify-content-between align-items-center'>
                    <NavLink to='/user/forgot-password/'>
                      <IntlMessages id='user.forgot-password-question' />
                    </NavLink>
                    <Button
                      color='primary'
                      className='btn-shadow'
                      size='lg'
                      type='submit'
                    >
                      <IntlMessages id='user.login-button' />
                    </Button>
                  </div>
                </Form>
              </>
              <br />
              <div className='d-flex'>
              <a href='SABER- Manual de usuario v3.1.pdf' download>
               
                <Grid item xs={9} className='d-flex'>
                 <img
                    alt='Enlace al manual de usuario'
                    src='/assets/img/manualUsuario.jpg'
                    className='logos'
                    style={{ marginLeft: 0 }}
                  />
                 </Grid>
               
              </a>
              <br />
              <a href='https://saber.tawk.help/' target="_blank" >
                
                <Grid item xs={9} className='d-flex'>
                <img
                   alt='Enlace a preguntas frecuentes'
                   src='/assets/img/PreguntasFrecuentes.jpg'
                   className='logos'
                   style={{ marginLeft: 0 }}
                 />
                </Grid>
                
              </a>
              <br />
             
               <br />
               </div>
              <Grid xs={12} container className='mt-2 mb-2'>
                
                {/* <Grid item xs={3} className='d-flex'>
                  <img
                    alt='Profile'
                    src='/assets/img/Logo-UPRE.jpg'
                    className='logos'
                  />
                </Grid>
                <Grid item xs={6} className='d-flex'>
                  <img
                    alt='Profile'
                    src='/assets/img/PROEDUCA.jpg'
                    className='logos'
                    style={{ width: '95%', marginRight: 0 }}
                  />
                </Grid> */}
              </Grid>
              <Grid container xs={12}>
                <ThemeProvider theme={theme}>
                  <Typography
                    variant='caption'
                    style={{ lineHeight: '12px' }}
                  >
                    Este sitio web ha sido creado con el
                    apoyo financiero de la Unión Europea. 
                  </Typography>
                </ThemeProvider>
              </Grid>
              <Grid container xs={12} style={{ marginTop: 20 }}>
                <ThemeProvider theme={theme}>
                  <Typography
                    variant='caption'
                    style={{ lineHeight: '11px' }}
                  >
                    {' Versión:' +
                      packageJson.version +
                      ' - ' +
                      this.props.apiVersion}
                  </Typography>
                </ThemeProvider>
              </Grid>
            </div>
          </Card>
        </Colxx>

      </Row>
    )
  }
}
const mapStateToProps = ({ authUser }) => {
  const {
    authObject,
    user,
    loading,
    error,
    newPassword,
    timeoutSession,
    apiVersion
  } = authUser
  return {
    authObject,
    user,
    loading,
    error,
    newPassword,
    timeoutSession,
    apiVersion
  }
}

const mapActionsToProps = {
  loginUser,
  createPassword,
  getApiVersion
}

export default connect(mapStateToProps, mapActionsToProps)(Login)
