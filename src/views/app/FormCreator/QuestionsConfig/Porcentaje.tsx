import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import { Switch, Typography } from '@material-ui/core'
import styled from 'styled-components'
import '../../../../assets/css/sass/containerStyles/report.scss'
import { useTranslation } from 'react-i18next'

const Porcentaje = (props) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col sm={12} md={6}>
        <StyledDivContainer>
          <Switch
            checked={props.question.config.required} color='primary' onClick={(e) => {
              props.onConfigChange(!props.question.config.required, 'required')
            }}
          />
          <Typography>
            {t('formularios>crear_formulario>question_config>requerida', 'Requerida')}
          </Typography>
        </StyledDivContainer>

        <StyledDivContainer>
          <Switch
            checked={!!props.question.config.requiredHundred} color='primary' onClick={(e) => {
              props.onConfigChange(!props.question.config.requiredHundred, 'requiredHundred')
            }}
          />
          <Typography>
            {t('formularios>crear_formulario>question_config>requiere_100', 'Requiere que sume al 100%')}
          </Typography>
        </StyledDivContainer>

        <div>
          <StyledDivContainer>
            <Switch
              checked={!!props.question.config.tooltip} color='primary' onClick={(e) => {
                props.onConfigChange(!props.question.config.tooltip, 'tooltip')
              }}
            />
            <Typography>
              {t('formularios>crear_formulario>question_config>requiere_ayuda', 'Requiere texto de ayuda')}
            </Typography>
          </StyledDivContainer>
          <div style={{ paddingLeft: '13px' }}>
            {props.question.config.tooltip
              ? <Input
                  type='text' value={props.question.config.tooltipText} onChange={(e) => {
                    props.onConfigChange(e.target.value, 'tooltipText')
                  }}
                />
              : null}
          </div>
        </div>
      </Col>
    </Row>
  )
}
const StyledDivContainer = styled.div`
    display: flex;
    align-items: center;
`
export default Porcentaje
