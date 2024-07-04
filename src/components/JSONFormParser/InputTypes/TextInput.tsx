import React, { FunctionComponent } from 'react'
import { Input, FormFeedback } from 'reactstrap'
import { Field } from '../Interfaces'
import { TooltipLabel, StyledFormGroup } from '../styles.tsx'
import ReactInputMask from 'react-input-mask'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type Props = {
	field: Field
	register: any
}

const TextInput: FunctionComponent<Props> = (props) => {
  let type = props.field?.config?.type
  if (!props.field?.config?.type) {
    type = props.field.config.numbersOnly ? 'number' : 'text'
  }
  const { t } = useTranslation()
  return (
    <StyledFormGroup className='position-relative'>
      <TooltipLabel field={{ ...props.field, label: props.field.langKey ? t(props.field.langKey, props.field.label) : props.field.label }} />

      {props.field.config.mask?.length > 0
        ? (
          <Controller
            name={`${props.field.id}`}
            control={props.control}
            as={
              <ReactInputMask
                mask={props.field.config.mask}
                className='form-control'
                type='text'
                readOnly={
								!props.editable ||
								props.readOnlyFields?.includes(props.field.id)
							}
                invalid={props.errors[`${props.field.id}`]}
                placeholder={props.field.config.placeholder}
              />
					}
            rules={{ required: props.field.config.required }}
          />
          )
        : (
          <Input
            type={type}
            name={`${props.field.id}`}
            innerRef={props.register({
					  required: props.field.config.required
            })}
            className={props.active && 'active__field'}
            readOnly={
						!props.editable ||
						props.readOnlyFields?.includes(props.field.id)
					}
            placeholder={props.field.config.placeholder}
            min={0}
            step='0.01'
            onKeyDown={(evt) =>
					  props.field.config.numbersOnly &&
						(evt.key === 'e' || evt.key === 'E') &&
						evt.preventDefault()}
            onChange={(e) => {
					  if (
					    props.field.config.decimal &&
							e.target.value?.split('.')[1]?.length >
								props.field.config.decimal
					  ) {
					    props.setValue(
					      props.field.id,
					      Number(
					        Number(e.target.value).toFixed(
					          props.field.config.decimal
					        )
					      )
					    )
					    return
					  }
					  props.setValue(
					    props.field.id,
					    props.field.config.onlyMayus
					      ? e.target.value.toUpperCase()
					      : e.target.value
					  )
            }}
            invalid={props.errors[`${props.field.id}`]}
          />
          )}
      {props.field.config.mask?.length
        ? (
          <span style={{ color: 'red' }}>
            {props.errors[`${props.field.id}`]
					  ? 'Este campo es requerido'
					  : null}
          </span>
          )
        : (
          <FormFeedback>
            {props.errors[`${props.field.id}`]
					  ? 'Este campo es requerido'
					  : null}
          </FormFeedback>
          )}
    </StyledFormGroup>
  )
}

export default TextInput
