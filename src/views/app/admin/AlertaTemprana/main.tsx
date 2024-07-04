import React from 'react'
import { Row, Container } from 'reactstrap'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { getIdentification } from '../../../../redux/identificacion/actions'
import { getDetailStudent, getAlertStudent, clearStudent } from '../../../../redux/alertaTemprana/actionStudent'
import { useActions } from '../../../../hooks/useActions'

import Loader from '../../../../components/Loader'
import AppLayout from '../../../../layout/AppLayout'

import Estadisticas from './Estadisticas'
import Catalogo from './Catalogo'
import BuscarEstudiante from './AlertaPorEstudiante/BuscarEstudiante'
import ActivarAlerta from './ActivarAlerta'
import Solicitudes from './Solicitudes'
import ConfiguracionDeProceso from './Proceso'

import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import adminItems from '../../../../constants/adminMenu'

type AlertaProps = {
    active: number
}

type IState = {
    expedienteEstudiantil: any,
    identification: any
}

const AlertaTemprana: React.FC<AlertaProps> = (props) => {
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const [key, setKey] = React.useState<number>(0)
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [currentStudent, setCurrentStudent] = React.useState<any>(null)
  const [type, setType] = React.useState<string>('students')
  const actions = useActions({ getIdentification, getDetailStudent, getAlertStudent, clearStudent })

  console.log('Cargando Alerta Temprana')
  const options: Array<string> = [
    'Estadísticas',
    'Catálogo de Alertas',
    'Alertas por Estudiante',
    'Activar Alerta',
    'Solicitudes de Alertas',
    'Configurar proceso'
  ]

  const routes: Array<string> = [
    '/admin/alerta-temprana',
    '/admin/alerta-catalogo',
    '/admin/alerta-estudiantes',
    '/admin/activar-alerta',
    '/admin/alerta-solicitudes',
    '/admin/alerta-configuracion'
  ]

  const state = useSelector((store: IState) => {
    return {
      expedienteEstudiantil: store.expedienteEstudiantil,
      identification: store.identification
    }
  })

  React.useEffect(() => {
    setActiveTab(props.active)
  }, [props.active])

  const fetchAlerts = async () => {
    await actions.getAlertStudent(1, 10)
  }

  const handleCurrentAlert = (alert: any) => {
    setCurrentAlert(alert)
  }

  const handleSetStudent = async (student: any) => {
    await actions.getDetailStudent(student.identidadId)
    setCurrentStudent(student)
  }

  const handleClearStudent = async () => {
    if (type === 'alerts') {
      if (currentAlert === null) {
        await actions.clearStudent()
        setType('students')
        setCurrentStudent(null)
      } else {
        setType('alerts')
        setCurrentAlert(null)
      }
    } else {
      await actions.clearStudent()
      setType('students')
      setCurrentStudent(null)
    }
  }

  const handleClearAlert = () => setCurrentAlert(null)

  return (
    <AppLayout items={adminItems}>
      <Container>
        <TitleBread>{options[activeTab]}</TitleBread>
        <HeaderTab
          options={options}
          activeTab={activeTab}
          setActiveTab={async (index: number) => {
            setCurrentStudent(null)
            setCurrentAlert(null)
            setType('students')
            props.history.push({ pathname: routes[index] })
            setKey(Math.random())
            fetchAlerts()
          }}
        />
        <Row>
          {state.identification.loading
            ? (
              <Loader />
              )
            : (
              <ContentTab activeTab={activeTab} numberId={activeTab}>
                {
                                {
                                  0: <Estadisticas {...props} />,
                                  1: <Catalogo {...props} />,
                                  2: <BuscarEstudiante
                                    {...props}
                                    currentAlert={currentAlert}
                                    handleCurrentAlert={handleCurrentAlert}
                                    currentStudent={currentStudent}
                                    handleSetStudent={handleSetStudent}
                                    handleClearStudent={handleClearStudent}
                                     />,
                                  3: <ActivarAlerta
                                    {...props}
                                    key={key}
                                    setKey={setKey}
                                    type={type}
                                    setType={setType}
                                    currentAlert={currentAlert}
                                    handleCurrentAlert={handleCurrentAlert}
                                    currentStudent={currentStudent}
                                    handleSetStudent={handleSetStudent}
                                    handleClearStudent={handleClearStudent}
                                    handleClearAlert={handleClearAlert}
                                     />,
                                  4: <Solicitudes {...props} />,
                                  5: <ConfiguracionDeProceso {...props} />
                                }[props.active, activeTab]
                            }
              </ContentTab>
              )}
        </Row>
      </Container>
    </AppLayout>
  )
}

const TitleBread = styled.h2`
    color: #000;
    margin-bottom: 15px;
`

export default AlertaTemprana
