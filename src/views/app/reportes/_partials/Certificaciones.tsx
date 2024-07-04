import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DisplayCardInfo from './DisplayCardinfo'
import FormFilterCertificaciones from '../certificaciones/formFilter'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import TemplateDownload from '../templateDownload'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { GetInstitucionWithCircuitoRegional } from 'Redux/institucion/actions'
import {
  getCertInfoLogros,
  getCertInfoNotas
} from 'Redux/Certificaciones/actions'
import LogrosAsignaturas from '../certificaciones/logrosAsignaturas'
import TablaNotas from '../certificaciones/tablaNotas'

interface IProps {}
const cards = [
  {
    component: 'ctfEstAct',
    title: 'Certificación de la persona estudiante activa',
    subTitle: 'Seleccione el grupo y la persona estudiante',
    asignatura: false,
    description:
      'Esta certificación se utiliza para emitir una constancia de que la persona estudiante se encuentra activo en el centro educativo'
  },
  {
    component: 'ctfTSE',
    title: 'Certificación de duplicado de datos de nacimiento TSE',
    subTitle: 'Seleccione el grupo y la persona estudiante',
    asignatura: false,

    description:
      'Esta certificación se utiliza para emitir una constancia de duplicado de datos de nacimiento'
  },
  {
    component: 'infLog',
    title: 'Informe de logros',
    asignatura: true,
    subTitle: 'Seleccione el grupo,asignatura y la persona estudiante',

    description:
      'Esta certificación se utiliza para emitir una constancia del informe de logros por grupo o persona estudiante'
  },
  {
    component: 'ctfEst',
    title: 'Certificación de notas de la persona estudiante ',
    subTitle: 'Seleccione el grupo, asignatura y la persona estudiante',
    asignatura: true,
    description:
      'Esta certificación se utiliza para emitir una constancia de las notas de la persona estudiante certificación'
  }
]

const Certificaciones: React.FC<IProps> = (props) => {
  const [typeCertification, seTypeCertification] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showCertificado, setShowCertificado] = useState(false)
  const [dataCertificado, setDataCertificado] = useState(null)

  const goTo = (component) => {
    seTypeCertification(component)
    setShowForm(true)
  }

  const actions = useActions({
    GetInstitucionWithCircuitoRegional,
    getCertInfoLogros,
    getCertInfoNotas
  })
  const state = useSelector((store: any) => {
    return {
      selectedActiveYear: store.authUser.selectedActiveYear,
      currentInstitution: store.authUser.currentInstitution,
      institucion: store.institucion.institutionWithCircularRegional
    }
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.GetInstitucionWithCircuitoRegional(
        state.currentInstitution?.id
      )
    }
    fetch()
  }, [state.currentInstitution])

  const renderContentCertificado = () => {
    switch (typeCertification.component) {
      case 'ctfEstAct':
        return (
          <div style={{ margin: '20px 0', fontSize: '14px' }}>
            El MINISTERIO DE EDUCACIÓN PÚBLICA hace constar que el alumno/a{' '}
            <strong>"{dataCertificado.student.nombre}"</strong> cédula nacional{' '}
            <strong>"{dataCertificado.student.identificacion}"</strong> del
            centro educativo <strong>"{state.institucion.nombre}"</strong> se
            encuentra activo en el centro educativo.
          </div>
        )
      case 'ctfTSE':
        return (
          <div style={{ margin: '20px 0', fontSize: '14px' }}>
            El MINISTERIO DE EDUCACIÓN PÚBLICA presenta la constancia de
            duplicado de datos de nacimiento del alumno/a
            <strong>"{dataCertificado.student.nombre}"</strong> cédula nacional{' '}
            <strong>"{dataCertificado.student.identificacion}"</strong> de el
            centro educativo <strong>"{state.institucion.nombre}"</strong> se
            encuentra activo en el centro educativo.
          </div>
        )
      case 'infLog':
        return <LogrosAsignaturas />
      case 'ctfEst':
        return (
          <TablaNotas
            student={dataCertificado.student}
            institucion={state.institucion}
          />
        )

      default:
    }
  }

  const generarCertificado = async (data) => {
    setShowForm(false)
    if (typeCertification.component === 'ctfEst') {
      await actions.getCertInfoNotas(
        data.group.id,
        data.student.id,
        data.asignatura.id === 'all' ? '' : data.asignatura.id
      )
    }
    if (typeCertification.component === 'infLog') {
      await actions.getCertInfoLogros(
        data.group.id,
        data.student.id,
        data.asignatura.id === 'all' ? '' : data.asignatura.id
      )
    }
    setDataCertificado(data)
    setShowCertificado(true)
  }

  const goBackCertificado = () => {
    setShowCertificado(false)
    setShowForm(true)
  }

  const goBackForm = () => {
    seTypeCertification(null)
    setShowForm(false)
  }

  if (showForm && typeCertification) {
    return (
      <>
        <Back onClick={() => goBackForm()}>
          <BackIcon />
          <BackTitle>Regresar</BackTitle>
        </Back>
        <FormFilterCertificaciones
          generarCertificado={generarCertificado}
          typeCertification={typeCertification}
        />
      </>
    )
  }

  if (showCertificado) {
    return (
      <>
        <Back onClick={() => goBackCertificado()}>
          <BackIcon />
          <BackTitle>Regresar</BackTitle>
        </Back>
        <TemplateDownload
          dataCertificado={dataCertificado}
          student={dataCertificado.student}
          group={dataCertificado.group}
          institucion={state.institucion}
          typeCertification={typeCertification}
        >
          {renderContentCertificado()}
        </TemplateDownload>
      </>
    )
  }

  return (
    <>
      <Content>
        {cards.map((item, i) => {
          return (
            <DisplayCardInfo>
              <ContentCard onClick={() => goTo(item)}>
                <h6>{item.title}</h6>
                <p>{item.description}</p>
              </ContentCard>
            </DisplayCardInfo>
          )
        })}
      </Content>
    </>
  )
}
const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`
const Back = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 5px;
  margin-bottom: 20px;
`

const BackTitle = styled.span`
  color: #000;
  font-size: 14px;
  font-size: 16px;
`
const ContentCard = styled.div`
  padding: 5%;
  cursor: pointer;

  h6 {
    text-transform: uppercase;
  }
  p {
    font-size: 14px;
  }
`
export default Certificaciones
