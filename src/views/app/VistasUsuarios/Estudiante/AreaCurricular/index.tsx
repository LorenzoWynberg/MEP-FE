import React, { useEffect } from 'react'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import { Col, Row, Container } from 'react-bootstrap'
import AppLayout from 'Layout/AppLayout'
import estudianteItems from '../EstudianteItems'
import OfertaEducativa from './OfertaEducativa'
import Apoyo from '../../../director/ExpedienteEstudiante/Apoyo'
import AreaCurricularTab from './AreaCurricular'
import Horario from './_partials/Horario'
import InformationCard from '../ExpedienteEstudiante/_partials/InformationCard'
import { useVistasUsuarios } from '../../Hooks'
import { connect } from 'react-redux'
const AreaCurricular = (props) => {
  const breadcrumbItems = [
    {
      label: 'curriculous-area',
      to: 'view/areacurricular',
      active: false
    },
    {
      label: 'schedules',
      to: '/view/areacurricular/horarios',
      active: false
    },
    {
      label: 'educational-supports',
      to: '/view/areacurricular/apoyoeducativo',
      active: false
    },
    {
      label: 'educationalOffers',
      to: '/view/areacurricular/ofertaeducativa',
      active: false
    }
  ]
  const { setHorarioEvent } = useVistasUsuarios()
  useEffect(() => {
    if (!props.estudianteSeleccionado) return
    if (!props.estudianteSeleccionado?.academiaSeleccionada) return
    setHorarioEvent(
      props.estudianteSeleccionado.id,
      props.estudianteSeleccionado?.academiaSeleccionada.institucionId
    )
  }, [props.estudianteSeleccionado])
  return (
    <AppLayout items={estudianteItems}>
      <div className='dashboard-wrapper'>
        <Container>
          <InformationCard data={props.informationCardProps} />
          <Row>
            <Col xs={12}>
              <Breadcrumb
                header='Expediente Estudiantil'
                data={breadcrumbItems}
              />
              <br />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {props.active === 0 && <AreaCurricularTab />}
              {props.active === 1 && <Horario />}
              {props.active === 2 && (
                <Apoyo authHandler={() => {}} />
              )}
              {props.active === 3 && <OfertaEducativa />}
            </Col>
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
    estudianteSeleccionado: store.VistasUsuarios.estudianteSeleccionado,
    historialMatricula: store.identification.matriculaHistory
  }
}

export default connect(mapToProps)(AreaCurricular)
