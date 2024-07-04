import React from 'react'
import Select, { StylesConfig } from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const ReactSelect = (props) => {
  const theme = useTheme()

  // const customStyles = {
  // 	option: (provided, state) => ({
  // 		...provided,
  // 		backgroundColor:
  // 			state.isSelected && `${theme.palette.primary.main} !important`,
  // 		':hover': {
  // 			color: '#fff important',
  // 			backgroundColor: `${theme.palette.primary.main} !important`
  // 		}
  // 	}),
  // 	menu: (provided, state) => ({
  // 		...provided,
  // 		color: '#fff'
  // 	}),
  // 	menuPortal: (provided, state) => ({
  // 		...provided,
  // 		zIndex: 8888
  // 	})
  // }

  return (
    <SelectStyled
      components={{ Input: CustomSelectInput }}
      className='react-select'
      classNamePrefix='react-select'
      noOptionsMessage={() => 'Sin opciones'}
      menuPortalTarget={document.body}
      {...props}
    />
  )
}

const SelectStyled = styled(Select)``
export default ReactSelect
