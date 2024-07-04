import React, { useState, useEffect } from 'react'
import HeaderTab from 'Components/Tab/Header'
import useNotification from '../../../hooks/useNotification'
import ContentTab from 'Components/Tab/Content'
import InformationCard from './_partials/expedienteSupervisiones/InformationCard'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import withRouter from 'react-router-dom/withRouter'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { getCircuitoById, getRegionales } from 'Redux/configuracion/actions'
import { Col, Row, Container } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import AssignmentIcon from '@material-ui/icons/Assignment'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import GroupsIcon from '@mui/icons-material/Groups'
import HouseIcon from '@material-ui/icons/House'
import ContactMailIcon from '@mui/icons-material/ContactMail'

const Inicio = React.lazy(
  () => import('./_partials/expedienteSupervisiones/inicio')
)
const General = React.lazy(
  () => import('../director/Configuracion/_partials/Supervisiones/General')
)
const Contacto = React.lazy(
  () => import('../director/Configuracion/_partials/Supervisiones/Contacto')
)
const Supervisor = React.lazy(
  () => import('../director/Configuracion/_partials/Supervisiones/Director')
)
const UbicacionSaber = React.lazy(
  () => import('../director/Configuracion/_partials/Supervisiones/UbicacionSaber')
)
const RecursoHumano = React.lazy(
  () => import('./_partials/expedienteSupervisiones/RecursoHumano')
)

const CentroEducativo = React.lazy(
  () => import('./_partials/expedienteSupervisiones/CentroEducativo')
)

type SnackbarConfig = {
  variant: string
  msg: string
}

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
    currentCircuito: {
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
    expedienteSupervision: {
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

const ExpedienteSupervision = (props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)

  const actions = useActions({
    getCircuitoById,
    getRegionales
  })

  useEffect(() => {
    actions.getRegionales()
  }, [])

  const { hasEditAccess = true } = props

  const state = useSelector((store: IState) => {
    return {
      currentDirector: store.configuracion.currentDirector,
      currentCircuito: store.configuracion.currentCircuito,
      expedienteSupervision: store.configuracion.expedienteSupervision,
      currentRoleOrganizacion: store.authUser.currentRoleOrganizacion,
      regionales: store.configuracion.allRegionales
    }
  })

  useEffect(() => {
    if (
      state.currentRoleOrganizacion?.accessRole &&
      state?.currentCircuito?.id !=
        state.currentRoleOrganizacion?.accessRole?.organizacionId
    ) {
      actions.getCircuitoById(
        state.currentRoleOrganizacion?.accessRole?.organizacionId
      )
    }
  }, [state.currentRoleOrganizacion?.accessRole])
  const optionsTab = [
    {
      title: t('supervision_circ>expediente>nav>inicio', 'Inicio')
    },
    {
      title: t(
        'supervision_circ>expediente>nav>info_gen',
        'Información general'
      ),
      icon: (
        <AssignmentIcon style={{ fontSize: '4rem', color: 'white' }} />
      ),
      showIcon: false
    },
    {
      title: t(
        'supervision_circ>expediente>nav>supervisor',
        'Supervisor'
      ),
      icon: (
        <AccountCircleIcon
          style={{ fontSize: '4rem', color: 'white' }}
        />
      ),
      showIcon: false
    },
    {
      title: t('supervision_circ>expediente>nav>contacto', 'Contacto'),
      icon: (
        <ContactMailIcon style={{ fontSize: '4rem', color: 'white' }} />
      ),
      showIcon: false
    },
    {
      title: t('supervision_circ>expediente>nav>ubicacion', 'Ubicación'),
      icon: <BookmarkIcon style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    },
    {
      title: t(
        'supervision_circ>expediente>nav>recurso_humano',
        'Rescurso humano'
      ),
      icon: <GroupsIcon style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    },
    {
      title: t(
        'supervision_circ>expediente>nav>centros_educativos',
        'Centros educativos'
      ),
      icon: <HouseIcon style={{ fontSize: '4rem', color: 'white' }} />,
      showIcon: false
    }
  ]

  if (
    state.currentRoleOrganizacion?.accessRole?.rolId !== 5 &&
    !state.expedienteSupervision
  ) {
    return (
      <AppLayout items={directorItems}>
        <div className='dashboard-wrapper'>
          <section>
            <Container>
              <Row>
                <Col xs={12}>
                  <h3>
                    {t(
                      'supervision_circ>no_selec',
                      'Debe seleccionar una supervision circuital.'
                    )}
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
      <>
        <InformationCard data={[]} />
        <h3>
          {t(
            'supervision_circ>expediente>titulo',
            'Expediente de Supervisión Circuital'
          )}
        </h3>
        <HeaderTab
          options={optionsTab}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          marginTop={4}
        />
      </>

      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
          {
            0: (
              <Inicio
                {...props}
                optionsTab={optionsTab}
                setActiveTab={setActiveTab}
              />
            ),
            1: (
              <General
                {...props}
                currentCircuito={
                  state.expedienteSupervision
                    ? {
                        ...state.expedienteSupervision,
                        esActivo: state
                          .expedienteSupervision
                          ?.esActivo
                          ? 'Activo'
                          : 'Inactivo'
                      }
                    : {
                        ...state.currentCircuito,
                        esActivo: state.currentCircuito
                          ?.esActivo
                          ? 'Activo'
                          : 'Inactivo'
                      }
                }
                regionales={state.regionales}
                hasEditAccess={false}
                handleBack={() => setActiveTab(0)}
              />
            ),
            2: (
              <Supervisor
                {...props}
                currentCircuito={
                  state.expedienteSupervision
                    ? {
                        ...state.expedienteSupervision,
                        esActivo: state
                          .expedienteSupervision
                          ?.esActivo
                          ? 'Activo'
                          : 'Inactivo'
                      }
                    : {
                        ...state.currentCircuito,
                        esActivo: state.currentCircuito
                          ?.esActivo
                          ? 'Activo'
                          : 'Inactivo'
                      }
                }
                hasEditAccess={false}
                handleBack={() => setActiveTab(0)}
              />
            ),
            3: (
              <Contacto
                {...props}
                currentCircuito={
                  state.expedienteSupervision ||
                  state.currentCircuito
                }
                handleBack={() => setActiveTab(0)}
                hasEditAccess={false}
              />
            ),
            4: (
              <>
                <UbicacionSaber
                  {...props}
                  currentCircuito={
                    state.expedienteSupervision ||
                    state.currentCircuito
                  }
                  handleBack={() => setActiveTab(0)}
                  hasEditAccess={false}
                />
              </>
            ),
            5: <RecursoHumano />,
            6: <CentroEducativo />
          }[activeTab]
        }
      </ContentTab>
    </AppLayout>
  )
}

export default withRouter(ExpedienteSupervision)
