import React, { FunctionComponent } from 'react'
import { Input, FormFeedback } from 'reactstrap'
import { Field } from '../Interfaces'
import { TooltipLabel, StyledFormGroup } from '../styles'

type Props = {
  field: Field;
  register: any;
};

const Date: FunctionComponent<Props> = (props) => {
  return (
    <StyledFormGroup className='position-relative'>
      <TooltipLabel field={props.field} />
      <Input
        type='date'
        name={`${props.field.id || props.field.label.replace(/\s/g, '_')}`}
        innerRef={props.register({
          required: props.field.config.required
        })}
        readOnly={!props.editable || props.readOnlyFields?.includes(props.field.id)}
        placeholder={props.field.config.placeholder}
        invalid={props.errors[`${props.field.id || props.field.label.replace(/\s/g, '_')}`]}
      />
      <FormFeedback>
        {props.errors[`${props.field.label.replace(/\s/g, '_')}`]
          ? 'Este campo es requerido o fallo una validación'
          : null}
      </FormFeedback>
    </StyledFormGroup>
  )
}

export default Date
