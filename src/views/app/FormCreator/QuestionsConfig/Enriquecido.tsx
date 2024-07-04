import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import { Switch, Typography } from '@material-ui/core'
import styled from 'styled-components'

import '../../../../assets/css/sass/containerStyles/report.scss'
import { useTranslation } from 'react-i18next'

const Enriquecido = (props) => {
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
        <div>
          <StyledDivContainer>
            <Switch
              checked={!!props.question.config.charLimits} color='primary' onClick={(e) => {
                props.onConfigChange(!props.question.config.charLimits, 'charLimits')
              }}
            />
            <Typography>
              {t('formularios>crear_formulario>question_config>limitar_caracteres', 'Limitar número de caracteres')}
            </Typography>
          </StyledDivContainer>
          {props.question.config.charLimits &&
            <StyledDivContainer>
              <Input
                value={props.question.config.min} style={{ width: '4rem', margin: '10px' }} placeholder='min' type='number' onChange={(e) => {
                  props.onConfigChange(e.target.value, 'min')
                }}
              />
              <Input
                value={props.question.config.max} style={{ width: '4rem', margin: '10px' }} placeholder='max' type='number' onChange={(e) => {
                  props.onConfigChange(e.target.value, 'max')
                }}
              />
            </StyledDivContainer>}
        </div>
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
          {props.question.config.tooltip
            ? <Input
                type='text' value={props.question.config.tooltipText} onChange={(e) => {
                  props.onConfigChange(e.target.value, 'tooltipText')
                }}
              />
            : null}
        </div>

      </Col>
    </Row>
  )
}
const StyledDivContainer = styled.div`
    display: flex;
    align-items: center;
`
export default Enriquecido
