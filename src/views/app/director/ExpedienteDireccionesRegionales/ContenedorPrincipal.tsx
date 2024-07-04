import React, { useEffect } from 'react'
import { Col, Row, Container } from 'reactstrap'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import {
  getRegionalById,
  getRegionalDirector
} from 'Redux/configuracion/actions'
import { useActions } from 'Hooks/useActions'
import { useTranslation } from 'react-i18next'

const ExpedienteDireccionesRegionales = React.lazy(
  () => import('./ExpedienteDireccionesRegionales')
)
const General = React.lazy(
  () =>
    import('Views/app/director/Configuracion/_partials/Direcciones/General')
)
const Contacto = React.lazy(
  () =>
    import(
      'Views/app/director/Configuracion/_partials/Direcciones/Contacto'
    )
)
const Director = React.lazy(
  () =>
    import(
      'Views/app/director/Configuracion/_partials/Direcciones/Director'
    )
)
const UbicacionSaber = React.lazy(
  () =>
    import(
      'Views/app/director/Configuracion/_partials/Direcciones/UbicacionSaber'
    )
)
const HumanResource = React.lazy(() => import('./HumanResource'))
const SupervisionesCircuitales = React.lazy(
  () => import('./SupervisionesCircuitales')
)
const CentrosEducativos = React.lazy(() => import('./CentrosEducativos'))
const InformationCard = React.lazy(() => import('./InformationCard'))

const ROUTES = [
  {
    label: 'supervision_circ>expediente>nav>inicio',
    to: '/director/expediente-direcciones/inicio',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>info_gen',
    to: '/director/expediente-direcciones/general',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>director',
    to: '/director/expediente-direcciones/director',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>contacto',
    to: '/director/expediente-direcciones/contacto',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>ubicacion',
    to: '/director/expediente-direcciones/ubicacion',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>recurso_humano',
    to: '/director/expediente-direcciones/recursos-humanos',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>supervisiones_circ',
    to: '/director/expediente-direcciones/supervisiones-circuitales',
    active: false
  },
  {
    label: 'supervision_circ>expediente>nav>centros_educativos',
    to: '/director/expediente-direcciones/centros',
    active: false
  }
]

interface IState {
	authUser: {
		currentRoleOrganizacion: {
			accessRole: {
				nivelAccesoId: number
				organizacionId: number | string
				organizacionNombre: string
				rolId: number
				rolNombre: string
			}
		}
	}
	configuracion: {
		currentRegional: {
			id: number
			codigo: string
			codigoPresupuestario: string
			nombre: string
			esActivo: boolean
			fechaInsercion: string
			fechaActualizacion: string
			telefono: any
			correoElectronico: any
			codigoDgsc2: number
			conocidoComo: any
			imagenUrl: string
			nombreDirector: any
			ubicacionGeograficaJson: any
		}
		expedienteRegional: any
		currentDirector: {
			id: string
			accessRoleId: number
			nombre: string
			primerApellido: string
			segundoApellido: string
			identificacion: string
			email: string
		}
	}
}

const ContenedorPrincipal = (props) => {
  const { t } = useTranslation()

  ROUTES.map((item, idx) => {
    item.active = props.active === idx
    return item
  })

  const history = useHistory()

  const actions = useActions({
    getRegionalById,
    getRegionalDirector
  })

  const state = useSelector((state: IState) => ({
    currentRoleOrganizacion: state.authUser.currentRoleOrganizacion,
    currentRegional: state.configuracion.currentRegional || state.configuracion.expedienteRegional,
    currentDirector: state.configuracion.currentDirector,
    expedienteRegional: state.configuracion.expedienteRegional
  }))

  if (state.currentRoleOrganizacion?.accessRole?.rolId !== 6 && !state.expedienteRegional) {
    return (
      <AppLayout items={directorItems}>
        <div className='dashboard-wrapper'>
          <section>
            <Container>
              <Row>
                <Col xs={12}>
                  <h3>
                    {t(' dir_regionales>no_select', 'Debe seleccionar una dirección regional.')}
                  </h3>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout items={directorItems}>
      <Helmet>
        <title>Expediente de dirección regional</title>
      </Helmet>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <InformationCard />
            <Col xs={12}>
              <Breadcrumb
                header={t('supervision_circ>expediente>titulo_dir_reg', 'Expediente de dirección regional')}
                data={ROUTES}
              />
              <br />
            </Col>
            <Col xs={12}>
              {
                {
                  0: <ExpedienteDireccionesRegionales {...props} />,
                  1: <General
                    {...props}
                    currentRegional={state.expedienteRegional
                      ? {
                          ...state.expedienteRegional,
                          esActivo: state.expedienteRegional
                            ?.esActivo
                            ? 'Activo'
                            : 'Inactivo'
                        }
                      : {
                          ...state.currentRegional,
                          esActivo: state.currentRegional?.esActivo ? 'Activo' : 'Inactivo'
                        }}
                     />,
                  2: <Director
                    {...props}
                    currentRegional={state.expedienteRegional
                      ? {
                          ...state.expedienteRegional,
                          esActivo: state.expedienteRegional
                            ?.esActivo
                            ? 'Activo'
                            : 'Inactivo'
                        }
                      : {
                          ...state.currentRegional,
                          esActivo: state.currentRegional?.esActivo ? 'Activo' : 'Inactivo'
                        }}
                     />,
                  3: <Contacto
                    {...props}
                    currentRegional={state.expedienteRegional || state.currentRegional}
                     />,
                  4: <UbicacionSaber {...props} />,
                  5: <HumanResource {...props} />,
                  6: <SupervisionesCircuitales {...props} />,
                  7: <CentrosEducativos {...props} />
                }[props.active]
              }
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

export default ContenedorPrincipal
