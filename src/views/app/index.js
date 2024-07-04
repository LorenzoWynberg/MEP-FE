import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Card } from 'reactstrap'
import { Button } from 'Components/CommonComponents'
import Select from 'react-select'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as authActions from '../../redux/auth/actions.ts'
import { getCatalogs } from '../../redux/selects/actions'
import { catalogsEnumObj } from '../../utils/catalogsEnum'
import { getProvincias } from '../../redux/provincias/actions'
import { handleChangeRole } from '../../redux/auth/actions'
import { cleanCenterOffer } from '../../redux/grupos/actions'
class App extends Component {
  constructor(props) {
    super(props)
    this.logoutUser = this.logoutUser.bind(this)
  }

  componentDidMount() {
    this.props.clearCurrentInstitution()
    this.props.cleanCenterOffer()
    this.props.getCatalogs(catalogsEnumObj.NATIONALITIES.id)
    if (!this.props.provincias.provincias[0]) {
      this.props.getProvincias()
    }
  }

  getRoleFromList(roleLabel) {
    let actualRol
    this.props.roles.map((role) => {
      if (role.nombre === roleLabel) {
        actualRol = role.id
      }
    })
    return actualRol
  }

  getRoleByOrganization() {

  }

  getOptions(values) {
    const data = []
    if (values && values.length > 0) {
      values.forEach((val, i) => {
        const element = data.find(el => el.rolId === val.rolId && el.organizacionId == val.organizacionId)
        if (!element) {
          let routeTo = ''
          if (val.rolId === 1 || val.rolId === 3 || val.rolId === 4 || val.rolId === 7 || val.rolId === 19) {
            routeTo = '/director/buscador/centro'
          } if (val.rolId === 11) {
            routeTo = '/director/grupos'
          } else {
            // routeTo = `/director/ficha-centro/${val.organizacionId}`;
            routeTo = '/director/registro-estudiantil'
          }

          if (val.rolNombre === 'GESTOR FORMULARIOS') {
            routeTo = '/gestor'
          }

          const _nombreNivelAcceso = val.organizacionNombre == null ? val.rolNombre : `${val.rolNombre} - ${val.organizacionNombre}`

          data.push({
            ...val,
            value: routeTo,
            label: _nombreNivelAcceso,
            index: i
          })
        }
      })
    }

    return data
  }

  changeRoute(e) {

    const currentRole = this.props.authObject.user.rolesOrganizaciones.length > 0 && this.props.authObject.user.rolesOrganizaciones[e.index]
    if (currentRole.rolNombre === 'DIRECTOR') {
      localStorage.setItem('selectedRolInstitution', JSON.stringify(currentRole))
    }
    this.props.handleChangeRole(currentRole)
    this.props.history.push(e.value)
  }

  logoutUser(e) {
    e.preventDefault()
    this.props.logoutCurrentUser(this.props.history, 10)
  }

  render() {
    const options = this.getOptions(this.props.authObject.user.rolesOrganizaciones)
    return (
      <>
        <div className='fixed-background-saber' />
        <Wrapper>
          <ContentBox>
            <Content>
              <Label>Por favor seleccione su rol</Label>
              <Div>
                <Select
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      marginRight: '5px',
                      width: '20rem',
                      '@media only screen and (max-width: 768px)': {
                        ...styles['@media only screen and (max-width: 768px)'],
                        width: '9rem'
                      }
                    })
                  }}
                  type='select'
                  className='react-select'
                  classNamePrefix='react-select'
                  name='role'
                  onChange={(e) => this.changeRoute(e)}
                  options={options}
                  placeholder='Seleccionar'
                />
                <br />
                <Button onClick={this.logoutUser} style={{ width: '100%' }}>Cerrar sesión</Button>
              </Div>
            </Content>
          </ContentBox>
        </Wrapper>
      </>
    )
  }
}

const mapStateToProps = ({ authUser, roles, provincias }) => {
  // const { containerClassnames } = menu;
  return { ...authUser, ...roles, provincias }
}

const Div = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 768px){
    display:flex;
    flex-direction:column;

  }

`
const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

const ContentBox = styled(Card)`
  width: 35%;
  margin: 0 auto;
  text-align: center;
`

const Label = styled.label`
  color: #000;
  font-weight: bold;
`

const Content = styled.div`
  padding: 25px;
  box-sizing: border-box;
`

export default withRouter(connect(mapStateToProps, { ...authActions, getCatalogs, getProvincias, handleChangeRole, cleanCenterOffer })(App))
