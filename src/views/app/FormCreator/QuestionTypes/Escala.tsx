import React, { useState, useEffect } from 'react'
import { Radio } from '@material-ui/core'
import styled from 'styled-components'
import '../../../../assets/css/sass/containerStyles/report.scss'
import { Input, Col } from 'reactstrap'
import { range } from '../../../../utils/range'
import Rating from '@material-ui/lab/Rating'
import { useTranslation } from 'react-i18next'

const Escala = (props) => {
  const [optionsArray, setOptionsArray] = useState([])
  const { t } = useTranslation()
  //
  useEffect(() => {
    setOptionsArray(
      range(
        parseInt(props.question.min),
        parseInt(props.question.max) + 1
      )
    )
  }, [props.question.min, props.question.max, props.value])

  return (
    <div style={!props.active ? { display: 'flex', flexWrap: 'wrap' } : {}}>
      {!props.active
        ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{props.question.minLabel}</span>
            {props.question.rateType === 'estrellas'
              ? (
                <Rating
                  disabled={props.disabled}
                  value={props.value}
                  max={parseInt(props.question.max)}
                  onChange={(e, newValue) => {
							  props.handleOnChangeValue(
							    newValue,
							    props.question.id
							  )
                  }}
                />
                )
              : (
					  optionsArray.map((el) => {
					    return (
  <div
    style={{
									  display: 'flex',
									  flexDirection: 'column',
									  alignItems: 'center',
									  justifyContent: 'center'
    }}
  >
    <Radio
      disabled={props.disabled}
      color='primary'
      checked={props.value >= parseInt(el)}
      onClick={() => {
										  props.handleOnChangeValue(
										    el,
										    props.question.id
										  )
      }}
    />
    {el}
  </div>
					    )
					  })
                )}
            <span>{props.question.maxLabel}</span>
          </div>
          )
        : (
          <>
            <Col xs='12' md='3'>
              <div
                style={{
							  display: 'flex',
							  alignItems: 'center',
							  marginBottom: '5px'
                }}
              >
                <span>{t('formularios>formulario_respuestas>simbolo', 'Símbolo')}:</span>
                <Input
                  type='select'
                  value={props.question.rateType}
                  defaultValue={null}
                  onChange={(e) => {
								  props.onChange(e.target.value, 'rateType')
                  }}
                >
                  <option
                    value=''
                    selected
                    disabled
                    hidden
                  />
                  <option value='estrellas'>{t('formularios>formulario_respuestas>estrellas', 'Estrellas')}</option>
                  <option value='numeros'>{t('formularios>formulario_respuestas>numeros', 'Números')}</option>
                </Input>
              </div>
              <div
                style={{
							  display: 'flex',
							  alignItems: 'center',
							  marginBottom: '5px',
							  marginLeft: '5px'
                }}
              >
                <Input
                  type='number'
                  value={props.question.min}
                  onChange={(e) => {
								  if (
								    e.target.value >= 0 &&
										(props.question.max > e.target.value ||
											e.target.value === 0 ||
											!e.target.value ||
											!props.question.max)
								  ) {
								    props.onChange(e.target.value, 'min')
								  }
                  }}
                />
                <span
                  style={{
								  marginLeft: '10px',
								  marginRight: '10px'
                  }}
                >
                  a
                </span>
                <Input
                  type='number'
                  value={props.question.max}
                  onChange={(e) => {
								  if (
								    e.target.value > 0 &&
										(props.question.min < e.target.value ||
											e.target.value === 0 ||
											!e.target.value ||
											!props.question.min)
								  ) {
								    props.onChange(e.target.value, 'max')
								  }
                  }}
                />
              </div>
              <div
                style={{
							  display: 'flex',
							  alignItems: 'center',
							  marginBottom: '5px'
                }}
              >
                <span style={{ marginRight: '5px' }}>
                  {props.question.min}
                </span>
                <Input
                  value={props.question.minLabel}
                  onChange={(e) => {
								  props.onChange(e.target.value, 'minLabel')
                  }}
                  type='text'
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '5px' }}>
                  {props.question.max}
                </span>
                <Input
                  value={props.question.maxLabel}
                  onChange={(e) => {
								  props.onChange(e.target.value, 'maxLabel')
                  }}
                  type='text'
                />
              </div>
            </Col>
          </>
          )}
    </div>
  )
}

const StyledDivContainer = styled.div`
	margin-bottom: -7px;
`

export default Escala
