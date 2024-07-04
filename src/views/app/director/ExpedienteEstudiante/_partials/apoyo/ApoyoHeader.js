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
          {t('estudiantes>expediente>apoyos_edu>apoyos_mater_tech>dependencia', 'Dependencia (requerido)')}
        </HeaderLabelContainer>
                                 </Col>}
      <Col>
        <HeaderLabelContainer>
          {t('estudiantes>expediente>apoyos_edu>tipo_apoyo', 'Tipo de apoyo (requerido)')}
        </HeaderLabelContainer>
      </Col>
      <Col>
        <HeaderLabelContainer>
          {t('estudiantes>expediente>apoyos_edu>detalle', 'Detalle del apoyo (opcional)')}
        </HeaderLabelContainer>
      </Col>
      {props.apoyosMateriales && <Col>
        <HeaderLabelContainer>
          {t('estudiantes>expediente>apoyos_edu>apoyos_mater_tech>verificacion', '¿Se verificó el la recepción del apoyo?')}
        </HeaderLabelContainer>
                                 </Col>}
      <Col>
        <HeaderLabelContainer>
          {t('estudiantes>expediente>apoyos_edu>apoyos_organi>fecha_aprob', 'Fecha de aprobación (requerido)')}
        </HeaderLabelContainer>
      </Col>
      <Col>
        <HeaderLabelContainer>
          {t('estudiantes>expediente>apoyos_edu>fecha_levan', 'Fecha de levantamiento (requerido)')}
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
