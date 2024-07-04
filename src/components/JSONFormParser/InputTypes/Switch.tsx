import React from 'react'
import { TooltipLabel } from '../styles.tsx'
import { IOSSwitch } from '../../IosSwitch.tsx'

const SwitchInput = (props) => {
  return (
    <div>
      <TooltipLabel field={props.field} />
      <IOSSwitch
        disabled={!props.editable || props.readOnlyFields?.includes(props.field.id)}
        name={props.field.id}
        inputRef={props.register({
          required: props.field.config?.required
        })}
      />
    </div>
  )
}

export default SwitchInput
