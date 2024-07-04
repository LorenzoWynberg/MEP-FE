import React from 'react'
import studentBreadcrumb from 'Constants/studentBreadcrumb'
import { useSelector, connect } from 'react-redux'
import { getIdentification } from 'Redux/identificacion/actions'
import { Col, Row, Container } from 'reactstrap'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import InformationCard from './_partials/InformationCard'
import Loader from 'components/Loader'
import { useActions } from '../../../../../hooks/useActions'
import AppLayout from 'Layout/AppLayout'
import directorItems from '../EstudianteItems'
import { useVistasUsuarios } from '../../Hooks'
import { loadStudent } from 'Redux/expedienteEstudiantil/actions'
import withAuthorization from 'Hoc/withAuthorization'
import { withIdentification } from 'Hoc/Identification'

const Navegacion = React.lazy(() => import('./Navegacion'))
const Contacto = React.lazy(() => import('./Contacto'))
const General = React.lazy(() => import('./General'))
const Oferta = React.lazy(() => import('./Oferta'))
const AreaCurricular = React.lazy(() => import('./AreaCurricular'))
const Hogar = React.lazy(() => import('./Hogar'))
const Beneficios = React.lazy(() => import('./Beneficios'))
const Apoyo = React.lazy(() => import('./Apoyo'))
const Salud = React.lazy(() => import('./Salud'))
const Buscador = React.lazy(() => import('./Buscador'))
const Sinirube = React.lazy(() => import('./Sinirube'))
const CuentaCorreo = React.lazy(() => import('./CuentaCorreo'))

const EXPEDIENTE_ESTUDIANTE_BASE_PATH = '/view/expediente-estudiante'

const ContenedorPrincipal = props => {
  // const x = useExpedienteEstudiante()
  useVistasUsuarios()
  studentBreadcrumb.map((item, idx) => {
    item.active = props.active === idx
    return item
  })

  const actions = useActions({
    getIdentification,
    loadStudent
  })
  const state = useSelector((store:any) => {
    return {
      expedienteEstudiantil: store.expedienteEstudiantil,
      identification: store.identification,
      historialMatricula: store.identification.matriculaHistory
    }
  })
  /*
    useEffect(() => {
        const loadData = async ()=> {
            const data = await actions.getIdentification(
                state.expedienteEstudiantil.currentStudent.id
            );
            actions.loadStudent(data);
        }
        loadData()

    }, [state.expedienteEstudiantil.currentStudent]); */

  const breadcrumbItems = [
    {
      label: 'home',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/inicio`,
      active: false
    },
    {
      label: 'general',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/general`,
      active: false
    },
    {
      label: 'contact',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/contacto`,
      active: false
    },
    {
      label: 'house',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/hogar`,
      active: false
    },
    {
      label: 'benefits',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/beneficios`,
      active: false
    },
    {
      label: 'educational-supports',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/apoyos-educativos`,
      active: false
    },
    {
      label: 'curriculous-area',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/area-curricular`,
      active: false
    },
    {
      label: 'health',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/salud`,
      active: false
    },
    {
      label: 'educational-offer',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/oferta`,
      active: false
    },
    {
      label: 'sinirube',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/sinirube`,
      active: false
    },
    {
      label: 'email-account',
      to: `${EXPEDIENTE_ESTUDIANTE_BASE_PATH}/cuenta-correo`,
      active: false
    }
  ]

  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        <Container>
          {props.active !== 0 && (
            <InformationCard
              data={props.informationCardProps}
            />
          )}
          <Row>
            {props.active !== 0 && (
              <Col xs={12}>
                <Breadcrumb
                  header='Expediente Estudiantil'
                  data={breadcrumbItems}
                />
                <br />
              </Col>
            )}
            {props.identification.loading ? (
              <Loader />
            ) : (
              <div style={{ width: '100%' }}>
                {
                                    {
                                      /* 0: <Buscador {...props} />, */
                                      1: <Navegacion {...props} />,
                                      2: <General {...props} />,
                                      3: <Contacto {...props} />,
                                      4: <Hogar {...props} />,
                                      5: <Beneficios {...props} />,
                                      6: <Apoyo {...props} />,
                                      7: <AreaCurricular {...props} />,
                                      8: <Salud {...props} />,
                                      9: <Oferta {...props} historialMatricula={props.historialMatricula} />,
                                      10: <Sinirube {...props} />,
                                      11: <CuentaCorreo {...props} />
                                    }[props.active]
                                }
              </div>
            )}
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

const mapToProps = (store) => {
  return {
    informationCardProps: {
      idEstudiante: store.identification.data.id,
      fotografiaUrl: store.identification.data.fotografiaUrl,
      nombreEstudiante: store.identification.data.nombre,
      identificacion: store.identification.data.identificacion
    },
    expedienteEstudiantil: store.expedienteEstudiantil,
    identification: store.identification,
    historialMatricula: store.identification.matriculaHistory
  }
}

export default withAuthorization({
  id: 1,
  Modulo: 'Expediente Estudiantil',
  Apartado: 'Informacion General',
  Seccion: 'Informacion General'
})(withIdentification(connect(mapToProps)(ContenedorPrincipal)))
