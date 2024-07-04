import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import { Switch, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const Escrita = (props) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col sm={12} md={6}>
        <StyledDivContainer>
          <Switch
            checked={props.question.config.required}
            color='primary'
            onClick={(e) => {
						  props.onConfigChange(
						    !props.question.config.required,
						    'required'
						  )
            }}
          />
          <Typography>{t('formularios>crear_formulario>question_config>requerida', 'Requerida')}</Typography>
        </StyledDivContainer>
        <StyledDivContainer>
          <Switch
            checked={props.question.config.isEmail}
            color='primary'
            onClick={(e) => {
						  props.onConfigChange(
						    !props.question.config.isEmail,
						    'isEmail'
						  )
            }}
          />
          <Typography>{t('formularios>crear_formulario>question_config>formato_correo', 'Formato de correo electrónico')}</Typography>
        </StyledDivContainer>
        {!props.question.config.numericFields && (
          <div>
            <StyledDivContainer>
              <Switch
                checked={
									!!props.question.config.charLimits
								}
                color='primary'
                onClick={(e) => {
								  props.onConfigChange(
								    !props.question.config.charLimits,
								    'charLimits'
								  )
                }}
              />
              <Typography>
                {t('formularios>crear_formulario>question_config>limitar_caracteres', 'Limitar número de caracteres')}
              </Typography>
            </StyledDivContainer>
            {props.question.config.charLimits && (
              <StyledDivContainer>
                <Input
                  value={props.question.config.min}
                  style={{ width: '4rem', margin: '10px' }}
                  placeholder='min'
                  type='number'
                  onChange={(e) => {
									  props.onConfigChange(
									    e.target.value,
									    'min'
									  )
                  }}
                />
                <Input
                  value={props.question.config.max}
                  style={{ width: '4rem', margin: '10px' }}
                  placeholder='max'
                  type='number'
                  onChange={(e) => {
									  props.onConfigChange(
									    e.target.value,
									    'max'
									  )
                  }}
                />
              </StyledDivContainer>
            )}
          </div>
        )}
        <StyledDivContainer>
          <Switch
            checked={!!props.question.config.mask}
            color='primary'
            onClick={(e) => {
						  props.onConfigChange(
						    !props.question.config.mask,
						    'mask'
						  )
            }}
          />
          <Typography>{t('formularios>crear_formulario>question_config>mascara', 'Mascara')}</Typography>
        </StyledDivContainer>
        {props.question.config.mask && (
          <div>
            <StyledDivContainer>
              <Input
                value={props.question.config.maskPattern}
                style={{ margin: '10px' }}
                type='text'
                onChange={(e) => {
								  props.onConfigChange(
								    e.target.value,
								    'maskPattern'
								  )
                }}
              />
            </StyledDivContainer>
          </div>
        )}
        <StyledDivContainer>
          <Switch
            checked={
							!!props.question.config.numericFields
						}
            color='primary'
            onClick={(e) => {
						  props.onConfigChange(
						    !props.question.config.numericFields,
						    'numericFields'
						  )
            }}
          />
          <Typography>{t('formularios>crear_formulario>question_config>limitar_campos', 'Limitar a campos numéricos')}</Typography>
        </StyledDivContainer>
        {props.question.config.numericFields && (
          <div>
            <StyledDivContainer>
              <Input
                value={props.question.config.placeholderText}
                style={{ width: '4rem', margin: '10px' }}
                placeholder='0'
                type='number'
                onChange={(e) => {
								  props.onConfigChange(
								    e.target.value,
								    'placeholderText'
								  )
                }}
              />
              <Typography>{t('formularios>crear_formulario>question_config>decimales', 'decimales')}</Typography>
            </StyledDivContainer>
          </div>
        )}
      </Col>
      <Col sm={12} md={6}>
        {!props.question.config.numericFields && (
          <div>
            <StyledDivContainer>
              <Switch
                checked={
									!!props.question.config.placeholder
								}
                color='primary'
                onClick={(e) => {
								  props.onConfigChange(
								    !props.question.config.placeholder,
								    'placeholder'
								  )
                }}
              />
              <Typography>{t('formularios>crear_formulario>question_config>texto_ejemplo', 'Texto de ejemplo')}</Typography>
            </StyledDivContainer>
            {props.question.config.placeholder
              ? (
                <Input
                  value={props.question.config.placeholderText}
                  placeholder='Ingrese texto ejemplo'
                  onChange={(e) => {
								  props.onConfigChange(
								    e.target.value,
								    'placeholderText'
								  )
                  }}
                />
                )
              : null}
          </div>
        )}

        <div>
          <StyledDivContainer>
            <Switch
              checked={
								!!props.question.config.tooltip
							}
              color='primary'
              onClick={(e) => {
							  props.onConfigChange(
							    !props.question.config.tooltip,
							    'tooltip'
							  )
              }}
            />
            <Typography>{t('formularios>crear_formulario>question_config>requiere_ayuda', 'Requiere texto de ayuda')}</Typography>
          </StyledDivContainer>
          <div style={{ paddingLeft: '13px' }}>
            {props.question.config.tooltip
              ? (
                <Input
                  type='text'
                  value={props.question.config.tooltipText}
                  onChange={(e) => {
								  props.onConfigChange(
								    e.target.value,
								    'tooltipText'
								  )
                  }}
                />
                )
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

export default Escrita
