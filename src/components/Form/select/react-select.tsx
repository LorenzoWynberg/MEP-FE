import React from 'react'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'

const ReactSelect = (props) => {
  return (
    <Select
      components={{ Input: CustomSelectInput }}
      className='react-select'
      classNamePrefix='react-select'
      noOptionsMessage={() => 'Sin opciones'}
      styles={{
			  menuPortal: (base) => ({
			    ...base,
			    zIndex: 9998
			  })
      }}
      {...props}
    />
  )
}

export default ReactSelect
