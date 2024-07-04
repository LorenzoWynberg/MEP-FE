import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import { Switch, Typography } from '@material-ui/core'
import styled from 'styled-components'
import '../../../../assets/css/sass/containerStyles/report.scss'
import { useTranslation } from 'react-i18next'

const Multiple = (props) => {
  const handleChange = (e) => {

  }
  const { t } = useTranslation()
  return (
    <Row>
      <Col sm={12}>
        <StyledDivContainer>
          <Switch
            checked={!!props.question.config.required} color='primary' onClick={(e) => {
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
              checked={!!props.question.config.conditions} color='primary' onClick={(e) => {
                props.onConfigChange(!props.question.config.conditions, 'conditions')
              }}
            />
            <Typography>
              {t('formularios>crear_formulario>question_config>agregar_condiciones', 'Agregar condicionales a las opciones')}
            </Typography>
          </StyledDivContainer>
        </div>
        <div>
          <StyledDivContainer>
            <Switch
              checked={!!props.question.config.columnsLimit} color='primary' onClick={(e) => {
                props.onConfigChange(!props.question.config.columnsLimit, 'columnsLimit')
              }}
            />
            <Typography>
              {t('formularios>crear_formulario>question_config>mostrar_respuestas', 'Mostrar respuestas en columnas')}
            </Typography>
          </StyledDivContainer>
          {props.question.config.columnsLimit &&
            <div>
              <StyledDivContainer>
                <Input
                  name='oferta'
                  id='selectColumns'
                  type='select'
                  onChange={(e) => {
                    props.onConfigChange(e.target.value, 'numberColumns')
                  }}
                  placeholder='Seleccionar'
                >
                  <option>
                    {'Número de columnas...'}
                  </option>
                  <option value='2'>
                    {'2'}
                  </option>
                  <option value='3'>
                    {'3'}
                  </option>
                </Input>
              </StyledDivContainer>
            </div>}
        </div>
      </Col>
    </Row>
  )
}
const StyledDivContainer = styled.div`
    display: flex;
    align-items: center;
`
export default Multiple
