import React from 'react'
import styled from 'styled-components'
import { Container } from 'reactstrap'
import HeaderTab from '../../../../../components/Tab/Header'
import ContentTab from '../../../../../components/Tab/Content'
import { getDetailStudent } from '../../../../../redux/alertaTemprana/actionStudent'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'

import BuscarEstudiante from './BuscarEstudiante'
import ActivarAlerta from './ActivarAlerta'

import AlertaEstudianteDetail from './AlertaEstudianteDetail'
import InfoCard from './InfoCard'

type AlertaProps = {
    estudiantes: any,
    cleanIdentity: any,
    cleanAlertFilter: any,
    buscador: any,
    changeColumn: any,
    changeFilterOption: any,
    loadStudent: any,
    history: any,
    getAlertDataFilter: any,
    match: any
}

type IStore = {
    alertaTemprana: any
}

const AlertaPorEstudiante: React.FC<AlertaProps> = (props) => {
  const optionsTab: Array<string> = ['Buscar estudiante', 'Activar una alerta']
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const [currentStudent, setCurrentStudent] = React.useState<any>(null)

  const actions = useActions({ getDetailStudent })

  const state = useSelector((store: IStore) => {
    return {
      currentStudent: store.alertaTemprana.currentStudent
    }
  })

  const handleSetStudent = async (student: any) => {
    await actions.getDetailStudent(student.identidadId)
    setCurrentStudent(student)
  }

  const handleClearStudent = () => {
    setCurrentStudent(null)
  }

  const updateIndex = (index: number) => {
    setCurrentStudent(null)
    setActiveTab(index)
  }

  const handleSetStep = (index: number) => {
    setCurrentStudent(null)
    setActiveTab(index)
  }

  return (
    <Container>
      <Title>Alertas por estudiante</Title>
      <Sections>
        {currentStudent !== null ? <InfoCard student={state.currentStudent} /> : null}
        <HeaderTab
          options={optionsTab}
          activeTab={activeTab}
          setActiveTab={handleSetStep}
        />
        <ContentTab activeTab={activeTab} numberId={activeTab}>
          {activeTab === 0 ? currentStudent === null ? <BuscarEstudiante {...props} currentStudent={currentStudent} handleSetStudent={handleSetStudent} updateIndex={updateIndex} /> : <AlertaEstudianteDetail currentStudent={currentStudent} handleClearStudent={handleClearStudent} /> : null}
          {activeTab === 1 ? <ActivarAlerta currentStudent={currentStudent} handleSetStudent={handleSetStudent} {...props} /> : null}
        </ContentTab>
      </Sections>
    </Container>
  )
}

const Title = styled.strong`
    color: #000;
    font-size: 17px;
    margin: 35px 0px 20px;
    display: block;
`

const Sections = styled.div`
    margin-bottom: 20px;
`

export default AlertaPorEstudiante
