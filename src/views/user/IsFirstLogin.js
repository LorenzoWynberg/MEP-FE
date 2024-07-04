import React, { Component } from 'react'
import { Row, Card } from 'reactstrap'
import { NavLink, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { createPassword } from '../../redux/actions'
import { Colxx } from '../../components/common/CustomBootstrap'
import CambiarPassword from './partials/Login/CambiarPassword'
import Counter from './partials/Login/EditPasswordCounter'

class Login extends Component {
  state = {
    sessionId: null,
    newPasswd: '',
    username: '',
    newPasswordConf: '',
    toLogin: false
  }

  componentDidMount () {
    const getHeaders = async () => {
      await this.handleLoginHeaders(this.props.newPassword)
    }
    getHeaders()
  }

  handleLoginHeaders (e) {
    this.setState({ sessionId: e.headers.sessionid, isFirstCall: false })
  }

  createNewPassword = this.createNewPassword.bind(this)

  createNewPassword (newPasswd) {
    if (newPasswd && this.props.newPassword.username) {
      const { sessionId } = this.state
      const request = {
        newPassword: newPasswd,
        userName: this.props.newPassword.username,
        sessionId
      }
      this.props.createPassword(request, this.props.history)
    }
  }

  toLogin () {
    this.setState({
      toLogin: true
    })
  }

  render () {
    const { error } = this.props.newPassword
    if (!this.props.newPassword.isFirstLogin) return <Redirect to='login' />

    if (this.props.loading) {
      return (
        <Row className='h-100'>
          <Colxx xxs='12' md='10' className='mx-auto my-auto'>
            <Card className='auth-card'>
              <div className='form-side'>
                <div className='loading' />
              </div>
            </Card>
          </Colxx>
        </Row>
      )
    }

    return (
      <Row className='h-100'>
        <Colxx xxs='12' md='10' className='mx-auto my-auto'>
          <Card className='auth-card'>
            <div className='position-relative image-side ' />
            <div className='form-side'>
              <div className='input-container'>
                <NavLink to='/' className='white'>
                  <span className='logo-single' />
                </NavLink>
                <h5>Por razones de seguridad debe de escoger su nueva contraseña en el tiempo mostrado. Si se termina el tiempo puede intentarlo nuevamente.</h5>
                <div style={{
                  textAlign: 'center'
                }}
                >
                  <Counter history={this.props.history} />
                </div>
              </div>
              <CambiarPassword error={error} onSubmit={this.createNewPassword} history={this.props.history} />
            </div>
          </Card>
        </Colxx>
      </Row>
    )
  }
}
const mapStateToProps = ({ authUser }) => {
  const { newPassword } = authUser
  return { newPassword }
}

const mapActionsToProps = {
  createPassword
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Login)
