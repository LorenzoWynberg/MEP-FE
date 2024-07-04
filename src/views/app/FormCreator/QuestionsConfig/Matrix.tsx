import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import { Switch, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { cloneDeep } from 'lodash'
import colors from 'Assets/js/colors'
import '../../../../assets/css/sass/containerStyles/report.scss'
import { useTranslation } from 'react-i18next'

const Matrix = (props) => {
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
        <StyledDivContainer>
          <Switch
            checked={!!(props.question.config.allowMultiple || props.question.config.type)} color='primary' onClick={(e) => {
              props.onConfigChange(!props.question.config.allowMultiple, 'allowMultiple')
            }}
          />
          <Typography>
            {t('formularios>crear_formulario>question_config>permite_multiples_respuestas', 'Permite multiples respuestas por fila')}
          </Typography>
        </StyledDivContainer>
        <StyledDivContainer>
          <Switch
            checked={props.question.config.type === 'text'} color='primary' onClick={(e) => {
              if (props.question.config.type === 'text') {
                props.onConfigChange(false, 'type')
              } else {
                props.onConfigChange('text', 'type')
              }
            }}
          />
          <Typography>
            {t('formularios>crear_formulario>question_config>habilitar_campo_texto', 'Habilitar campo de texto')}
          </Typography>
        </StyledDivContainer>
        <StyledDivContainer>
          <Switch
            checked={props.question.config.type === 'number'} color='primary' onClick={(e) => {
              if (props.question.config.type === 'number') {
                props.onConfigChange(false, 'type')
              } else {
                props.onConfigChange('number', 'type')
              }
            }}
          />
          <Typography>
            {t('formularios>crear_formulario>question_config>limitar_campos_numericos', 'Limitar a campos de numéricos')}
          </Typography>
        </StyledDivContainer>
        <StyledDivContainer>
          <Switch
            checked={props.question.config.type === 'multi'} color='primary' onClick={(e) => {
              if (props.question.config.type === 'multi') {
                props.onConfigChange(false, 'type')
              } else {
                props.onConfigChange('multi', 'type')
              }
            }}
          />
          <Typography>
            {t('formularios>crear_formulario>question_config>habilitar_seccion_unica', 'Habilitar selección única')}
          </Typography>
        </StyledDivContainer>
        {props.question.config.type === 'multi' && <div style={{ paddingLeft: '13px' }}>
          {props.question.config.options && props.question.config.options.map((el, idx) => {
            return (
              <div>
                <Input
                  type='text' style={{ width: '8rem', marginBottom: '1rem' }} value={el} onChange={(e) => {
                    let _options = cloneDeep(props.question.config.options)
                    _options[idx] = e.target.value
                    props.onConfigChange(_options, 'options')
                  }}
                />
              </div>
            )
          })}
          <span
            style={{ color: colors.primary, cursor: 'pointer' }} onClick={() => {
              if (props.question.config.options) {
                props.onConfigChange([props.question.config.options, ''], 'options')
              } else {
                props.onConfigChange([''], 'options')
              }
            }}
          >+ {t('formularios>crear_formulario>question_config>agregar_opcion', 'Agregar opción')}
          </span>
        </div>}

      </Col>
    </Row>
  )
}
const StyledDivContainer = styled.div`
    display: flex;
    align-items: center;
`
export default Matrix
