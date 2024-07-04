import React, { FunctionComponent, useState, useEffect } from 'react'
import { Field } from '../Interfaces'
import { TooltipLabel, StyledFormGroup } from '../styles.tsx'
import Datetime from 'react-datetime'
import './dateYear-styles.css'

type Props = {
  field: Field;
  register: any;
};

const DateYear: FunctionComponent<Props> = (props) => {
  const [value, setValue] = useState(null)
  const values = typeof props?.getValues === 'function' ? props?.getValues(props.field.id) : null
  useEffect(() => {
    const _val = typeof props?.getValues === 'function' ? props?.getValues(props.field.id) : null
    if (_val && value === null) {
      setValue(new Date(_val, 0, 1))
    }
  }, [values])

  const handleChange = (e) => {
    // let year = e.year ? e.year() : e.getFullYear()
    props?.setValue(props.field.id, e)
    setValue(e)
  }

  return (
    <StyledFormGroup className='position-relative'>
      <TooltipLabel field={props.field} />
      <Datetime
        closeOnSelect
        inputProps={{ className: `${props.errors[`${props.field.id || props.field.label.replace(/\s/g, '_')}`] && 'is-invalid'} form-control`, disabled: !props.editable }}
        dateFormat='YYYY'
        timeFormat={false}
        value={value}
        onChange={(e) => {
          const aux = String(e?.valueOf())?.length >= 4 ? e?.valueOf() : null
          const date = new Date(aux)
          const year = date.getFullYear()

          handleChange(aux ? year : e)
        }}
      />
      <input
        type='hidden'
        name={`${props.field.id || props.field.label.replace(/\s/g, '_')}`}
        ref={props.register({
          required: props.field.config.required
        })}
        disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)}
        placeholder={props.field.config.placeholder}
      />
      <span style={{ color: 'red' }}>
        {props.errors[`${props.field.id || props.field.label.replace(/\s/g, '_')}`]
          ? 'Este campo es requerido o fallo una validación'
          : null}
      </span>
    </StyledFormGroup>
  )
}

DateYear.defaultProps = {
  getValues: () => {}
}

export default DateYear
