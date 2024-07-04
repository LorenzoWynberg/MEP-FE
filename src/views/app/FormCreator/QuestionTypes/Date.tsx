import React from 'react'
import { Input } from 'reactstrap'
import { IPropsViewQuestion } from '../Types/types'

const DateInput = (props: IPropsViewQuestion) => {
  if (props.active) return <br />
  return (
    <div>
      <div>
        <Input
          type='date'
          disabled={(props.disabled) ? 'disabled' : ''}
          value={props.value}
          min={props.question.config.min}
          max={props.question.config.max}
          style={{ width: '16rem', paddingRight: '0 ' }}
          onChange={(event: any) => { props.handleOnChangeValue(event.target.value) }}
        />
      </div>
    </div>
  )
}

export default DateInput
