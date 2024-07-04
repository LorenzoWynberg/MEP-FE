import React, { FunctionComponent } from 'react'
import { FormGroup, Col, CustomInput } from 'reactstrap'
import { Field } from '../Interfaces.ts'
import { TooltipLabel } from '../styles.tsx'
import { listasPredefinidas } from '../utils/Options'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

type Props = {
  field: Field;
  register: any;
};

const RadioInput: FunctionComponent<Props> = (props) => {
  const state = useSelector((store) => {
    return {
      selects: store.selects
    }
  })

  const renderOptions = () => {
    if (typeof props.field.options === 'string') {
      if (props.field.options.search('FromDB') > 0) {
        return state.selects[
          props.field.options.substr(0, props.field.options.length - 6)
        ]
      } else {
        return listasPredefinidas.find(item => item.id === props.field.options)?.options
      }
    } else {
      return props.field.options
    }
  }

  const options = renderOptions()
  return (
    <FormGroup tag='fieldset' className='position-relative'>
      <TooltipLabel field={props.field} />
      <Col sm={10} className={props.field.config.orientation === 'row' ? 'horizontal-orientation' : ''}>
        {options.length > 0
          ? (
              options.map((option, i) => {
                return (
                  <CustomInput
                    key={`${props.field.id}`}
                    color='primary'
                    type='radio'
                    id={`${props.field.id}`}
                    value={
                  option.id ||
                  option.nombre ||
                  option.value ||
                  option.label ||
                  option
                }
                    name={`${props.field.id}`}
                    innerRef={props.register({
                      required: props.field.config.required
                    })}
                    invalid={props.errors[`${props.field.id}`]}
                    defaultChecked={option.label === 'No'}
                    label={option.nombre || option.label || option}
                    disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)}
                  />
                )
              })
            )
          : (
            <div>Opciones por definir</div>
            )}
      </Col>
      <FormFeedbackSpan>
        {props.errors[`${props.field.id}`]
          ? 'Este campo es requerido o fallo una validacion'
          : null}
      </FormFeedbackSpan>
    </FormGroup>
  )
}

const FormFeedbackSpan = styled.span`
    color: red;
`

export default withRouter(RadioInput)
