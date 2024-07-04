import React from 'react'
import { Typography } from '@material-ui/core'
import { Input } from 'reactstrap'
import { IPropsViewQuestion } from '../Types/types'
import { useTranslation } from 'react-i18next'

const RespuestaEscrita = (props: IPropsViewQuestion) => {
  const { t } = useTranslation()
  if (props.active) {
    return (
      <Typography variant='caption' style={{ marginTop: '1rem', marginLeft: '1rem', color: '#848484' }}>
        {props.question.config.placeholder ? props.question.config.placeholderText : t('formularios>formulario_respuestas>respuesta_corta', 'Respuesta corta')}
      </Typography>
    )
  }

  return (
    !props.active &&
      <Input
        type={props.question.config.numericFields ? 'number' : 'text'}
        disabled={(props.disabled) ? 'disabled' : ''}
        placeholder={props.question.config.placeholder ? props.question.config.placeholderText : t('formularios>formulario_respuestas>respuesta_corta', 'Respuesta corta')}
        name={props.question.id}
        min={!props.question.config.numericFields ? props.question.config.min : null}
        max={!props.question.config.numericFields ? props.question.config.max : null}
        onChange={(event: any) => {
          if (props.question.config.numericFields) {
            !Number.isNaN(event.target.value) && props.handleOnChangeValue(event.target.value)
          } else if (props.question.config.charLimits) {
            if (props.question.config.max) {
              if (parseInt(props.question.config.max) >= event.target.value.length) {
                props.handleOnChangeValue(event.target.value)
              }
            } else {
              props.handleOnChangeValue(event.target.value)
            }
          } else {
            props.handleOnChangeValue(event.target.value)
          }
        }}
        value={props.value}
        onKeyPress={(event: any) => props.handleKeyPress(event)}
      />
  )
}

export default RespuestaEscrita
