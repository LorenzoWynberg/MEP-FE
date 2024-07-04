import React from 'react'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

interface IProps {
  onClick: Function
  // label?: string
}

const GoBack: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  GoBack.defaultProps = {
    onClick: () => {}
    // label: t('general>regresar','Regresar'),
  }

  const { onClick } = props
  return (
    <Back onClick={() => onClick()}>
      <BackIcon />
      <BackTitle>{t('edit_button>regresar', 'Regresar')}</BackTitle>
    </Back>
  )
}

const Back = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 5px;
  margin-bottom: 20px;
`

const BackTitle = styled.span`
  color: #000;
  font-size: 14px;
  font-size: 16px;
`
export default GoBack
