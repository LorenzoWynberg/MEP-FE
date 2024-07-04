import React, { FunctionComponent } from 'react'
import { FormGroup, FormFeedback, Col, CustomInput } from 'reactstrap'
import { Field } from '../Interfaces.ts'
import { TooltipLabel } from '../styles.tsx'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { listasPredefinidas } from '../utils/Options'

type Props = {
  field: Field;
  register: any;
};

const Checklist: FunctionComponent<Props> = (props) => {
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
      <Col sm={10}>
        {options.length > 0
          ? (
              options.map((option, i) => {
                return (
                  <CustomInput
                    key={`${props.field.id}_${i}`}
                    color='primary'
                    type='checkbox'
                    id={`${props.field.id}_${i}`}
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
                    label={option.nombre || option.label || option}
                    inline={props.field.orientation === 'row'}
                    disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)}
                    row
                  />
                )
              })
            )
          : (
            <div>Opciones por definir</div>
            )}
      </Col>
      <FormFeedback>
        {props.errors[`${props.field.id}`]
          ? 'Este campo es requerido o fallo una validacion'
          : null}
      </FormFeedback>
    </FormGroup>
  )
}

export default withRouter(Checklist)
