import React from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import IntlMessages from 'Helpers/IntlMessages'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const NavigationContainer = (props) => {
  const { t } = useTranslation()
  return (
    <ArrowContainer
      onClick={(e) => {
        props.goBack()
      }}
    >
      <ArrowBackIosIcon />
      <H4Styled>
        {t('edit_button>regresar', 'REGRESAR')}
      </H4Styled>
    </ArrowContainer>
  )
}

const ArrowContainer = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 150px;
`
const H4Styled = styled.h4`
  margin: 0;
`

export default NavigationContainer
