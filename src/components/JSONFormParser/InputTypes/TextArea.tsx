import React, { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, FormFeedback } from 'reactstrap'
import { Field } from '../Interfaces.ts'
import { TooltipLabel, StyledFormGroup } from '../styles.tsx'

type Props = {
  field: Field;
  register: any;
};

const TextArea: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation()
  return (
    <StyledFormGroup className='position-relative'>
      <TooltipLabel field={{ ...props.field, label: props.field.langKey ? t(props.field.langKey, props.field.label) : props.field.label }} />
      <Input
        type='textarea'
        style={props.field.config.onlyMayus ? { textTransform: 'uppercase' } : {}}
        name={`${props.field.id}`}
        innerRef={props.register({
          required: props.field.config.required
        })}
        readOnly={!props.editable || props.readOnlyFields?.includes(props.field.id)}
        placeholder={props.field.config.placeholder}
        onChange={(e) => {
          props.setValue(props.field.id, props.field.config.onlyMayus ? e.target.value.toUpperCase() : e.target.value)
        }}
        invalid={props.errors[`${props.field.id}`]}
      />
      <FormFeedback>
        {props.errors[`${props.field.id}`]
          ? 'Este campo es requerido o fallo una validación'
          : null}
      </FormFeedback>
    </StyledFormGroup>
  )
}

export default TextArea
