import React from 'react'
import { Row, Col } from 'reactstrap'
import IntlMessages from '../../../../../../helpers/IntlMessages'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const ApoyoItem = (props) => {
  const { t } = useTranslation()
  return (
    <Row>
      {props.apoyosMateriales && <Col>
        <HeaderLabelContainer>
          {t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>apoyos_personales>dependencia', 'Dependencia (requerido)')}
        </HeaderLabelContainer>
                                 </Col>}
      <Col>
        <HeaderLabelContainer>
          {t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>apoyos_personales>tipo_apoyo', 'Tipo de apoyo (requerido)')}
        </HeaderLabelContainer>
      </Col>
      <Col>
        <HeaderLabelContainer>
          {t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>apoyos_personales>detalle_apoyo', 'Detalle del apoyo (opcional)')}
        </HeaderLabelContainer>
      </Col>
      {props.apoyosMateriales && <Col>
        <HeaderLabelContainer>
          <IntlMessages id='apoyo.verified' />
        </HeaderLabelContainer>
                                 </Col>}
      <Col>
        <HeaderLabelContainer>
          {t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>apoyos_personales>fecha_aprovacion', 'Fecha de aprobación (requerido)')}
        </HeaderLabelContainer>
      </Col>
      <Col>
        <HeaderLabelContainer>
          {t('estudiantes>matricula_estudiantil>matricular_estudiante>apoyos_educativos>apoyos_personales>fecha_levantamiento', 'Fecha de levantamiento (requerido)')}
        </HeaderLabelContainer>
      </Col>
      <Col xs={1} />
    </Row>
  )
}

const HeaderLabelContainer = styled.div`
    text-align: center;
`

export default ApoyoItem
