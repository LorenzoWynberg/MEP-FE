import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import { Switch, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const FechaConfigs = (props) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col sm={12}>
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
        <div>
          <StyledDivContainer>
            <Switch
              checked={!!props.question.config.rango} color='primary' onClick={(e) => {
                props.onConfigChange(!props.question.config.rango, 'rango')
              }}
            />
            <Typography>
              {t('formularios>crear_formulario>question_config>rango_fecha', 'Rango de fecha')}
            </Typography>
          </StyledDivContainer>
          {props.question.config.rango
            ? <div style={{ display: 'flex', alignItems: 'center' }}>
              {t('formularios>crear_formulario>question_config>desde', 'Desde')}: <Input
                value={props.question.config.min} style={{ margin: '10px' }} placeholder='min' type='date' onChange={(e) => {
                  props.onConfigChange(e.target.value, 'min')
                }}
                     />
              {t('formularios>crear_formulario>question_config>hasta', 'Hasta')}: <Input
                value={props.question.config.max} style={{ margin: '10px' }} placeholder='max' type='date' onChange={(e) => {
                          props.onConfigChange(e.target.value, 'max')
                        }}
                     />
            </div>
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
export default FechaConfigs
