import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import { cloneDeep } from 'lodash'
import { Radio, Typography } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import { range } from '../../../../utils/range'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

/*
    * Ejemplo de matiz (no tensor)
        [
            [
                1,
                2,
                3,
                .
                .
                .
            ],
            [
                101,
                102,
                103,
                .
                .
                .
            ]
        ]

    * Ejemplo de tensor
        [
            [
                [[1,...] ...],
                [[2, ...] ...],
                [[3, ...] ...]
                .      .
                .        .
                .          .
            ],
            [
                [[1,...] ...],
                [[2, ...] ...],
                [[3, ...] ...]
                .      .
                .        .
                .          .
            ]
        ]

    * Acceder a valores dentro de una matriz
        mtrx[columna][fila]

    * Acceder a valores dentro de un tensor
        en este punto puede tener n cantidad de columns y n cantidad de filas
        mtrx[columna][fila][columna][fila]
*/

const MatrizDobleEje = (props) => {
  const handleAddRow = () => {
    props.onChange([...props.question.rows, { label: '' }], 'rows')
  }

  const { t } = useTranslation()

  const handleAddColumn = () => {
    props.onChange([...props.question.columns, { label: '' }], 'columns')
  }

  const onChange = (type, key, value, optionIdx) => {
    const elements = cloneDeep(props.question[type])
    elements[optionIdx][key] = value
    props.onChange(elements, type)
  }

  const remove = (type, idx) => {
    const elements = cloneDeep(props.question[type])
    elements.splice(idx, 1)
    props.onChange(elements, type)
  }

  const handleSelectValue = (colId, rowId, newValue = null) => {
    if (!newValue) {
      if (props.value && props.value[0]) {
        const _value = cloneDeep(props.value)
        if (!props.question.config.allowMultiple) {
          _value.forEach(element => {
            element[rowId] = 0
          })
        }
        _value[colId][rowId] = _value[colId][rowId] ? 0 : 1
        props.handleOnChangeValue(_value, props.question.id)
      } else {
        const _value = []
        range(props.question.columns.length).forEach((_) => {
          _value.push(range(props.question.rows.length).fill(0))
        })
        _value[colId][rowId] = 1
        props.handleOnChangeValue(_value, props.question.id)
      }
    } else {
      if (props.value && props.value[0]) {
        const _value = cloneDeep(props.value)
        _value[colId][rowId] = newValue
        props.handleOnChangeValue(_value, props.question.id)
      } else {
        const _value = []
        range(props.question.columns.length).forEach((_) => {
          _value.push(range(props.question.rows.length).fill(null))
        })
        _value[colId][rowId] = newValue
        props.handleOnChangeValue(_value, props.question.id)
      }
    }
  }

  const renderAnwser = (idx, i) => {
    if (!props.question.config.type) {
      return (
        <Radio
          color='primary' checked={props.value ? props.value[idx] ? props.value[idx][i] > 0 : false : false} onClick={() => {
            if (!props.disabled) { handleSelectValue(idx, i) }
          }}
        />
      )
    }
    switch (props.question.config.type) {
      case 'multi':
        return (
          <Input
            style={{ margin: '0 auto', width: '8rem' }} type='select' value={props.value && props.value[idx] ? props.value[idx][i] : null} onChange={(e) => {
              if (!props.disabled) {
                handleSelectValue(idx, i, e.target.value)
              }
            }}
          >
            <option disabled selected value style={{ display: 'none' }}> Seleccione una opción</option>
            {props.question.config.options && props.question.config.options.map(el => {
              return (
                <option value={el}>
                  {el}
                </option>
              )
            })}
          </Input>
        )
      case 'number':
        return (
          <Input
            style={{ margin: '0 auto', width: '8rem' }} type='number' value={props.value && props.value[idx] ? props.value[idx][i] : null} onChange={(e) => {
              if (!props.disabled) {
                handleSelectValue(idx, i, e.target.value)
              }
            }}
          />
        )
      case 'text':
        return (
          <Input
            style={{ margin: '0 auto', width: '8rem' }} type='text' value={props.value && props.value[idx] ? props.value[idx][i] : null} onChange={(e) => {
              if (!props.disabled) {
                handleSelectValue(idx, i, e.target.value)
              }
            }}
          />
        )
    }
  }

  return (
    <div style={{ overflow: 'hidden', overflowX: 'auto' }}>
      {
                props.active
                  ? <Row>

                    <Col sm={12} md={6}>
                      <div style={{ width: '100%' }}>
                        {/* rows */}
                        <Typography variant='caption'>
                          Filas
                        </Typography>
                        {props.question.rows.map((el, i) => {
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                              <span>{i + 1}.</span>
                              <Input
                                type='textarea'
                                value={el.label}
                                rows='1'
                                onChange={(e) => {
                                  const data = e.target.value.split('\n')
                                  if (data.length === 1) {
                                    onChange('rows', 'label', data[0], i)
                                  } else {
                                    props.onChange(data.map((el, idx) => ({ idx, label: el })), 'rows')
                                  }
                                }}
                                style={{
                                  height: '2rem',
                                  overflow: 'hidden',
                                  resize: 'none',
                                  padding: '0.3rem'
                                }}
                              />
                              <ClearIcon style={{ cursor: 'pointer' }} onClick={() => remove('rows', i)} />
                            </div>
                          )
                        })}
                        <div
                          style={{ color: colors.primary, cursor: 'pointer' }} onClick={() => {
                            handleAddRow()
                          }}
                        >
                          +{t('formularios>formulario_respuestas>agregar_fila', 'Agregar fila')}
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6}>
                      <div style={{ width: '100%' }}>
                        {/* columns */}
                        <Typography variant='caption'>
                          {t('formularios>formulario_respuestas>columnas', 'Columnas')}
                        </Typography>
                        {props.question.columns.map((el, i) => {
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                              <span>{i + 1}.</span>
                              <Input
                                type='textarea'
                                value={el.label}
                                rows='1'
                                onChange={(e) => {
                                  const data = e.target.value.split('\n')
                                  if (data.length === 1) {
                                    onChange('columns', 'label', data[0], i)
                                  } else {
                                    props.onChange(data.map((el, idx) => ({ idx, label: el })), 'columns')
                                  }
                                }}
                                style={{
                                  height: '2rem',
                                  overflow: 'hidden',
                                  resize: 'none',
                                  padding: '0.3rem'
                                }}
                              />
                              <ClearIcon style={{ cursor: 'pointer' }} onClick={() => remove('columns', i)} />
                            </div>
                          )
                        })}
                        <div
                          style={{ color: colors.primary, cursor: 'pointer' }} color='primary' onClick={() => {
                            handleAddColumn()
                          }}
                        >
                          +{t('formularios>formulario_respuestas>agregar_columna', 'Agregar columna')}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  : <>
                    <table style={{ width: '100%' }}>
                      <tr>
                        <th style={{ border: '1px solid gray' }} />
                        {props.question.columns.map(el => {
                          return <th style={{ border: '1px solid gray', textAlign: 'center' }}>{el.label}</th>
                        })}
                      </tr>
                      {props.question.rows.map((el, i) => {
                        return (
                          <tr style={{ border: '1px solid gray', backgroundColor: i % 2 !== 0 ? 'white' : '#D5D5D5' }}>
                            <td style={{ border: '1px solid gray', textAlign: 'left', paddingLeft: 5 }}>
                              {el.label}
                            </td>
                            {props.question.columns.map((item, idx) => {
                              return (
                                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                                  {
                                                renderAnwser(idx, i)
                                            }
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </table>
                  </>
            }
    </div>
  )
}

export default MatrizDobleEje
