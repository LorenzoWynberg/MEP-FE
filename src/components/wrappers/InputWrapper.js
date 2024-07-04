import React from 'react'

const InputWrapper = (props) => {
  return (
    <div className={props.classNames ? props.classNames + ' input-wrapper w-100' : ' input-wrapper w-100'}>
      <div className='input-styles d-inline-block mr-1 w-100 h-100 p-0'>
        {props.children}
      </div>
    </div>
  )
}

export default InputWrapper
